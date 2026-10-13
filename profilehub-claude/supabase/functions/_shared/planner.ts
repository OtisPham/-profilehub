/**
 * PROFILEHUB · Discovery Planner (deterministic)
 *
 * Quyết định LƯỢT TIẾP THEO hỏi gì — không giao cho LLM tự quyết, để:
 *   - luôn ưu tiên Achievement > Task, Impact > Responsibility, Metric > Description
 *   - không hỏi lặp/thẩm vấn (giới hạn số lần hỏi mỗi gap)
 *   - luôn kết thúc được (giới hạn lượt mỗi category)
 */
import {
  type Achievement,
  DISCOVERY_CATEGORIES,
  type DiscoveryCategory,
  type ExtractedData,
  type Gap,
  type LastPlan,
  type TurnPlan,
  type UserIntent,
} from "./types.ts";

export const MAX_PROBES = 2; // số lần tối đa hỏi 1 gap của 1 item
export const MAX_TURNS_PER_CATEGORY = 3;

export const IMMEDIATE_GAPS: Gap[] = ["result", "metric", "timeframe"];
export const DEEP_GAPS: Gap[] = ["metric", "timeframe", "impact", "own_contribution"];
export const EVIDENCE_GAPS: Gap[] = ["evidence"];

/** Thứ tự ưu tiên khi hỏi. */
const GAP_PRIORITY: Gap[] = ["result", "metric", "timeframe", "impact", "own_contribution", "evidence"];

const present = (v: unknown) => v !== null && v !== undefined && v !== "";

export function achievementGaps(a: Achievement): Gap[] {
  const g: Gap[] = [];
  if (!a.result && !a.metric) g.push("result");
  if (!a.metric) g.push("metric");
  if (!a.timeframe && !a.metric?.timeframe) g.push("timeframe");
  if (a.impact_type === "Other") g.push("impact");
  if (!a.own_contribution) g.push("own_contribution");
  if (a.evidence_ids.length === 0) g.push("evidence");
  return g.sort((x, y) => GAP_PRIORITY.indexOf(x) - GAP_PRIORITY.indexOf(y));
}

/** Gap còn "đáng hỏi": chưa đủ dữ liệu VÀ chưa hỏi quá MAX_PROBES lần. */
export function effectiveGaps(a: Achievement, subset: Gap[]): Gap[] {
  return achievementGaps(a).filter((g) => subset.includes(g) && (a.probes[g] ?? 0) < MAX_PROBES);
}

/* ────────────────────────── Coverage ────────────────────────── */

export function categoryCoverage(data: ExtractedData): Record<DiscoveryCategory, number> {
  const c = data.career_context;
  const ctxFilled = [
    present(c.current_role) || present(c.employment_status),
    present(c.industry),
    present(c.years_experience),
    c.skills.length >= 2,
  ].filter(Boolean).length;

  const n = data.achievements.length;
  const deepDone = data.achievements.filter((a) => effectiveGaps(a, DEEP_GAPS).length === 0).length;
  const evidenceDone = data.achievements.filter(
    (a) => a.evidence_ids.length > 0 || (a.probes["evidence"] ?? 0) >= MAX_PROBES,
  ).length;

  const goal = data.career_goal;
  const goalScore = (present(goal.target_role) || present(goal.target_industry) ? 0.6 : 0) +
    (present(goal.timeframe) || goal.motivations.length > 0 ? 0.4 : 0);

  return {
    career_context: ctxFilled / 4,
    achievement_discovery: Math.min(1, n / 2),
    impact_discovery: n === 0 ? 1 : deepDone / n,
    evidence_discovery: n === 0 ? 1 : Math.min(1, evidenceDone / Math.min(n, 2)),
    problem_solving: data.problem_solving.length > 0 ? 1 : 0,
    leadership: data.leadership.length > 0 ? 1 : 0,
    learning_ability: data.learning.length > 0 ? 1 : 0,
    career_goal: goalScore,
  };
}

/** Tối thiểu để chốt profile: biết user là ai + có ≥1 thành tựu. */
export function canFinish(data: ExtractedData): boolean {
  const c = data.career_context;
  const hasContext = present(c.current_role) || present(c.employment_status) || present(c.industry);
  return hasContext && data.achievements.length >= 1;
}

/** Khuyến nghị nên chốt: đủ dữ liệu để profile có chất lượng. */
export function isReadyToFinish(
  data: ExtractedData,
  coverage = categoryCoverage(data),
): boolean {
  if (!canFinish(data) || data.achievements.length < 2) return false;
  const avg = DISCOVERY_CATEGORIES.reduce((s, k) => s + coverage[k], 0) / DISCOVERY_CATEGORIES.length;
  return avg >= 0.7;
}

/* ────────────────────────── Planning ────────────────────────── */

