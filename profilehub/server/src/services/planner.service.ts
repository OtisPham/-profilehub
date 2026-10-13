import {
  type Achievement,
  DISCOVERY_CATEGORIES,
  type DiscoveryCategory,
  type ExtractedData,
  type Gap,
  type LastPlan,
  type TurnPlan,
  type UserIntent,
} from "../types/discovery.types.js";

export const MAX_PROBES = 1; // số lần tối đa hỏi 1 gap của 1 item
export const MAX_TURNS_PER_CATEGORY = 2;

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
  const deepDone = data.achievements.filter((a: any) => effectiveGaps(a, DEEP_GAPS).length === 0).length;
  const evidenceDone = data.achievements.filter(
    (a: any) => a.evidence_ids.length > 0 || (a.probes["evidence"] ?? 0) >= MAX_PROBES,
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

/** Tối thiểu để chốt profile: biết user là ai + có >=1 thành tựu. */
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
  const avg = DISCOVERY_CATEGORIES.reduce((s: number, k: DiscoveryCategory) => s + coverage[k], 0) / DISCOVERY_CATEGORIES.length;
  return avg >= 0.7;
}

/* ────────────────────────── Planning ────────────────────────── */

export function planNextTurn(data: ExtractedData, turn: number, intent: UserIntent): TurnPlan {
  const coverage = categoryCoverage(data);
  const flags = { can_finish: canFinish(data), ready_to_finish: isReadyToFinish(data, coverage) };
  const wrap = (p: LastPlan): TurnPlan => ({ ...p, clarify: false, ...flags });

  // 0. User hỏi ngược / lạc đề -> trả lời ngắn rồi quay lại câu hỏi trước
  if ((intent === "asking_question" || intent === "off_topic") && data.last_plan) {
    return { ...data.last_plan, clarify: true, ...flags };
  }

  // 1. Task-claim vừa xuất hiện -> ép sang thành tựu (Achievement > Task)
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

  // 2. Achievement vừa thêm -> lập tức đào sâu số liệu/kết quả (Metric > Description)
  const recent = [...data.achievements]
    .reverse()
    .find((a) => a.updated_turn === turn && effectiveGaps(a, IMMEDIATE_GAPS).length > 0);
  if (recent) {
    const missing = effectiveGaps(recent, IMMEDIATE_GAPS).slice(0, 2);
    return wrap({
      mode: "probe",
      category: "achievement_discovery",
      target: { kind: "achievement", id: recent.id, label: recent.title },
      missing,
      origin: "reactive",
    });
  }

  // 3. Khám phá theo lộ trình 8 category
  for (const cat of DISCOVERY_CATEGORIES) {
    const turns = data.category_turns[cat] ?? 0;
    if (turns >= MAX_TURNS_PER_CATEGORY) continue;

    if (cat === "career_context" && coverage.career_context < 0.75) {
      return wrap({ mode: "explore", category: cat, target: null, missing: [], origin: "category" });
    }

    if (cat === "achievement_discovery" && data.achievements.length < 2) {
      const oldClaim = data.pending_followups.find((f: any) => f.asked_count < MAX_PROBES);
      if (oldClaim) {
        return wrap({
          mode: "probe",
          category: cat,
          target: { kind: "task_claim", id: oldClaim.id, label: oldClaim.subject },
          missing: ["result", "metric"],
          origin: "category",
        });
      }
      return wrap({ mode: "explore", category: cat, target: null, missing: [], origin: "category" });
    }

    if (cat === "impact_discovery") {
      const needDeep = data.achievements.find((a: any) => effectiveGaps(a, DEEP_GAPS).length > 0);
      if (needDeep) {
        return wrap({
          mode: "probe",
          category: cat,
          target: { kind: "achievement", id: needDeep.id, label: needDeep.title },
          missing: effectiveGaps(needDeep, DEEP_GAPS).slice(0, 2),
          origin: "category",
        });
      }
    }

    if (cat === "evidence_discovery") {
      const needEvi = data.achievements.find((a: any) => effectiveGaps(a, EVIDENCE_GAPS).length > 0);
      if (needEvi) {
        return wrap({
          mode: "probe",
          category: cat,
          target: { kind: "achievement", id: needEvi.id, label: needEvi.title },
          missing: ["evidence"],
          origin: "category",
        });
      }
    }

    if (cat === "problem_solving" && data.problem_solving.length === 0) {
      return wrap({ mode: "explore", category: cat, target: null, missing: [], origin: "category" });
    }
    if (cat === "leadership" && data.leadership.length === 0) {
      return wrap({ mode: "explore", category: cat, target: null, missing: [], origin: "category" });
    }
    if (cat === "learning_ability" && data.learning.length === 0) {
      return wrap({ mode: "explore", category: cat, target: null, missing: [], origin: "category" });
    }
    if (cat === "career_goal" && coverage.career_goal < 0.6) {
      return wrap({ mode: "explore", category: cat, target: null, missing: [], origin: "category" });
    }
  }

  // 4. Đã đủ dữ liệu -> gợi ý hoàn tất
  return wrap({ mode: "wrap_up", category: "career_goal", target: null, missing: [], origin: "category" });
}

