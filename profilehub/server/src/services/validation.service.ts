import { z } from "zod";
import { ApiError } from "../utils/http.utils.js";
import { clamp, isVerbatim, normalizeText, numericTokens, unionCI } from "../utils/text.utils.js";
import type {
  ExtractedData,
  ExtractionOutput,
  Metric,
  ValidatedAchievement,
  ValidatedExtraction,
} from "../types/discovery.types.js";

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_SESSION_TURNS = 40;
export const MIN_MESSAGE_INTERVAL_MS = 700;

/* ────────────────────────── Request schemas ────────────────────────── */

export const StartRequestSchema = z
  .object({
    user_id: z.string().optional(),
    locale: z.enum(["vi", "en"]).optional(),
    force_new: z.boolean().optional(),
  })
  .passthrough();

export const MessageRequestSchema = z
  .object({
    user_id: z.string().optional(),
    session_id: z.string().uuid(),
    message: z.string().max(MAX_MESSAGE_CHARS).optional(),
    text: z.string().max(MAX_MESSAGE_CHARS).optional(),
  })
  .passthrough()
  .refine((d) => Boolean((d.message && d.message.trim()) || (d.text && d.text.trim())), {
    message: "Field 'message' or 'text' is required",
  });

export const FinishRequestSchema = z
  .object({
    user_id: z.string().optional(),
    session_id: z.string().uuid(),
  })
  .passthrough();

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
  blocking: boolean;
}

export interface ValidationContext {
  userMessage: string;
  prevUserMessage: string | null;
  existing: ExtractedData;
}

