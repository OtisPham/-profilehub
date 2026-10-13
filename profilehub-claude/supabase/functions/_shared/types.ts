/**
 * PROFILEHUB · Career Discovery — Types & Schemas
 *
 * Zod schema là "single source of truth": vừa validate output của LLM,
 * vừa validate JSON đọc từ DB, vừa sinh JSON Schema cho tool-use của Anthropic.
 *
 * Quy ước: KHÔNG dùng `.max()` trong schema (LLM vượt giới hạn sẽ làm hỏng cả lượt).
 * Việc cắt độ dài do `validation.ts` xử lý.
 */
import { z } from "npm:zod@3.23.8";

/* ────────────────────────────── Enums ────────────────────────────── */

export const DISCOVERY_CATEGORIES = [
  "career_context",
  "achievement_discovery",
  "impact_discovery",
  "evidence_discovery",
  "problem_solving",
  "leadership",
  "learning_ability",
  "career_goal",
] as const;
export const DiscoveryCategorySchema = z.enum(DISCOVERY_CATEGORIES);
export type DiscoveryCategory = z.infer<typeof DiscoveryCategorySchema>;

export const IMPACT_TYPES = [
  "Business", // doanh thu, tăng trưởng, chi phí, thị phần
  "Customer", // trải nghiệm, retention, NPS, số khách
  "Operational", // hiệu suất, tốc độ, chất lượng, quy trình
  "Product", // tính năng, sản phẩm, adoption
  "People", // đội nhóm, đào tạo, văn hoá
  "Technical", // hệ thống, hiệu năng, độ ổn định
  "Other",
] as const;
export const ImpactTypeSchema = z.enum(IMPACT_TYPES);
export type ImpactType = z.infer<typeof ImpactTypeSchema>;

export const CAREER_DNA_TYPES = [
  "Builder",
  "Creator",
  "Analyst",
  "Operator",
  "Leader",
  "Strategist",
] as const;
export const CareerDnaTypeSchema = z.enum(CAREER_DNA_TYPES);
export type CareerDnaType = z.infer<typeof CareerDnaTypeSchema>;

export const GAPS = [
  "metric",
  "timeframe",
  "result",
  "impact",
  "own_contribution",
  "evidence",
] as const;
export const GapSchema = z.enum(GAPS);
export type Gap = z.infer<typeof GapSchema>;

export const EVIDENCE_TYPES = [
  "metric_report",
  "artifact",
  "link",
  "testimonial",
  "certificate",
  "award",
  "publication",
  "other",
] as const;
export const EvidenceTypeSchema = z.enum(EVIDENCE_TYPES);
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

export type Locale = "vi" | "en";

/* ────────────────────────── Building blocks ────────────────────────── */

const nstr = z.string().nullable().default(null);
const strArr = z.array(z.string()).default([]);

export const DnaSignalSchema = z.object({
  type: CareerDnaTypeSchema,
  strength: z.number().int().min(1).max(3).describe("1 = yếu, 3 = rất rõ"),
});
export type DnaSignal = z.infer<typeof DnaSignalSchema>;

export const MetricSchema = z.object({
  raw: z.string().describe("Đoạn số liệu SAO CHÉP ĐÚNG từ tin nhắn người dùng, ví dụ '35%'"),
  value: z.number().nullable().default(null),
  unit: nstr.describe("'%', 'VND', 'người', 'follower', 'đơn'..."),
  direction: z.enum(["increase", "decrease", "absolute"]).nullable().default(null),
  baseline: z.number().nullable().default(null),
  timeframe: nstr,
  is_estimate: z.boolean().default(false).describe("true nếu người dùng nói ước chừng"),
});
export type Metric = z.infer<typeof MetricSchema>;

/* ────────────────────────── Career context / goal ────────────────────────── */

export const CareerContextSchema = z.object({
  current_role: nstr,
  employment_status: z
    .enum(["employed", "student", "job_seeking", "freelance", "other"])
    .nullable()
    .default(null),
  industry: nstr,
  company_type: nstr,
  years_experience: z.number().nullable().default(null),
  education: nstr,
  skills: strArr,
});
export type CareerContext = z.infer<typeof CareerContextSchema>;

export const CareerGoalSchema = z.object({
  target_role: nstr,
  target_industry: nstr,
  timeframe: nstr,
  motivations: strArr,
});
export type CareerGoal = z.infer<typeof CareerGoalSchema>;

/* ────────────────────────── LLM extraction output ────────────────────────── */