/* ────────────────────────── State updates ────────────────────────── */

/** Cập nhật sau khi planner chọn plan: tăng đếm câu hỏi để chặn hỏi lặp. */
export function applyPlan(data: ExtractedData, plan: TurnPlan): ExtractedData {
  const achievements = [...data.achievements];
  const pendingFollowups = [...data.pending_followups];
  const turns = { ...data.category_turns, [plan.category]: (data.category_turns[plan.category] ?? 0) + 1 };

  if (plan.mode === "probe" && plan.target) {
    if (plan.target.kind === "achievement") {
      const idx = achievements.findIndex((a) => a.id === plan.target!.id);
      if (idx >= 0) {
        const a = { ...achievements[idx] };
        const probes = { ...a.probes };
        for (const g of plan.missing) probes[g] = (probes[g] ?? 0) + 1;
        a.probes = probes;
        achievements[idx] = a;
      }
    } else if (plan.target.kind === "task_claim") {
      const idx = pendingFollowups.findIndex((f) => f.id === plan.target!.id);
      if (idx >= 0) {
        const f = { ...pendingFollowups[idx] };
        f.asked_count = f.asked_count + 1;
        pendingFollowups[idx] = f;
      }
    }
  }

  const lastPlan: LastPlan = {
    mode: plan.mode,
    category: plan.category,
    target: plan.target,
    missing: plan.missing,
    origin: plan.origin,
  };

  return {
    ...data,
    achievements,
    pending_followups: pendingFollowups,
    category_turns: turns,
    last_plan: lastPlan,
  };
}

/** Nếu người dùng từ chối / không nhớ -> đóng gap đang hỏi để không hỏi lại. */
export function applyIntent(data: ExtractedData, intent: UserIntent): ExtractedData {
  if ((intent !== "declining" && intent !== "unsure") || !data.last_plan) return data;
  const lp = data.last_plan;
  if (lp.mode !== "probe" || !lp.target) return data;

  const achievements = [...data.achievements];
  const pendingFollowups = [...data.pending_followups];

  if (lp.target.kind === "achievement") {
    const idx = achievements.findIndex((a) => a.id === lp.target!.id);
    if (idx >= 0) {
      const a = { ...achievements[idx] };
      const probes = { ...a.probes };
      for (const g of lp.missing) probes[g] = MAX_PROBES; // khoá gap
      a.probes = probes;
      achievements[idx] = a;
    }
  } else if (lp.target.kind === "task_claim") {
    const idx = pendingFollowups.findIndex((f) => f.id === lp.target!.id);
    if (idx >= 0) pendingFollowups.splice(idx, 1);
  }

  return { ...data, achievements, pending_followups: pendingFollowups };
}