export function validateExtraction(
  raw: ExtractionOutput,
  ctx: ValidationContext,
): { extraction: ValidatedExtraction; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const validAchievementIds = new Set(ctx.existing.achievements.map((a) => a.id));
  const validFollowupIds = new Set(ctx.existing.pending_followups.map((f) => f.id));

  const validatedAchievements: ValidatedAchievement[] = [];
  const demotedTasks: { summary: string }[] = [];

  raw.achievements.forEach((a, idx) => {
    const path = `achievements[${idx}]`;

    // 1. Không lưu nguyên văn
    if (isVerbatim(a.title, ctx.userMessage)) {
      issues.push({
        code: "VERBATIM_REJECTED",
        path: `${path}.title`,
        message: "Title trùng lặp nguyên văn lời người dùng",
        blocking: true,
      });
    }

    // 2. Achievement > Task: phải có kết quả hoặc metric
    const hasResult = Boolean(a.result && a.result.trim());
    const hasMetric = Boolean(a.metric && a.metric.raw && a.metric.raw.trim());
    if (!hasResult && !hasMetric) {
      issues.push({
        code: "DEMOTED_TO_TASK",
        path,
        message: `Achievement "${a.title}" không có kết quả/số liệu -> hạ xuống task_claim`,
        blocking: false,
      });
      demotedTasks.push({ summary: clamp(a.title, 120) ?? "Nhiệm vụ chưa rõ kết quả" });
      return;
    }

    // 3. Metric verification (Metric > Description)
    let metricVerified = false;
    let cleanMetric = a.metric;
    if (a.metric) {
      metricVerified = verifyMetric(a.metric, ctx.userMessage, ctx.prevUserMessage);
      if (!metricVerified) {
        issues.push({
          code: "METRIC_UNVERIFIED",
          path: `${path}.metric`,
          message: `Con số "${a.metric.raw}" không tìm thấy trong lời người dùng`,
          blocking: true,
        });
        cleanMetric = null;
      } else if (isHedged(ctx.userMessage)) {
        cleanMetric = { ...a.metric, is_estimate: true };
      }
    }

    // 4. Ref checks
    let refId = a.ref_id;
    if (refId && !validAchievementIds.has(refId)) {
      issues.push({ code: "BAD_REF", path: `${path}.ref_id`, message: `ref_id ${refId} không tồn tại`, blocking: false });
      refId = null;
    }
    let resolvesId = a.resolves_followup_id;
    if (resolvesId && !validFollowupIds.has(resolvesId)) {
      issues.push({ code: "BAD_REF", path: `${path}.resolves_followup_id`, message: `resolves_followup_id ${resolvesId} không tồn tại`, blocking: false });
      resolvesId = null;
    }

    validatedAchievements.push({
      ...a,
      title: clamp(a.title, 120) ?? "Thành tựu",
      action: clamp(a.action, 300),
      result: clamp(a.result, 300),
      timeframe: clamp(a.timeframe, 60),
      own_contribution: clamp(a.own_contribution, 300),
      skills: unionCI(a.skills, []),
      ref_id: refId,
      resolves_followup_id: resolvesId,
      metric: cleanMetric,
      metric_verified: metricVerified,
    });
  });

  const rawContext = raw.context_updates || {};
  const rawGoal = raw.goal_updates || {};
  const rawProblemSolving = Array.isArray(raw.problem_solving) ? raw.problem_solving : [];
  const rawLeadership = Array.isArray(raw.leadership) ? raw.leadership : [];
  const rawLearning = Array.isArray(raw.learning) ? raw.learning : [];
  const rawEvidence = Array.isArray(raw.evidence) ? raw.evidence : [];
  const rawTaskClaims = Array.isArray(raw.task_claims) ? raw.task_claims : [];

  // Task claims
  const taskClaims = [...rawTaskClaims, ...demotedTasks]
    .map((t) => ({ summary: clamp(t.summary, 160) ?? "" }))
    .filter((t) => t.summary.length > 0 && !isVerbatim(t.summary, ctx.userMessage));

  // Evidence
  const evidence = rawEvidence.map((e, idx) => {
    const path = `evidence[${idx}]`;
    let url = e.url;
    if (url && !/^https?:\/\//i.test(url)) {
      issues.push({ code: "EVIDENCE_URL_INVALID", path: `${path}.url`, message: "URL không hợp lệ", blocking: false });
      url = null;
    }
    const level: "self_claim" | "has_artifact" | "third_party" = url || e.source === "file" || e.source === "integration"
      ? (e.verification_level === "third_party" ? "third_party" : "has_artifact")
      : "self_claim";

    let achRef = e.achievement_ref;
    if (achRef && !validAchievementIds.has(achRef)) achRef = null;

    return {
      ...e,
      title: clamp(e.title, 200) ?? "Bằng chứng",
      url,
      verification_level: level,
      achievement_ref: achRef,
    };
  });

  const extraction: ValidatedExtraction = {
    user_intent: raw.user_intent || "answering",
    context_updates: {
      current_role: clamp(rawContext.current_role, 80),
      employment_status: rawContext.employment_status ?? null,
      industry: clamp(rawContext.industry, 80),
      company_type: clamp(rawContext.company_type, 80),
      years_experience: rawContext.years_experience ?? null,
      education: clamp(rawContext.education, 120),
      skills: unionCI(rawContext.skills || [], []),
    },
    goal_updates: {
      target_role: clamp(rawGoal.target_role, 80),
      target_industry: clamp(rawGoal.target_industry, 80),
      timeframe: clamp(rawGoal.timeframe, 60),
      motivations: (rawGoal.motivations || []).map((m: string) => clamp(m, 120)!).filter(Boolean),
    },
    achievements: validatedAchievements,
    task_claims: taskClaims,
    evidence,
    problem_solving: rawProblemSolving.map((p) => ({
      situation: clamp(p.situation, 300) ?? "",
      approach: clamp(p.approach, 400) ?? "",
      outcome: clamp(p.outcome, 300),
      skills: unionCI(p.skills || [], []),
      dna_signals: Array.isArray(p.dna_signals) ? p.dna_signals : [],
    })),
    leadership: rawLeadership.map((l) => ({
      scope: clamp(l.scope, 200) ?? "",
      action: clamp(l.action, 400) ?? "",
      outcome: clamp(l.outcome, 300),
      team_size: l.team_size ?? null,
      dna_signals: Array.isArray(l.dna_signals) ? l.dna_signals : [],
    })),
    learning: rawLearning.map((l) => ({
      topic: clamp(l.topic, 120) ?? "",
      method: clamp(l.method, 240) ?? "",
      outcome: clamp(l.outcome, 240),
      timeframe: clamp(l.timeframe, 60),
    })),
  };

  return { extraction, issues };
}

/** Tìm những con số trong văn bản sinh ra không có trong dữ liệu thật. */
export function ungroundedNumbers(generated: string, data: ExtractedData): string[] {
  const genTokens = numericTokens(generated);
  if (genTokens.size === 0) return [];

  const corpus: string[] = [
    data.career_context.years_experience !== null ? String(data.career_context.years_experience) : "",
    ...data.achievements.map((a) => `${a.title} ${a.result ?? ""} ${a.metric?.raw ?? ""} ${a.timeframe ?? ""}`),
    ...data.evidence.map((e) => `${e.title} ${e.url ?? ""}`),
    ...data.leadership.map((l) => `${l.scope} ${l.team_size ?? ""}`),
    ...data.learning.map((l) => `${l.topic} ${l.timeframe ?? ""}`),
  ];
  const realTokens = numericTokens(corpus.join("\n"));
  const bad: string[] = [];
  for (const n of genTokens) {
    if (!realTokens.has(n)) bad.push(n);
  }
  return bad;
}