export const AchievementInputSchema = z.object({
  ref_id: nstr.describe("id achievement ĐÃ CÓ nếu tin nhắn bổ sung cho nó, ngược lại null"),
  resolves_followup_id: nstr.describe("id task_claim đang chờ mà achievement này giải quyết"),
  title: z.string().describe("Tên thành tựu, viết lại ngắn gọn, KHÔNG sao chép nguyên văn"),
  action: nstr.describe("Người dùng đã làm gì"),
  result: nstr.describe("Kết quả đạt được"),
  metric: MetricSchema.nullable().default(null),
  impact_type: ImpactTypeSchema.default("Other"),
  timeframe: nstr,
  own_contribution: nstr.describe("Phần việc cá nhân trực tiếp đảm nhận"),
  skills: strArr,
  dna_signals: z.array(DnaSignalSchema).default([]),
  confidence: z.number().min(0).max(1).default(0.7),
});
export type AchievementInput = z.infer<typeof AchievementInputSchema>;

export const TaskClaimInputSchema = z.object({
  summary: z.string().describe("Công việc/nhiệm vụ được nêu nhưng CHƯA có kết quả, viết lại ngắn gọn"),
});

export const EvidenceInputSchema = z.object({
  type: EvidenceTypeSchema,
  title: z.string(),
  source: z.enum(["chat_claim", "url", "file", "integration"]).default("chat_claim"),
  url: nstr,
  verification_level: z.enum(["self_claim", "has_artifact", "third_party"]).default("self_claim"),
  achievement_ref: nstr.describe("id achievement đã có mà bằng chứng này chứng minh"),
  achievement_index: z.number().int().nullable().default(null)
    .describe("index trong mảng achievements của CHÍNH lần trích xuất này"),
});
export type EvidenceInput = z.infer<typeof EvidenceInputSchema>;

export const ProblemSolvingInputSchema = z.object({
  situation: z.string(),
  approach: z.string(),
  outcome: nstr,
  skills: strArr,
  dna_signals: z.array(DnaSignalSchema).default([]),
});
export const LeadershipInputSchema = z.object({
  scope: z.string().describe("Dẫn dắt ai/cái gì"),
  action: z.string(),
  outcome: nstr,
  team_size: z.number().nullable().default(null),
  dna_signals: z.array(DnaSignalSchema).default([]),
});
export const LearningInputSchema = z.object({
  topic: z.string(),
  method: z.string(),
  outcome: nstr,
  timeframe: nstr,
});

export const UserIntentSchema = z.enum([
  "answering",
  "asking_question",
  "off_topic",
  "declining",
  "unsure",
]);
export type UserIntent = z.infer<typeof UserIntentSchema>;

export const ExtractionOutputSchema = z.object({
  user_intent: UserIntentSchema.default("answering"),
  context_updates: CareerContextSchema.default({}),
  goal_updates: CareerGoalSchema.default({}),
  achievements: z.array(AchievementInputSchema).default([]),
  task_claims: z.array(TaskClaimInputSchema).default([]),
  evidence: z.array(EvidenceInputSchema).default([]),
  problem_solving: z.array(ProblemSolvingInputSchema).default([]),
  leadership: z.array(LeadershipInputSchema).default([]),
  learning: z.array(LearningInputSchema).default([]),
});
export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;

/** Sau validation: thêm cờ metric_verified cho mỗi achievement. */
export type ValidatedAchievement = AchievementInput & { metric_verified: boolean };
export type ValidatedExtraction = Omit<ExtractionOutput, "achievements"> & {
  achievements: ValidatedAchievement[];
};

