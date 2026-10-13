/**
 * PROFILEHUB · Validation Logic
 *
 * 1. Validate request từ client (zod).
 * 2. Validate output của LLM extraction theo CV Intelligence Rules:
 *    - Metric phải TRUY VẾT được về lời user (chống bịa số).
 *    - Không lưu nguyên văn (verbatim) tin nhắn.
 *    - Achievement > Task: không có result/metric => hạ xuống task_claim.
 *    - Evidence > Self Claim: không có url/artifact => self_claim.
 */
import { z } from "npm:zod@3.23.8";
import { ApiError } from "./http.ts";
import { clamp, isVerbatim, normalizeText, numericTokens, unionCI } from "./text.ts";
import type {
  ExtractedData,
  ExtractionOutput,
  Metric,
  ValidatedAchievement,
  ValidatedExtraction,
} from "./types.ts";

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_SESSION_TURNS = 40;
export const MIN_MESSAGE_INTERVAL_MS = 700;

/* ────────────────────────── Request schemas ────────────────────────── */

export const StartRequestSchema = z
  .object({
    locale: z.enum(["vi", "en"]).optional(),
    force_new: z.boolean().optional(),
  })
  .strict();

export const MessageRequestSchema = z
  .object({
    session_id: z.string().uuid(),
    message: z.string().min(1).max(MAX_MESSAGE_CHARS),
  })
  .strict();

export const FinishRequestSchema = z.object({ session_id: z.string().uuid() }).strict();

export function parseBody<S extends z.ZodTypeAny>(schema: S, raw: unknown): z.infer<S> {
  const r = schema.safeParse(raw);
  if (!r.success) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", r.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    })));
  }
  return r.data;
}

/* ────────────────────────── Metric verification ────────────────────────── */

const HEDGE_RE = /\b(khoang|uoc chung|uoc tinh|xap xi|approx|approximately|about|around|roughly)\b|\btam\s*\d|~/;

export function isHedged(message: string): boolean {
  return HEDGE_RE.test(normalizeText(message)) || message.includes("~");
}

/**
 * Metric hợp lệ khi `raw` xuất hiện trong lời user (tin nhắn hiện tại hoặc
 * tin nhắn user liền trước), hoặc mọi con số trong `raw` đều có trong lời user.
 */
export function verifyMetric(metric: Metric, userMessage: string, prevUserMessage: string | null): boolean {
  const rawNorm = normalizeText(metric.raw);
  if (!rawNorm) return false;
  const haystack = `${userMessage}\n${prevUserMessage ?? ""}`;
  if (normalizeText(haystack).includes(rawNorm)) return true;

  const need = numericTokens(metric.raw);
  if (need.size === 0) return false;
  const have = numericTokens(haystack);
  for (const n of need) if (!have.has(n)) return false;
  return true;
}

/* ────────────────────────── Extraction validation ────────────────────────── */

export interface ValidationIssue {
  code:
    | "VERBATIM_REJECTED"
    | "METRIC_UNVERIFIED"
    | "DEMOTED_TO_TASK"
    | "BAD_REF"
    | "EVIDENCE_URL_INVALID"
    | "EMPTY_FIELD";
  path: string;
  message: string;
  /** blocking = đáng để yêu cầu LLM viết lại */
  blocking: boolean;
}

export interface ValidationContext {
  userMessage: string;
  prevUserMessage: string | null;
  existing: ExtractedData;
}

const MAX_ACHIEVEMENTS_PER_TURN = 5;
const MAX_OTHER_PER_TURN = 3;

function cleanSkills(skills: string[]): string[] {
  return unionCI([], skills.map((s) => clamp(s, 40) ?? ""), 8);
}