export function planNextTurn(data: ExtractedData, turn: number, intent: UserIntent): TurnPlan {
  const coverage = categoryCoverage(data);
  const flags = { can_finish: canFinish(data), ready_to_finish: isReadyToFinish(data, coverage) };
  const wrap = (p: LastPlan): TurnPlan => ({ ...p, clarify: false, ...flags });

  // 0. User hỏi ngược / lạc đề → trả lời ngắn rồi quay lại câu hỏi trước
  if ((intent === "asking_question" || intent === "off_topic") && data.last_plan) {
    return { ...data.last_plan, clarify: true, ...flags };
  }

  // 1. Task-claim vừa xuất hiện → ép sang thành tựu (Achievement > Task)
  const claim = [...data.pending_followups]
    .reverse()
    .find((f) => f.created_turn === turn && f.asked_count < MAX_PROBES);
  if (claim) {
    return wrap({
      mode: "probe",
      category: "achievement_discovery",
      target: { kind: "task_claim", id: claim.id, label: claim.subject },
      missing: ["result", "metric"],
      origin: "reactive",
    });
  }

  // 2. Achievement vừa chạm tới còn thiếu result/metric/timeframe → hỏi bám theo
  const touched = data.achievements
    .filter((a) => a.updated_turn === turn)
    .map((a) => ({ a, gaps: effectiveGaps(a, IMMEDIATE_GAPS) }))
    .filter((x) => x.gaps.length > 0)
    .sort((x, y) => y.gaps.length - x.gaps.length);
  if (touched.length > 0) {
    const { a, gaps } = touched[0];
    return wrap({
      mode: "probe",
      category: "impact_discovery",
      target: { kind: "achievement", id: a.id, label: a.title },
      missing: gaps.slice(0, 2),
      origin: "reactive",
    });
  }

  // 3. Đi theo lộ trình category
  const category = DISCOVERY_CATEGORIES.find(
    (c) => coverage[c] < 1 && (data.category_turns[c] ?? 0) < MAX_TURNS_PER_CATEGORY,
  );
  if (!category) {
    return wrap({ mode: "wrap_up", category: "career_goal", target: null, missing: [], origin: "category" });
  }

  if (category === "achievement_discovery") {
    const oldClaim = data.pending_followups.find((f) => f.asked_count < MAX_PROBES);
    if (oldClaim) {
      return wrap({
        mode: "probe",
        category,
        target: { kind: "task_claim", id: oldClaim.id, label: oldClaim.subject },
        missing: ["result", "metric"],
        origin: "category",
      });
    }
  }

  if (category === "impact_discovery" || category === "evidence_discovery") {
    const subset = category === "impact_discovery" ? DEEP_GAPS : EVIDENCE_GAPS;
    const candidate = data.achievements
      .map((a) => ({ a, gaps: effectiveGaps(a, subset) }))
      .filter((x) => x.gaps.length > 0)
      .sort((x, y) => y.a.confidence - x.a.confidence)[0];
    if (candidate) {
      return wrap({
        mode: "probe",
        category,
        target: { kind: "achievement", id: candidate.a.id, label: candidate.a.title },
        missing: candidate.gaps.slice(0, 2),
        origin: "category",
      });
    }
  }

  return wrap({ mode: "explore", category, target: null, missing: [], origin: "category" });
}

/** Ghi nhận kế hoạch vào dữ liệu (đếm lượt/lần hỏi) — pure, trả về bản sao. */
export function applyPlan(data: ExtractedData, plan: TurnPlan): ExtractedData {
  const d = structuredClone(data);
  if (plan.clarify) return d; // trả lời câu hỏi của user, không tính là lượt khám phá

  if (plan.origin === "category") {
    d.category_turns[plan.category] = (d.category_turns[plan.category] ?? 0) + 1;
  }
  if (plan.target?.kind === "achievement") {
    const a = d.achievements.find((x) => x.id === plan.target!.id);
    if (a) for (const g of plan.missing) a.probes[g] = (a.probes[g] ?? 0) + 1;
  } else if (plan.target?.kind === "task_claim") {
    const f = d.pending_followups.find((x) => x.id === plan.target!.id);
    if (f) f.asked_count += 1;
  }
  d.last_plan = {
    mode: plan.mode,
    category: plan.category,
    target: plan.target,
    missing: plan.missing,
    origin: plan.origin,
  };
  return d;
}

/**
 * User từ chối/không nhớ → "đóng" câu hỏi vừa rồi để không hỏi lại
 * (tôn trọng người dùng, tránh vòng lặp).
 */
export function applyIntent(data: ExtractedData, intent: UserIntent): ExtractedData {
  if ((intent !== "declining" && intent !== "unsure") || !data.last_plan) return data;
  const d = structuredClone(data);
  const lp = d.last_plan!;
  if (lp.target?.kind === "achievement") {
    const a = d.achievements.find((x) => x.id === lp.target!.id);
    if (a) for (const g of lp.missing) a.probes[g] = MAX_PROBES;
  } else if (lp.target?.kind === "task_claim") {
    const f = d.pending_followups.find((x) => x.id === lp.target!.id);
    if (f) f.asked_count = MAX_PROBES;
  } else if (lp.mode === "explore") {
    d.category_turns[lp.category] = MAX_TURNS_PER_CATEGORY;
  }
  return d;
}