/* ────────────────────────── Stored (persisted) data ────────────────────────── */

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  action: nstr,
  result: nstr,
  metric: MetricSchema.nullable().default(null),
  metric_verified: z.boolean().default(false),
  impact_type: ImpactTypeSchema.default("Other"),
  timeframe: nstr,
  own_contribution: nstr,
  skills: strArr,
  dna_signals: z.array(DnaSignalSchema).default([]),
  evidence_ids: strArr,
  confidence: z.number().min(0).max(1).default(0.7),
  /** số lần đã hỏi cho từng gap — chặn hỏi lặp/"thẩm vấn" */
  probes: z.record(z.string(), z.number()).default({}),
  first_seen_turn: z.number().default(0),
  updated_turn: z.number().default(0),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const EvidenceItemSchema = z.object({
  id: z.string(),
  type: EvidenceTypeSchema,
  title: z.string(),
  source: z.enum(["chat_claim", "url", "file", "integration"]).default("chat_claim"),
  url: nstr,
  verification_level: z.enum(["self_claim", "has_artifact", "third_party"]).default("self_claim"),
  achievement_id: nstr,
  created_turn: z.number().default(0),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const ProblemSolvingItemSchema = ProblemSolvingInputSchema.extend({
  id: z.string(),
  turn: z.number().default(0),
});
export type ProblemSolvingItem = z.infer<typeof ProblemSolvingItemSchema>;

export const LeadershipItemSchema = LeadershipInputSchema.extend({
  id: z.string(),
  turn: z.number().default(0),
});
export type LeadershipItem = z.infer<typeof LeadershipItemSchema>;

export const LearningItemSchema = LearningInputSchema.extend({
  id: z.string(),
  turn: z.number().default(0),
});
export type LearningItem = z.infer<typeof LearningItemSchema>;

export const FollowupSchema = z.object({
  id: z.string(),
  kind: z.literal("task_claim").default("task_claim"),
  subject: z.string(),
  asked_count: z.number().default(0),
  created_turn: z.number().default(0),
});
export type Followup = z.infer<typeof FollowupSchema>;

export const PlanTargetSchema = z.object({
  kind: z.enum(["achievement", "task_claim"]),
  id: z.string(),
  label: z.string(),
});
export const LastPlanSchema = z.object({
  mode: z.enum(["probe", "explore", "wrap_up"]),
  category: DiscoveryCategorySchema,
  target: PlanTargetSchema.nullable().default(null),
  missing: z.array(GapSchema).default([]),
  /** reactive = hỏi bám theo điều user vừa nói; category = theo lộ trình category */
  origin: z.enum(["reactive", "category"]).default("category"),
});
export type LastPlan = z.infer<typeof LastPlanSchema>;
export type TurnPlan = LastPlan & {
  clarify: boolean;
  can_finish: boolean;
  ready_to_finish: boolean;
};

export const ExtractedDataSchema = z.object({
  schema_version: z.literal(1).default(1),
  career_context: CareerContextSchema.default({}),
  career_goal: CareerGoalSchema.default({}),
  achievements: z.array(AchievementSchema).default([]),
  evidence: z.array(EvidenceItemSchema).default([]),
  problem_solving: z.array(ProblemSolvingItemSchema).default([]),
  leadership: z.array(LeadershipItemSchema).default([]),
  learning: z.array(LearningItemSchema).default([]),
  pending_followups: z.array(FollowupSchema).default([]),
  category_turns: z.record(z.string(), z.number()).default({}),
  last_plan: LastPlanSchema.nullable().default(null),
});
export type ExtractedData = z.infer<typeof ExtractedDataSchema>;

export const emptyExtractedData = (): ExtractedData => ExtractedDataSchema.parse({});

/* ────────────────────────── DB rows & API DTOs ────────────────────────── */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  turn: number;
  created_at: string;
  meta?: Record<string, unknown>;
}

export interface SessionRow {
  id: string;
  user_id: string;
  status: "active" | "completed" | "abandoned";
  locale: Locale;
  messages: ChatMessage[];
  extracted_data: unknown;
  current_category: DiscoveryCategory;
  turn_count: number;
  version: number;
  started_at: string;
  last_message_at: string;
  completed_at: string | null;
}

export interface ProfileStrength {
  name: string;
  description: string;
  level: "emerging" | "solid" | "standout";
  /** Evidence > Self Claim: mỗi strength phải truy về ≥1 achievement */
  evidence_achievement_ids: string[];
}

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  points: number;
  max: number;
}

export interface CareerDna {
  primary: CareerDnaType | null;
  secondary: CareerDnaType | null;
  scores: Record<CareerDnaType, number>; // 0..100, tương đối
  confidence: number; // 0..1
  rationale: string | null;
  evidence_achievement_ids: string[];
}

export interface CareerProfileDTO {
  user_id: string;
  headline: string | null;
  career_summary: string | null;
  strengths: ProfileStrength[];
  career_dna: CareerDna | Record<string, never>;
  employability_score: number;
  score_breakdown: ScoreBreakdownItem[];
  coverage: Record<string, number>;
  achievements: Achievement[];
  evidence: unknown[];
  updated_at: string;
}

export const SessionMessagesSchema = z.array(
  z.object({
    id: z.string(),
    role: z.enum(["user", "assistant"]),
    content: z.string(),
    turn: z.number(),
    created_at: z.string(),
    meta: z.record(z.string(), z.unknown()).optional(),
  }),
);
