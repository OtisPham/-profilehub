// Chạy: deno test --allow-env supabase/tests/logic_test.ts
import { assert, assertEquals } from "jsr:@std/assert@1";
import { isVerbatim, numericTokens } from "../functions/_shared/text.ts";
import { validateExtraction, verifyMetric } from "../functions/_shared/validation.ts";
import { applyPlan, planNextTurn } from "../functions/_shared/planner.ts";
import { mergeExtraction } from "../functions/_shared/extraction.ts";
import { computeEmployability } from "../functions/_shared/scoring.ts";
import { buildCareerDna } from "../functions/_shared/career-dna.ts";
import { emptyExtractedData, ExtractionOutputSchema } from "../functions/_shared/types.ts";

const base = () => ExtractionOutputSchema.parse({});

Deno.test("numericTokens chuẩn hoá số kiểu VN", () => {
  assertEquals([...numericTokens("tăng 35%")], ["35"]);
  assertEquals([...numericTokens("doanh thu 1.000.000đ")], ["1000000"]);
  assertEquals([...numericTokens("tăng 2,5 lần")], ["2.5"]);
});

Deno.test("verifyMetric: chỉ chấp nhận số có trong lời user", () => {
  const m = { raw: "35%", value: 35, unit: "%", direction: "increase" as const, baseline: null, timeframe: null, is_estimate: false };
  assert(verifyMetric(m, "Tôi tăng doanh số 35%.", null));
  assert(!verifyMetric({ ...m, raw: "50%", value: 50 }, "Tôi tăng doanh số 35%.", null));
});

Deno.test("isVerbatim chặn sao chép nguyên văn nhưng cho phép title ngắn", () => {
  const message = "Tôi phụ trách quản lý fanpage của công ty trong hai năm qua và đã làm rất nhiều việc";
  assert(isVerbatim(message, message));
  assert(!isVerbatim("Tăng doanh số", "Tôi tăng doanh số 35%"));
});

Deno.test("Achievement > Task: không có result/metric → hạ xuống task_claim", () => {
  const raw = { ...base(), achievements: [ExtractionOutputSchema.shape.achievements.element.parse({ title: "Quản lý fanpage" })] };
  const { value } = validateExtraction(raw, { userMessage: "Tôi quản lý fanpage", prevUserMessage: null, existing: emptyExtractedData() });
  assertEquals(value.achievements.length, 0);
  assertEquals(value.task_claims[0].summary, "Quản lý fanpage");
});

Deno.test("Metric bịa bị loại và thành tựu không còn metric_verified", () => {
  const a = ExtractionOutputSchema.shape.achievements.element.parse({
    title: "Tăng doanh số",
    result: "Doanh số tăng mạnh",
    metric: { raw: "80%", value: 80 },
  });
  const { value, issues } = validateExtraction({ ...base(), achievements: [a] }, {
    userMessage: "Tôi tăng doanh số 35%",
    prevUserMessage: null,
    existing: emptyExtractedData(),
  });
  assertEquals(value.achievements[0].metric, null);
  assertEquals(value.achievements[0].metric_verified, false);
  assert(issues.some((i) => i.code === "METRIC_UNVERIFIED"));
});

Deno.test("Ví dụ fanpage: task → probe → achievement có metric → điểm tăng", () => {
  // Lượt 1: chỉ có task
  let data = emptyExtractedData();
  let ext = { ...base(), task_claims: [{ summary: "Quản lý fanpage công ty" }], achievements: [] };
  data = mergeExtraction(data, { ...ext, achievements: [] }, 1).data;
  let plan = planNextTurn(data, 1, "answering");
  assertEquals(plan.mode, "probe");
  assertEquals(plan.target?.kind, "task_claim");
  data = applyPlan(data, plan);
  assertEquals(data.pending_followups[0].asked_count, 1);

  // Lượt 2: user trả lời có số liệu
  const ach = ExtractionOutputSchema.shape.achievements.element.parse({
    title: "Tăng follower fanpage",
    result: "Follower tăng mạnh",
    metric: { raw: "10k", value: 10000, unit: "follower" },
    timeframe: "6 tháng",
    impact_type: "Customer",
    resolves_followup_id: data.pending_followups[0].id,
  });
  const before = computeEmployability(data).score;
  const merged = mergeExtraction(data, { ...base(), achievements: [{ ...ach, metric_verified: true }] }, 2);
  assertEquals(merged.data.pending_followups.length, 0);
  assert(computeEmployability(merged.data).score > before);
});

Deno.test("Planner không hỏi lặp quá MAX_PROBES", () => {
  let data = emptyExtractedData();
  const ach = ExtractionOutputSchema.shape.achievements.element.parse({ title: "Tối ưu quy trình", result: "Nhanh hơn" });
  data = mergeExtraction(data, { ...base(), achievements: [{ ...ach, metric_verified: false }] }, 1).data;
  for (let turn = 1; turn <= 4; turn++) {
    const plan = planNextTurn(data, 1, "answering"); // giữ updated_turn === 1 để ép probe reactive
    data = applyPlan(data, plan);
  }
  const a = data.achievements[0];
  assert((a.probes["metric"] ?? 0) <= 2);
});

Deno.test("Career DNA: leader signal thắng khi có leadership + signal", () => {
  let data = emptyExtractedData();
  data.leadership.push({
    id: "ld_1", turn: 1, scope: "Đội 5 người", action: "Kèm cặp nhân viên mới", outcome: "Rút ngắn thời gian onboarding",
    team_size: 5, dna_signals: [{ type: "Leader", strength: 3 }],
  });
  const dna = buildCareerDna(data);
  assertEquals(dna.primary, "Leader");
});