export function validateExtraction(
  raw: ExtractionOutput,
  ctx: ValidationContext,
): { value: ValidatedExtraction; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const msg = ctx.userMessage;
  const hedged = isHedged(msg);
  const knownAchievementIds = new Set(ctx.existing.achievements.map((a) => a.id));
  const knownFollowupIds = new Set(ctx.existing.pending_followups.map((f) => f.id));

  const achievements: ValidatedAchievement[] = [];
  const taskClaims = raw.task_claims
    .map((t) => ({ summary: clamp(t.summary, 140) ?? "" }))
    .filter((t) => t.summary.length > 0);

  raw.achievements.slice(0, MAX_ACHIEVEMENTS_PER_TURN).forEach((a, i) => {
    const path = `achievements[${i}]`;
    const title = clamp(a.title, 120);
    if (!title) {
      issues.push({ code: "EMPTY_FIELD", path: `${path}.title`, message: "title rỗng", blocking: false });
      return;
    }

    // Không lưu nguyên văn
    for (const [field, value] of [["title", title], ["result", a.result], ["action", a.action]] as const) {
      if (value && isVerbatim(value, msg)) {
        issues.push({
          code: "VERBATIM_REJECTED",
          path: `${path}.${field}`,
          message: `"${field}" sao chép nguyên văn tin nhắn của người dùng; hãy viết lại ngắn gọn bằng động từ mạnh`,
          blocking: true,
        });
        return;
      }
    }

    // Metric phải truy vết được
    let metric: Metric | null = a.metric ? { ...a.metric, raw: clamp(a.metric.raw, 120) ?? "" } : null;
    let metricVerified = false;
    if (metric) {
      if (metric.raw && verifyMetric(metric, msg, ctx.prevUserMessage)) {
        metricVerified = true;
        if (hedged) metric.is_estimate = true;
        metric.unit = clamp(metric.unit, 30);
        metric.timeframe = clamp(metric.timeframe, 60);
      } else {
        issues.push({
          code: "METRIC_UNVERIFIED",
          path: `${path}.metric`,
          message: `Metric "${metric.raw}" không xuất hiện trong lời người dùng → bỏ`,
          blocking: false,
        });
        metric = null;
      }
    }

    const result = clamp(a.result, 200);

    // Achievement > Task
    if (!metric && !result) {
      taskClaims.push({ summary: title });
      issues.push({
        code: "DEMOTED_TO_TASK",
        path,
        message: "Không có result/metric → chuyển thành task_claim",
        blocking: false,
      });
      return;
    }

    // ref hợp lệ
    let refId = a.ref_id;
    if (refId && !knownAchievementIds.has(refId)) {
      issues.push({ code: "BAD_REF", path: `${path}.ref_id`, message: `ref_id ${refId} không tồn tại`, blocking: false });
      refId = null;
    }
    let resolves = a.resolves_followup_id;
    if (resolves && !knownFollowupIds.has(resolves)) resolves = null;

    let confidence = Math.min(1, Math.max(0, a.confidence));
    if (metricVerified && !metric?.is_estimate) confidence = Math.max(confidence, 0.7);
    if (!metric) confidence = Math.min(confidence, 0.7);
    if (metric?.is_estimate) confidence = Math.min(confidence, 0.8);

    achievements.push({
      ...a,
      ref_id: refId,
      resolves_followup_id: resolves,
      title,
      action: clamp(a.action, 200),
      result,
      metric,
      metric_verified: metricVerified,
      timeframe: clamp(a.timeframe, 60) ?? clamp(metric?.timeframe, 60),
      own_contribution: clamp(a.own_contribution, 200),
      skills: cleanSkills(a.skills),
      dna_signals: a.dna_signals.slice(0, 3),
      confidence,
    });
  });

  // Evidence > Self Claim
  const evidence = raw.evidence.slice(0, MAX_OTHER_PER_TURN).flatMap((e, i) => {
    const title = clamp(e.title, 200);
    if (!title) return [];
    let url = clamp(e.url, 500);
    if (url) {
      try {
        const u = new URL(url);
        if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("scheme");
        url = u.toString();
      } catch {
        issues.push({ code: "EVIDENCE_URL_INVALID", path: `evidence[${i}].url`, message: "URL không hợp lệ", blocking: false });
        url = null;
      }
    }
    const verification_level = e.verification_level === "third_party"
      ? "third_party"
      : url || e.verification_level === "has_artifact"
      ? "has_artifact"
      : "self_claim";
    const achievement_ref = e.achievement_ref && knownAchievementIds.has(e.achievement_ref) ? e.achievement_ref : null;
    return [{ ...e, title, url, verification_level, achievement_ref, source: url ? "url" as const : e.source }];
  });

  const problem_solving = raw.problem_solving.slice(0, MAX_OTHER_PER_TURN).flatMap((p) => {
    const situation = clamp(p.situation, 200);
    const approach = clamp(p.approach, 240);
    if (!situation || !approach || isVerbatim(approach, msg)) return [];
    return [{ ...p, situation, approach, outcome: clamp(p.outcome, 200), skills: cleanSkills(p.skills) }];
  });

  const leadership = raw.leadership.slice(0, MAX_OTHER_PER_TURN).flatMap((l) => {
    const scope = clamp(l.scope, 160);
    const action = clamp(l.action, 240);
    if (!scope || !action || isVerbatim(action, msg)) return [];
    return [{ ...l, scope, action, outcome: clamp(l.outcome, 200) }];
  });

  const learning = raw.learning.slice(0, MAX_OTHER_PER_TURN).flatMap((l) => {
    const topic = clamp(l.topic, 120);
    const method = clamp(l.method, 200);
    if (!topic || !method) return [];
    return [{ ...l, topic, method, outcome: clamp(l.outcome, 200), timeframe: clamp(l.timeframe, 60) }];
  });

  const c = raw.context_updates;
  const context_updates = {
    ...c,
    current_role: clamp(c.current_role, 100),
    industry: clamp(c.industry, 100),
    company_type: clamp(c.company_type, 100),
    education: clamp(c.education, 160),
    years_experience: c.years_experience !== null && c.years_experience >= 0 && c.years_experience <= 60
      ? c.years_experience
      : null,
    skills: cleanSkills(c.skills),
  };

  const g = raw.goal_updates;
  const goal_updates = {
    target_role: clamp(g.target_role, 100),
    target_industry: clamp(g.target_industry, 100),
    timeframe: clamp(g.timeframe, 60),
    motivations: unionCI([], g.motivations.map((m) => clamp(m, 120) ?? ""), 5),
  };

  return {
    value: {
      ...raw,
      context_updates,
      goal_updates,
      achievements,
      task_claims: taskClaims.slice(0, MAX_OTHER_PER_TURN),
      evidence,
      problem_solving,
      leadership,
      learning,
    },
    issues,
  };
}

