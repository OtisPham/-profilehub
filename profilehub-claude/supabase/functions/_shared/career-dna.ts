/**
 * PROFILEHUB · Career DNA Generator
 *
 * Phân loại: Builder · Creator · Analyst · Operator · Leader · Strategist
 *
 * - Điểm số TẤT ĐỊNH từ dna_signals đã trích xuất (có trọng số theo độ tin cậy
 *   và metric đã kiểm chứng) → giải thích được, không "ảo giác".
 * - LLM chỉ viết phần rationale (2–3 câu) và bị kiểm tra không được bịa số.
 */
import type { Llm } from "./llm.ts";
import { MODELS } from "./llm.ts";
import { t } from "./text.ts";
import {
  type CareerDna,
  CAREER_DNA_TYPES,
  type CareerDnaType,
  type DnaSignal,
  type ExtractedData,
  type Locale,
} from "./types.ts";
import { ungroundedNumbers } from "./validation.ts";

export const DNA_DESCRIPTION: Record<CareerDnaType, [string, string]> = {
  Builder: ["xây dựng cái mới từ con số 0", "builds new things from zero"],
  Creator: ["tạo ra nội dung, thiết kế và ý tưởng", "creates content, design and ideas"],
  Analyst: ["dùng dữ liệu và phân tích để ra quyết định, tối ưu", "uses data and analysis to decide and optimise"],
  Operator: ["vận hành, thực thi ổn định và cải tiến quy trình", "runs operations, executes reliably and improves process"],
  Leader: ["dẫn dắt, truyền cảm hứng và phát triển con người", "leads, influences and develops people"],
  Strategist: ["định hướng, lập kế hoạch và cân nhắc đánh đổi dài hạn", "sets direction, plans and weighs long-term trade-offs"],
};

/** Dạng rỗng dùng khi chưa đủ dữ liệu. */
export const emptyDna = (): CareerDna => ({
  primary: null,
  secondary: null,
  scores: Object.fromEntries(CAREER_DNA_TYPES.map((k) => [k, 0])) as Record<CareerDnaType, number>,
  confidence: 0,
  rationale: null,
  evidence_achievement_ids: [],
});

export function buildCareerDna(data: ExtractedData): CareerDna {
  const raw = Object.fromEntries(CAREER_DNA_TYPES.map((k) => [k, 0])) as Record<CareerDnaType, number>;
  let mass = 0;
  const add = (signals: DnaSignal[], w: number) => {
    for (const s of signals) {
      raw[s.type] += s.strength * w;
      mass += s.strength * w;
    }
  };

  for (const a of data.achievements) add(a.dna_signals, a.confidence * (a.metric_verified ? 1.3 : 1));
  for (const p of data.problem_solving) add(p.dna_signals, p.outcome ? 1 : 0.6);
  for (const l of data.leadership) {
    const w = l.outcome ? 1 : 0.6;
    add(l.dna_signals, w);
    raw.Leader += w; // có trải nghiệm dẫn dắt là tín hiệu Leader tự thân
    mass += w;
  }

  if (mass === 0) return emptyDna();

  const max = Math.max(...Object.values(raw));
  const scores = Object.fromEntries(
    CAREER_DNA_TYPES.map((k) => [k, Math.round((raw[k] / max) * 100)]),
  ) as Record<CareerDnaType, number>;

  const ranked = [...CAREER_DNA_TYPES].sort((a, b) => raw[b] - raw[a]);
  const primary = ranked[0];
  const secondary = scores[ranked[1]] >= 60 ? ranked[1] : null;

  const evidenceIds = data.achievements
    .filter((a) => a.dna_signals.some((s) => s.type === primary))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
    .map((a) => a.id);

  return {
    primary,
    secondary,
    scores,
    confidence: Math.round(Math.min(1, mass / 10) * 100) / 100,
    rationale: null,
    evidence_achievement_ids: evidenceIds,
  };
}

function templateRationale(dna: CareerDna, data: ExtractedData, locale: Locale): string {
  if (!dna.primary) return "";
  const n = data.achievements.length;
  const p = t(locale, DNA_DESCRIPTION[dna.primary][0], DNA_DESCRIPTION[dna.primary][1]);
  const s = dna.secondary ? t(locale, DNA_DESCRIPTION[dna.secondary][0], DNA_DESCRIPTION[dna.secondary][1]) : null;
  return locale === "en"
    ? `Across the achievements you shared, your strongest pattern is ${dna.primary}: someone who ${p}.${s ? ` Alongside it you show ${dna.secondary} traits: ${s}.` : ""}`
    : `Từ ${n} thành tựu bạn chia sẻ, xu hướng nổi bật nhất là ${dna.primary}: người ${p}.${s ? ` Bên cạnh đó bạn có nét ${dna.secondary}: ${s}.` : ""}`;
}

export async function generateCareerDna(llm: Llm, data: ExtractedData, locale: Locale): Promise<CareerDna> {
  const dna = buildCareerDna(data);
  if (!dna.primary) return dna;

  const evidence = data.achievements
    .filter((a) => dna.evidence_achievement_ids.includes(a.id))
    .map((a) => ({ title: a.title, result: a.result, metric: a.metric?.raw ?? null, signals: a.dna_signals }));

  const system = `Bạn viết phần giải thích Career DNA cho PROFILEHUB.
Viết 2–3 câu, ngôi thứ hai ("bạn"), giải thích vì sao người dùng thuộc nhóm ${dna.primary}${dna.secondary ? ` với nét ${dna.secondary}` : ""}.
QUY TẮC: chỉ dựa vào dữ liệu được cung cấp; KHÔNG thêm con số hay sự kiện mới; không khen sáo rỗng; ngôn ngữ: ${locale === "en" ? "English" : "Tiếng Việt"}. Chỉ trả về đoạn văn.`;

  try {
    const text = (await llm.complete({
      model: MODELS.generate(),
      system,
      messages: [{
        role: "user",
        content: `Điểm Career DNA: ${JSON.stringify(dna.scores)}\nBằng chứng: ${JSON.stringify(evidence)}`,
      }],
      maxTokens: 300,
      temperature: 0.4,
    })).trim();

    if (!text || text.length > 700 || ungroundedNumbers(text, data).length > 0) throw new Error("rationale rejected");
    return { ...dna, rationale: text };
  } catch (e) {
    console.error(JSON.stringify({ event: "dna_rationale_fallback", error: String(e) }));
    return { ...dna, rationale: templateRationale(dna, data, locale) };
  }
}
