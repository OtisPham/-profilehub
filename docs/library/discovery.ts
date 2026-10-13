// =====================================================================
// supabase/functions/_shared/types/discovery.ts
// Type + hằng số dùng chung cho luồng Career Discovery (chat tự do, fresher).
// Nếu repo đã có type tương đương trong shared/types/, thay import ở index.ts.
// =====================================================================

/** Các loại thực thể AI được phép đề xuất (khớp $defs trong career_profile_v1). */
export const ENTITY_TYPES = ["experience", "achievement", "project", "activity", "education"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/** Nhãn phân loại tin nhắn (mục 5.3 của spec v1.1). Một tin nhắn có thể có nhiều nhãn. */
export const MESSAGE_CATEGORIES = [
  "answer", "dump", "short_or_vague", "correction", "topic_switch", "counter_question",
  "low_confidence", "fabrication_request", "sensitive_info", "wants_to_stop",
  "overwhelmed", "off_topic", "gibberish",
] as const;
export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];

export const FACT_INTENTS = ["add", "correct"] as const;
export type FactIntent = (typeof FACT_INTENTS)[number];

export const FACT_ORIGINS = ["user_stated", "ai_inferred"] as const;
export type FactOrigin = (typeof FACT_ORIGINS)[number];

export const CONFIDENCES = ["low", "medium", "high"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

/** Chính sách ghi nhận (mục 5.4): auto = rủi ro thấp; confirm = chờ 1 chạm; suggest_only = chỉ đề xuất. */
export const COMMIT_POLICIES = ["auto", "confirm", "suggest_only"] as const;
export type CommitPolicy = (typeof COMMIT_POLICIES)[number];

/** Dữ kiện do LLM đề xuất (sau khi chuẩn hoá giá trị mặc định). */
export interface SuggestedFact {
  temp_id: string;
  intent: FactIntent;
  entity_type: EntityType;
  target_id: string | null; // chỉ dùng khi intent = "correct"
  parent_id: string | null; // id thực thể đã biết, hoặc temp_id của dữ kiện khác trong cùng lượt
  data: Record<string, unknown>; // bản nháp thực thể, khớp $defs tương ứng (đã nới `required`)
  evidence_quote: string; // trích đoạn NGUYÊN VĂN từ tin nhắn người dùng
  origin: FactOrigin;
  estimated: boolean;
  confidence: Confidence;
}

/** Tham chiếu tới thực thể đã có (đã ghi nhận hoặc đang chờ xác nhận). */
export interface ResolvedRef {
  kind: "pending" | "committed";
  entity_type: EntityType;
  id: string;
}

export interface KnownEntity extends ResolvedRef {
  label: string;
}

/** Hàng ghi vào bảng discovery_pending_facts. */
export interface PendingFactInsert {
  id: string;
  user_id: string;
  session_id: string;
  raw_answer_id: string;
  temp_id: string;
  intent: FactIntent;
  entity_type: EntityType;
  target_ref: ResolvedRef | null;
  parent_ref: ResolvedRef | null;
  data: Record<string, unknown>;
  evidence_quote: string;
  origin: FactOrigin;
  estimated: boolean;
  confidence: Confidence;
  commit_policy: CommitPolicy;
}

export interface PublicPendingFact extends Omit<PendingFactInsert, "user_id" | "session_id"> {
  status: "pending";
  created_at: string;
}

export interface ApiWarning {
  code: string;
  message: string;
}

/** Body request từ frontend. */
export interface ChatRequestBody {
  session_id: string; // /^[A-Za-z0-9_-]{8,64}$/
  message_id: string; // UUID do client sinh, dùng để chống gửi trùng (idempotency)
  message: string;
}

/** Body response thành công. */
export interface ChatResponseBody {
  request_id: string;
  message_id: string;
  raw_answer_id: string;
  replayed: boolean; // true nếu message_id đã được xử lý trước đó
  ai_reply: string;
  categories: MessageCategory[];
  next_question_id: string | null;
  new_fact_ids: string[]; // dữ kiện phát sinh từ lượt này
  pending_facts: PublicPendingFact[]; // toàn bộ dữ kiện đang chờ của phiên
  warnings: ApiWarning[];
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    request_id: string;
    raw_answer_id?: string; // có khi tin nhắn đã được lưu; gửi lại cùng message_id để xử lý tiếp
  };
}