/* ────────────────────────── Output grounding ────────────────────────── */

/** Văn bản "sự thật" dùng để kiểm tra LLM không bịa số ở summary/DNA. */
export function groundingText(data: ExtractedData): string {
  const parts: string[] = [];
  const c = data.career_context;
  parts.push(String(c.years_experience ?? ""), c.current_role ?? "", c.industry ?? "", c.education ?? "");
  parts.push(data.career_goal.timeframe ?? "");
  for (const a of data.achievements) {
    parts.push(a.title, a.result ?? "", a.timeframe ?? "", a.own_contribution ?? "");
    if (a.metric) {
      parts.push(a.metric.raw, String(a.metric.value ?? ""), String(a.metric.baseline ?? ""), a.metric.timeframe ?? "");
    }
  }
  for (const p of data.problem_solving) parts.push(p.situation, p.outcome ?? "");
  for (const l of data.leadership) parts.push(l.scope, String(l.team_size ?? ""), l.outcome ?? "");
  for (const l of data.learning) parts.push(l.topic, l.outcome ?? "", l.timeframe ?? "");
  return parts.join(" \n ");
}

/** Trả về danh sách số xuất hiện trong `text` nhưng KHÔNG có trong dữ liệu thật. */
export function ungroundedNumbers(text: string, data: ExtractedData): string[] {
  const allowed = numericTokens(groundingText(data));
  return [...numericTokens(text)].filter((n) => !allowed.has(n));
}
