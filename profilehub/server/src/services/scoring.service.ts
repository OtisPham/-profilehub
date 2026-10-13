import { normalizeText, t } from "../utils/text.utils.js";
import type {
  Achievement,
  ExtractedData,
  Locale,
  ProfileStrength,
  ScoreBreakdownItem,
} from "../types/discovery.types.js";
import { categoryCoverage } from "./planner.service.js";

/** Chất lượng 1 achievement, 0..1. */
export function achievementQuality(a: Achievement): number {
  let q = 0;
  if (a.result || a.metric) q += 0.25;
  if (a.metric && a.metric_verified) q += a.metric.is_estimate ? 0.2 : 0.35;
  if (a.timeframe || a.metric?.timeframe) q += 0.1;
  if (a.own_contribution) q += 0.15;
  if (a.evidence_ids.length > 0) q += 0.15;
  return Math.min(1, q);
}

const EVIDENCE_WEIGHT = { self_claim: 0.5, has_artifact: 1, third_party: 1.5 } as const;

export function computeEmployability(data: ExtractedData): { score: number; breakdown: ScoreBreakdownItem[] } {
  const cov = categoryCoverage(data);

  // 1. Achievement quality (30): top 5 thành tựu tốt nhất, chia cho 5 -> thưởng số lượng
  const top = data.achievements.map(achievementQuality).sort((a, b) => b - a).slice(0, 5);
  const achievementPts = (top.reduce((s, q) => s + q, 0) / 5) * 30;

  // 2. Evidence (20): trọng số theo mức kiểm chứng
  const evMass = data.evidence.reduce((s, e) => s + EVIDENCE_WEIGHT[e.verification_level], 0);
  const evidencePts = Math.min(1, evMass / 4) * 20;

  // 3..7: các nhóm còn lại
  const qualityOf = (items: { outcome: string | null }[]) =>
    Math.min(1, items.reduce((s, i) => s + (i.outcome ? 1 : 0.6), 0) / 2);

  const items: ScoreBreakdownItem[] = [
    { key: "achievements", label: "Chất lượng thành tựu", points: achievementPts, max: 30 },
    { key: "evidence", label: "Bằng chứng", points: evidencePts, max: 20 },
    { key: "context", label: "Bối cảnh nghề nghiệp", points: cov.career_context * 10, max: 10 },
    { key: "problem_solving", label: "Giải quyết vấn đề", points: qualityOf(data.problem_solving) * 10, max: 10 },
    { key: "leadership", label: "Dẫn dắt", points: qualityOf(data.leadership) * 10, max: 10 },
    { key: "learning", label: "Khả năng học", points: qualityOf(data.learning) * 10, max: 10 },
    { key: "career_goal", label: "Định hướng", points: cov.career_goal * 10, max: 10 },
  ].map((i) => ({ ...i, points: Math.round(i.points * 10) / 10 }));

  const score = Math.round(Math.min(100, items.reduce((s, i) => s + i.points, 0)));
  return { score, breakdown: items };
}

/** Strengths tất định: gom kỹ năng theo bằng chứng (achievement). */
export function computeStrengths(data: ExtractedData, locale: Locale = "vi"): ProfileStrength[] {
  const map = new Map<string, { name: string; mass: number; ids: Set<string>; best: Achievement }>();

  for (const a of data.achievements) {
    const weight = a.confidence * (a.metric_verified ? 1.3 : 1);
    for (const skill of a.skills) {
      const key = normalizeText(skill);
      if (!key) continue;
      const cur = map.get(key) ?? { name: skill, mass: 0, ids: new Set<string>(), best: a };
      cur.mass += weight;
      cur.ids.add(a.id);
      if (achievementQuality(a) > achievementQuality(cur.best)) cur.best = a;
      map.set(key, cur);
    }
  }

  return [...map.values()]
    .sort((x, y) => y.mass - x.mass)
    .slice(0, 6)
    .map((s) => ({
      name: s.name,
      description: t(locale, `Thể hiện qua: ${s.best.title}`, `Shown through: ${s.best.title}`),
      level: s.mass >= 2.5 ? "standout" : s.mass >= 1.2 ? "solid" : "emerging",
      evidence_achievement_ids: [...s.ids],
    }));
}
