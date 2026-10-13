// =====================================================================
// supabase/functions/career-discovery-chat/index.ts
// Career Discovery (chat tự do, fresher): phân loại -> trích xuất -> validate -> lưu.
//
// SECRETS (supabase secrets set ...):
//   OPENAI_API_KEY   hoặc   GEMINI_API_KEY       (theo LLM_PROVIDER)
//   LLM_PROVIDER     openai | gemini             (mặc định: openai)
//   LLM_MODEL        vd gpt-4o-mini               (mặc định theo provider)
//   LLM_TIMEOUT_MS   mặc định 25000
//   ALLOWED_ORIGINS  "https://app.example.com,http://localhost:5173" (bỏ trống = "*")
//   RATE_LIMIT_PER_MINUTE  mặc định 12
//   (SUPABASE_URL và SUPABASE_ANON_KEY do Supabase tự cấp)
//
// DEPLOY:  supabase functions deploy career-discovery-chat        (giữ verify_jwt = true)
// GỌI THỬ: curl -X POST "$SUPABASE_URL/functions/v1/career-discovery-chat" \
//            -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json" \
//            -d '{"session_id":"sess_0001abcd","message_id":"'$(uuidgen)'","message":"Mình học CNTT năm 4"}'
//
// GHI DỮ LIỆU bằng client mang JWT của người dùng (KHÔNG dùng service_role) nên RLS luôn có hiệu lực.
// =====================================================================
import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";
import Ajv2020Module from "npm:ajv@8.17.1/dist/2020.js";
import addFormatsModule from "npm:ajv-formats@3.0.1";
import careerSchema from "../_shared/schemas/career_profile_v1.schema.json" with { type: "json" };
import {
  CONFIDENCES,
  ENTITY_TYPES,
  FACT_INTENTS,
  FACT_ORIGINS,
  MESSAGE_CATEGORIES,
} from "../_shared/types/discovery.ts";
import type {
  ApiErrorBody,
  ApiWarning,
  ChatRequestBody,
  ChatResponseBody,
  Confidence,
  EntityType,
  FactIntent,
  FactOrigin,
  KnownEntity,
  MessageCategory,
  PendingFactInsert,
  PublicPendingFact,
  ResolvedRef,
  SuggestedFact,
} from "../_shared/types/discovery.ts";
import {
  buildNumberIndex,
  checkReply,
  classifyCommitPolicy,
  extractJson,
  findUngroundedNumbers,
  hardenObjectSchemas,
  hasAnyNumber,
  looksLikeFabricationRequest,
  quoteIsVerbatim,
  redactSensitive,
  stripUngroundedMetrics,
} from "./guards.ts";
import type { NumberIndex } from "./guards.ts";
import { buildSystemPrompt, buildUserPrompt } from "./prompt.ts";
import type { PromptContext } from "./prompt.ts";
import { getQuestion, openQuestions, pickNudge, QUESTION_IDS } from "./question-bank.ts";

// ---------------------------------------------------------------------
// 0. Cấu hình
// ---------------------------------------------------------------------
const envInt = (name: string, fallback: number): number => {
  const n = Number(Deno.env.get(name));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const CFG = {
  llmProvider: (Deno.env.get("LLM_PROVIDER") ?? "openai").toLowerCase(),
  llmModel: Deno.env.get("LLM_MODEL") ?? "",
  llmTimeoutMs: envInt("LLM_TIMEOUT_MS", 25_000),
  llmMaxOutputTokens: envInt("LLM_MAX_OUTPUT_TOKENS", 1_500),
  llmTemperature: Deno.env.get("LLM_TEMPERATURE") ? Number(Deno.env.get("LLM_TEMPERATURE")) : undefined,
  rateLimitPerMinute: envInt("RATE_LIMIT_PER_MINUTE", 12),
  maxMessageChars: 4_000,
  maxBodyBytes: 32_768,
  historyTurns: 6,
  maxFactsPerTurn: 8,
  maxFactDataChars: 4_000,
  allowedOrigins: (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
};

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const CATEGORY_SET: ReadonlySet<string> = new Set(MESSAGE_CATEGORIES);

// ---------------------------------------------------------------------
// 1. Lỗi có kiểu + log có cấu trúc (KHÔNG log nội dung tin nhắn)
// ---------------------------------------------------------------------
class HttpError extends Error {
  status: number;
  code: string;
  retryable: boolean;
  extra: Record<string, unknown>;
  headers: Record<string, string>;
  constructor(
    status: number,
    code: string,
    message: string,
    opts: { retryable?: boolean; extra?: Record<string, unknown>; headers?: Record<string, string> } = {},
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.retryable = opts.retryable ?? false;
    this.extra = opts.extra ?? {};
    this.headers = opts.headers ?? {};
  }
}

type LlmErrorKind = "timeout" | "network" | "http" | "blocked" | "empty" | "truncated";
class LlmError extends Error {
  kind: LlmErrorKind;
  status?: number;
  constructor(kind: LlmErrorKind, message: string, status?: number) {
    super(message);
    this.name = "LlmError";
    this.kind = kind;
    this.status = status;
  }
}

function log(level: "info" | "warn" | "error", requestId: string, event: string, fields: Record<string, unknown> = {}) {
  console[level === "info" ? "log" : level](JSON.stringify({ level, request_id: requestId, event, ...fields }));
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uniq = <T>(a: T[]): T[] => [...new Set(a)];

// ---------------------------------------------------------------------
// 2. CORS + response helpers
// ---------------------------------------------------------------------
function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin");
  let allow = "*";
  if (CFG.allowedOrigins.length > 0) {
    allow = origin && CFG.allowedOrigins.includes(origin) ? origin : CFG.allowedOrigins[0];
  }
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
  requestId: string,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      ...extraHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
    },
  });
}

function errorResponse(err: unknown, cors: Record<string, string>, requestId: string): Response {
  if (err instanceof HttpError) {
    log(err.status >= 500 ? "error" : "warn", requestId, "request_failed", { code: err.code, status: err.status });
    const body: ApiErrorBody = {
      error: { code: err.code, message: err.message, retryable: err.retryable, request_id: requestId, ...err.extra },
    };
    return json(body, err.status, cors, requestId, err.headers);
  }
  log("error", requestId, "unhandled", {
    name: err instanceof Error ? err.name : typeof err,
    message: err instanceof Error ? err.message.slice(0, 200) : undefined,
  });
  const body: ApiErrorBody = {
    error: { code: "INTERNAL", message: "Đã có lỗi hệ thống. Vui lòng thử lại.", retryable: true, request_id: requestId },
  };
  return json(body, 500, cors, requestId);
}

// ---------------------------------------------------------------------
// 3. Môi trường + xác thực JWT
// ---------------------------------------------------------------------
interface RuntimeEnv {
  supabaseUrl: string;
  anonKey: string;
  llmKey: string;
  provider: "openai" | "gemini";
  model: string;
}

function readEnv(requestId: string): RuntimeEnv {
  const provider = CFG.llmProvider;
  if (provider !== "openai" && provider !== "gemini") {
    log("error", requestId, "misconfigured", { missing: "LLM_PROVIDER(openai|gemini)" });
    throw new HttpError(500, "SERVER_MISCONFIGURED", "Dịch vụ chưa được cấu hình đúng.");
  }
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  // API key của LLM CHỈ đọc từ server secrets, không bao giờ trả về client.
  const llmKey = Deno.env.get(provider === "openai" ? "OPENAI_API_KEY" : "GEMINI_API_KEY");
  const missing = [
    !supabaseUrl && "SUPABASE_URL",
    !anonKey && "SUPABASE_ANON_KEY",
    !llmKey && (provider === "openai" ? "OPENAI_API_KEY" : "GEMINI_API_KEY"),
  ].filter(Boolean);
  if (missing.length > 0) {
    log("error", requestId, "misconfigured", { missing });
    throw new HttpError(500, "SERVER_MISCONFIGURED", "Dịch vụ chưa được cấu hình đúng.");
  }
  return {
    supabaseUrl: supabaseUrl!,
    anonKey: anonKey!,
    llmKey: llmKey!,
    provider,
    model: CFG.llmModel || (provider === "openai" ? "gpt-4o-mini" : "gemini-2.0-flash"),
  };
}

async function authenticate(req: Request, env: RuntimeEnv): Promise<{ supabase: SupabaseClient; user: User }> {
  const match = /^Bearer\s+(.+)$/i.exec(req.headers.get("Authorization") ?? "");
  if (!match) throw new HttpError(401, "UNAUTHENTICATED", "Thiếu thông tin đăng nhập.");
  const jwt = match[1].trim();

  // Client mang JWT của người dùng: mọi truy vấn DB đều đi qua RLS.
  const supabase = createClient(env.supabaseUrl, env.anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // getUser(jwt) hỏi thẳng Auth server: token giả, hết hạn hoặc chỉ là anon key đều bị từ chối.
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) throw new HttpError(401, "UNAUTHENTICATED", "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
  return { supabase, user: data.user };
}

// ---------------------------------------------------------------------
// 4. Đọc + kiểm tra request
// ---------------------------------------------------------------------
async function parseBody(req: Request): Promise<ChatRequestBody> {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type phải là application/json.");
  }
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > CFG.maxBodyBytes) throw new HttpError(413, "PAYLOAD_TOO_LARGE", "Nội dung gửi lên quá lớn.");
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > CFG.maxBodyBytes) {
    throw new HttpError(413, "PAYLOAD_TOO_LARGE", "Nội dung gửi lên quá lớn.");
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Body không phải JSON hợp lệ.");
  }
  if (!isRecord(body)) throw new HttpError(400, "INVALID_REQUEST", "Body phải là một đối tượng JSON.");

  const { session_id, message_id, message } = body;
  if (typeof session_id !== "string" || !ID_RE.test(session_id)) {
    throw new HttpError(400, "INVALID_REQUEST", "session_id không hợp lệ (8-64 ký tự chữ, số, _ hoặc -).");
  }
  if (typeof message_id !== "string" || !ID_RE.test(message_id)) {
    throw new HttpError(400, "INVALID_REQUEST", "message_id không hợp lệ (nên là UUID do client sinh).");
  }
  if (typeof message !== "string") throw new HttpError(400, "INVALID_REQUEST", "message phải là chuỗi.");
  // eslint-disable-next-line no-control-regex
  const clean = message.normalize("NFC").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  if (!clean) throw new HttpError(400, "INVALID_REQUEST", "Tin nhắn đang trống.");
  if (clean.length > CFG.maxMessageChars) {
    throw new HttpError(400, "MESSAGE_TOO_LONG", `Tin nhắn tối đa ${CFG.maxMessageChars} ký tự.`);
  }
  return { session_id, message_id, message: clean };
}

// ---------------------------------------------------------------------
// 5. Truy cập DB (qua client của người dùng, RLS bảo vệ)
// ---------------------------------------------------------------------
function dbError(requestId: string, op: string, error: { code?: string; message?: string }): never {
  log("error", requestId, "db_error", { op, pg_code: error.code, detail: error.message?.slice(0, 160) });
  throw new HttpError(500, "DB_ERROR", "Lỗi lưu hoặc đọc dữ liệu. Vui lòng thử lại.", { retryable: true });
}

async function enforceRateLimit(supabase: SupabaseClient, userId: string, requestId: string) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count, error } = await supabase
    .from("raw_answers")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  if (error) dbError(requestId, "rate_limit.count", error);
  if ((count ?? 0) >= CFG.rateLimitPerMinute) {
    throw new HttpError(429, "RATE_LIMITED", "Bạn gửi hơi nhanh, hãy đợi vài giây rồi thử lại.", {
      retryable: true,
      headers: { "Retry-After": "20" },
    });
  }
}

interface SavedRaw {
  id: string;
  resumed: boolean; // hàng đã tồn tại từ lần gửi trước (client gửi lại sau lỗi)
  completed: { ai_reply: string; categories: string[]; next_question_id: string | null } | null;
}

/** Lưu tin nhắn TRƯỚC khi gọi LLM để không mất dữ liệu nếu LLM lỗi; message_id đảm bảo idempotent. */
async function saveRawAnswer(
  supabase: SupabaseClient,
  userId: string,
  body: ChatRequestBody,
  redactedText: string,
  requestId: string,
): Promise<SavedRaw> {
  const { data, error } = await supabase
    .from("raw_answers")
    .insert({
      user_id: userId,
      session_id: body.session_id,
      message_id: body.message_id,
      text: redactedText,
      answered_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (!error) return { id: data.id as string, resumed: false, completed: null };
  if (error.code !== "23505") dbError(requestId, "raw_answers.insert", error);

  const { data: existing, error: readErr } = await supabase
    .from("raw_answers")
    .select("id, text, ai_reply, categories, next_question_id")
    .eq("user_id", userId)
    .eq("message_id", body.message_id)
    .maybeSingle();
  if (readErr || !existing) dbError(requestId, "raw_answers.select_existing", readErr ?? { message: "not found" });
  if (existing.text !== redactedText) {
    throw new HttpError(409, "MESSAGE_ID_REUSED", "message_id này đã dùng cho một tin nhắn khác. Hãy tạo message_id mới.");
  }
  return {
    id: existing.id as string,
    resumed: true,
    completed: existing.ai_reply
      ? { ai_reply: existing.ai_reply, categories: existing.categories ?? [], next_question_id: existing.next_question_id ?? null }
      : null,
  };
}

const PENDING_COLUMNS =
  "id, raw_answer_id, temp_id, intent, entity_type, target_ref, parent_ref, data, evidence_quote, origin, estimated, confidence, commit_policy, created_at";

async function loadSessionPending(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  requestId: string,
): Promise<PublicPendingFact[]> {
  const { data, error } = await supabase
    .from("discovery_pending_facts")
    .select(PENDING_COLUMNS)
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) dbError(requestId, "pending_facts.select", error);
  return (data ?? []).map((r: Record<string, unknown>) => ({ ...r, status: "pending" })) as unknown as PublicPendingFact[];
}

interface LoadedContext {
  prompt: PromptContext;
  numberTexts: string[]; // văn bản dùng để cho phép số trong ai_reply (không dùng cho dữ kiện)
  known: Map<string, KnownEntity>;
  covered: Set<string>;
}

const entityLabel = (data: unknown): string => {
  if (!isRecord(data)) return "(chưa đặt tên)";
  const org = isRecord(data.organization) ? data.organization.name : data.organization;
  const v = data.title ?? org ?? data.institution ?? "(chưa đặt tên)";
  return String(v).slice(0, 80);
};

async function loadContext(
  supabase: SupabaseClient,
  userId: string,
  body: ChatRequestBody,
  requestId: string,
): Promise<LoadedContext> {
  const [history, coverage, experiences, achievements, pending] = await Promise.all([
    supabase.from("raw_answers").select("text, ai_reply, categories")
      .eq("user_id", userId).eq("session_id", body.session_id).neq("message_id", body.message_id)
      .not("ai_reply", "is", null).order("answered_at", { ascending: false }).limit(CFG.historyTurns),
    supabase.from("raw_answers").select("covers_question_ids").eq("user_id", userId).limit(500),
    supabase.from("experiences").select("id, title, organization_name")
      .eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    supabase.from("achievements").select("id, title")
      .eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    supabase.from("discovery_pending_facts").select("id, entity_type, data")
      .eq("user_id", userId).eq("session_id", body.session_id).eq("status", "pending")
      .order("created_at", { ascending: false }).limit(15),
  ]);
  for (const [op, res] of Object.entries({ history, coverage, experiences, achievements, pending })) {
    if (res.error) dbError(requestId, `context.${op}`, res.error);
  }

  const turns = ((history.data ?? []) as Array<{ text: string; ai_reply: string | null; categories: string[] | null }>).reverse();
  const covered = new Set<string>();
  for (const row of (coverage.data ?? []) as Array<{ covers_question_ids: string[] | null }>) {
    for (const id of row.covers_question_ids ?? []) covered.add(id);
  }

  const known = new Map<string, KnownEntity>();
  for (const e of (experiences.data ?? []) as Array<{ id: string; title: string; organization_name: string }>) {
    known.set(e.id, { kind: "committed", entity_type: "experience", id: e.id, label: `${e.title} @ ${e.organization_name}`.slice(0, 80) });
  }
  for (const a of (achievements.data ?? []) as Array<{ id: string; title: string }>) {
    known.set(a.id, { kind: "committed", entity_type: "achievement", id: a.id, label: a.title.slice(0, 80) });
  }
  for (const p of (pending.data ?? []) as Array<{ id: string; entity_type: EntityType; data: unknown }>) {
    known.set(p.id, { kind: "pending", entity_type: p.entity_type, id: p.id, label: entityLabel(p.data) });
  }

  // Người dùng bí 2 lượt liên tiếp -> dùng câu gợi nhớ FRS-NUDGE (mục 5.6).
  const STUCK = new Set(["short_or_vague", "low_confidence", "gibberish", "off_topic"]);
  const lastTwo = turns.slice(-2);
  const stuck = lastTwo.length === 2 && lastTwo.every((t) => (t.categories ?? []).some((c) => STUCK.has(c)));
  const nudge = stuck ? pickNudge(turns.length) : null;

  return {
    prompt: {
      recentTurns: turns.map((t) => ({ user: t.text, assistant: t.ai_reply })),
      knownEntities: [...known.values()],
      openQuestions: openQuestions(covered).map((q) => ({ id: q.id, text: q.text })),
      coveredQuestionIds: [...covered],
      nudge: nudge ? { id: nudge.id, text: nudge.text } : null,
    },
    numberTexts: [...turns.map((t) => t.text), ...[...known.values()].map((k) => k.label)],
    known,
    covered,
  };
}

// ---------------------------------------------------------------------
// 6. Gọi LLM (OpenAI / Gemini) qua REST: timeout, retry có kiểm soát, JSON mode
// ---------------------------------------------------------------------
async function callOnce(env: RuntimeEnv, system: string, user: string): Promise<string> {
  const signal = AbortSignal.timeout(CFG.llmTimeoutMs);
  let res: Response;
  try {
    if (env.provider === "openai") {
      res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal,
        headers: { "Authorization": `Bearer ${env.llmKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: env.model,
          max_completion_tokens: CFG.llmMaxOutputTokens,
          ...(CFG.llmTemperature !== undefined ? { temperature: CFG.llmTemperature } : {}),
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: system }, { role: "user", content: user }],
        }),
      });
    } else {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.model)}:generateContent`,
        {
          method: "POST",
          signal,
          headers: { "x-goog-api-key": env.llmKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: "user", parts: [{ text: user }] }],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: CFG.llmMaxOutputTokens,
              ...(CFG.llmTemperature !== undefined ? { temperature: CFG.llmTemperature } : {}),
            },
          }),
        },
      );
    }
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "TimeoutError" || name === "AbortError") throw new LlmError("timeout", "LLM timeout");
    throw new LlmError("network", "LLM network error");
  }
  if (!res.ok) {
    await res.body?.cancel(); // không đọc/log body: có thể chứa nội dung prompt
    throw new LlmError("http", `LLM HTTP ${res.status}`, res.status);
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "TimeoutError" || name === "AbortError") throw new LlmError("timeout", "LLM timeout");
    throw new LlmError("empty", "LLM response is not JSON");
  }
  return extractText(env.provider, payload);
}

function extractText(provider: "openai" | "gemini", payload: unknown): string {
  if (!isRecord(payload)) throw new LlmError("empty", "empty payload");
  if (provider === "openai") {
    const choice = Array.isArray(payload.choices) && isRecord(payload.choices[0]) ? payload.choices[0] : undefined;
    const finish = choice?.finish_reason;
    if (finish === "content_filter") throw new LlmError("blocked", "content filtered");
    if (finish === "length") throw new LlmError("truncated", "output truncated");
    const content = isRecord(choice?.message) ? choice.message.content : undefined;
    if (typeof content !== "string" || !content.trim()) throw new LlmError("empty", "empty content");
    return content;
  }
  if (isRecord(payload.promptFeedback) && payload.promptFeedback.blockReason) {
    throw new LlmError("blocked", "prompt blocked");
  }
  const cand = Array.isArray(payload.candidates) && isRecord(payload.candidates[0]) ? payload.candidates[0] : undefined;
  const reason = cand?.finishReason;
  if (reason === "MAX_TOKENS") throw new LlmError("truncated", "output truncated");
  if (typeof reason === "string" && ["SAFETY", "RECITATION", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(reason)) {
    throw new LlmError("blocked", "candidate blocked");
  }
  const parts = isRecord(cand?.content) && Array.isArray(cand.content.parts) ? cand.content.parts : [];
  const text = parts.map((p: unknown) => (isRecord(p) && typeof p.text === "string" ? p.text : "")).join("");
  if (!text.trim()) throw new LlmError("empty", "empty content");
  return text;
}

/** Thử lại đúng 1 lần cho lỗi mạng / 429 / 5xx. Timeout không thử lại (giữ độ trễ thấp, client tự gửi lại). */
async function callWithRetry(env: RuntimeEnv, system: string, user: string, requestId: string): Promise<string> {
  try {
    return await callOnce(env, system, user);
  } catch (e) {
    const retryable = e instanceof LlmError &&
      (e.kind === "network" || (e.kind === "http" && (e.status === 429 || (e.status ?? 0) >= 500)));
    if (!retryable) throw e;
    log("warn", requestId, "llm_retry", { kind: (e as LlmError).kind, status: (e as LlmError).status });
    await sleep(700);
    return await callOnce(env, system, user);
  }
}

function llmToHttpError(e: unknown): HttpError {
  if (e instanceof HttpError) return e;
  if (e instanceof LlmError) {
    switch (e.kind) {
      case "timeout":
        return new HttpError(504, "LLM_TIMEOUT", "AI phản hồi quá lâu. Tin nhắn của bạn đã được lưu, hãy thử gửi lại.", { retryable: true });
      case "blocked":
        return new HttpError(502, "LLM_BLOCKED", "AI không thể xử lý nội dung này. Bạn thử diễn đạt lại nhé.");
      case "http":
        if (e.status === 401 || e.status === 403) {
          return new HttpError(500, "SERVER_MISCONFIGURED", "Dịch vụ chưa được cấu hình đúng.");
        }
        if (e.status === 429) {
          return new HttpError(503, "LLM_RATE_LIMITED", "AI đang quá tải. Vui lòng thử lại sau vài giây.", {
            retryable: true, headers: { "Retry-After": "5" },
          });
        }
        return new HttpError(502, "LLM_UNAVAILABLE", "Dịch vụ AI tạm thời không khả dụng. Hãy thử lại.", { retryable: true });
      default:
        return new HttpError(502, "LLM_UNAVAILABLE", "Dịch vụ AI tạm thời không khả dụng. Hãy thử lại.", { retryable: true });
    }
  }
  return new HttpError(500, "INTERNAL", "Đã có lỗi hệ thống. Vui lòng thử lại.", { retryable: true });
}

// ---------------------------------------------------------------------
// 7. Phân tích đầu ra LLM: JSON an toàn + kiểm tra "vỏ" (envelope)
// ---------------------------------------------------------------------
interface ParsedTurn {
  categories: MessageCategory[];
  covers: string[];
  nextQuestionId: string | null;
  facts: unknown[];
  reply: string;
}

function parseEnvelope(raw: string): ParsedTurn {
  const parsed = extractJson(raw);
  if (!isRecord(parsed)) throw new Error("ENVELOPE_NOT_OBJECT");
  if (typeof parsed.ai_reply !== "string" || !parsed.ai_reply.trim()) throw new Error("MISSING_AI_REPLY");
  const facts = parsed.suggested_facts ?? [];
  if (!Array.isArray(facts)) throw new Error("SUGGESTED_FACTS_NOT_ARRAY");
  const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  return {
    categories: uniq(strings(parsed.categories).filter((c): c is MessageCategory => CATEGORY_SET.has(c))),
    covers: uniq(strings(parsed.covers_question_ids).filter((id) => QUESTION_IDS.has(id))),
    nextQuestionId: typeof parsed.next_question_id === "string" ? parsed.next_question_id : null,
    facts: facts.slice(0, CFG.maxFactsPerTurn),
    reply: parsed.ai_reply.trim().slice(0, 800),
  };
}

async function generateTurn(env: RuntimeEnv, system: string, userPrompt: string, requestId: string): Promise<ParsedTurn> {
  let problem = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt = attempt === 0
      ? userPrompt
      : `${userPrompt}\n\nLưu ý: lần trước đầu ra không hợp lệ (${problem}). Chỉ trả về MỘT đối tượng JSON đúng định dạng.`;
    let raw: string;
    try {
      raw = await callWithRetry(env, system, prompt, requestId);
    } catch (e) {
      if (attempt === 0 && e instanceof LlmError && (e.kind === "empty" || e.kind === "truncated")) {
        problem = e.kind;
        continue;
      }
      throw llmToHttpError(e);
    }
    try {
      return parseEnvelope(raw);
    } catch (e) {
      problem = e instanceof Error ? e.message : "INVALID";
      log("warn", requestId, "llm_bad_output", { attempt, problem });
    }
  }
  throw new HttpError(502, "LLM_BAD_OUTPUT", "AI trả về dữ liệu không hợp lệ. Tin nhắn của bạn đã được lưu, hãy thử gửi lại.", { retryable: true });
}

// ---------------------------------------------------------------------
// 8. Validate dữ kiện bằng Ajv trên career_profile_v1.schema.json
//    - Dùng đúng $defs (Experience, Achievement, Project, Activity, Education) nên luôn khớp schema gốc.
//    - Bản nháp: bỏ lỗi `required` ở cấp gốc (thiếu id/meta/period...), NHƯNG mọi lỗi kiểu, enum,
//      pattern, min/max và khoá lạ ở mọi cấp vẫn bị chặn.
// ---------------------------------------------------------------------
// deno-lint-ignore no-explicit-any
const AjvCtor: any = (Ajv2020Module as any).default ?? Ajv2020Module;
// deno-lint-ignore no-explicit-any
const addFormats: any = (addFormatsModule as any).default ?? addFormatsModule;
const ajv = new AjvCtor({ allErrors: true, strict: false, allowUnionTypes: true });
addFormats(ajv);

const DRAFT_SCHEMA_ID = "https://profilehub.internal/schemas/career-profile-v1.draft.json";
{
  const draft = structuredClone(careerSchema) as Record<string, unknown>;
  hardenObjectSchemas(draft.$defs); // siết khoá lạ trên BẢN SAO
  draft.$id = DRAFT_SCHEMA_ID;
  ajv.addSchema(draft);
}

interface AjvError {
  keyword: string;
  instancePath: string;
  message?: string;
}
type DraftValidator = ((data: unknown) => boolean) & { errors?: AjvError[] | null };

const DEF_NAME: Record<EntityType, string> = {
  experience: "Experience",
  achievement: "Achievement",
  project: "Project",
  activity: "Activity",
  education: "Education",
};
const draftValidators = {} as Record<EntityType, DraftValidator>;
for (const t of ENTITY_TYPES) {
  const v = ajv.getSchema(`${DRAFT_SCHEMA_ID}#/$defs/${DEF_NAME[t]}`) as DraftValidator | undefined;
  if (!v) throw new Error(`Không tìm thấy $defs/${DEF_NAME[t]} trong career_profile_v1.schema.json`);
  draftValidators[t] = v;
}

/** Whitelist trường AI được điền. `id`, `meta`, `quality`, `resume_bullets`, `evidence_ids`,
 *  `dna_signals`, `competencies`... do server/người dùng quyết định, AI không được đụng tới. */
const ALLOWED_FIELDS: Record<EntityType, ReadonlySet<string>> = {
  experience: new Set(["organization", "title", "employment_type", "period", "location", "team_size", "responsibilities", "highlight", "skills_used"]),
  achievement: new Set(["title", "role", "star", "result", "beyond_scope", "skills_used"]),
  project: new Set(["title", "description", "motivation", "role", "period", "stack_or_methods", "links", "outcome"]),
  activity: new Set(["type", "organization", "role", "period", "result"]),
  education: new Set(["institution", "degree", "major", "period", "gpa", "honors"]),
};
/** Dữ kiện "add" phải có ít nhất một trường định danh, tránh bản ghi vô nghĩa. */
const IDENTITY_KEYS: Record<EntityType, readonly string[]> = {
  experience: ["organization", "title"],
  achievement: ["title"],
  project: ["title"],
  activity: ["organization", "role"],
  education: ["institution"],
};

const FACT_KEYS = ["temp_id", "intent", "entity_type", "target_id", "parent_id", "data", "evidence_quote", "origin", "estimated", "confidence"];
const factShapeValidator = ajv.compile({
  type: "object",
  additionalProperties: false,
  required: ["temp_id", "intent", "entity_type", "data", "evidence_quote"],
  properties: {
    temp_id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,24}$" },
    intent: { enum: [...FACT_INTENTS] },
    entity_type: { enum: [...ENTITY_TYPES] },
    target_id: { type: ["string", "null"], maxLength: 64 },
    parent_id: { type: ["string", "null"], maxLength: 64 },
    data: { type: "object" },
    evidence_quote: { type: "string", minLength: 4, maxLength: 400 },
    origin: { enum: [...FACT_ORIGINS] },
    estimated: { type: "boolean" },
    confidence: { enum: [...CONFIDENCES] },
  },
}) as DraftValidator;

const summarizeErrors = (errs: AjvError[] | null | undefined): string =>
  (errs ?? []).slice(0, 5).map((e) => `${e.instancePath || "/"}:${e.keyword}`).join(",");

interface FactContext {
  message: string;
  numbers: NumberIndex;
  known: Map<string, KnownEntity>;
  fabrication: boolean;
}
type FactResult =
  | { ok: true; fact: SuggestedFact; targetRef: ResolvedRef | null; metricsRemoved: number }
  | { ok: false; code: string; detail?: string };

function validateFact(raw: unknown, fc: FactContext): FactResult {
  if (!isRecord(raw)) return { ok: false, code: "SHAPE_INVALID" };
  const picked: Record<string, unknown> = {};
  for (const k of FACT_KEYS) if (k in raw) picked[k] = raw[k];
  if (!factShapeValidator(picked)) return { ok: false, code: "SHAPE_INVALID", detail: summarizeErrors(factShapeValidator.errors) };

  const entityType = picked.entity_type as EntityType;
  const intent = picked.intent as FactIntent;
  const quote = picked.evidence_quote as string;

  // (a) Căn cứ: trích đoạn phải là NGUYÊN VĂN từ tin nhắn hiện tại.
  if (!quoteIsVerbatim(fc.message, quote)) return { ok: false, code: "QUOTE_NOT_FOUND" };

  // (b) Chỉ giữ các trường AI được phép điền.
  const allowed = ALLOWED_FIELDS[entityType];
  const filtered: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(picked.data as Record<string, unknown>)) if (allowed.has(k)) filtered[k] = v;
  if (Object.keys(filtered).length === 0) return { ok: false, code: "EMPTY_FACT" };
  if (intent === "add" && !IDENTITY_KEYS[entityType].some((k) => k in filtered)) return { ok: false, code: "MISSING_IDENTITY" };
  if (JSON.stringify(filtered).length > CFG.maxFactDataChars) return { ok: false, code: "TOO_LARGE" };

  // (c) Đối tượng được sửa (correction) phải là thực thể đã biết, cùng loại.
  let targetRef: ResolvedRef | null = null;
  if (intent === "correct") {
    const target = typeof picked.target_id === "string" ? fc.known.get(picked.target_id) : undefined;
    if (!target || target.entity_type !== entityType) return { ok: false, code: "TARGET_NOT_FOUND" };
    targetRef = { kind: target.kind, entity_type: target.entity_type, id: target.id };
  }

  // (d) KHÔNG BỊA SỐ: số đo cấu trúc không có căn cứ bị gỡ; số nằm trong văn bản mà không có căn cứ => loại dữ kiện.
  //     Ngày tháng (`period`) được miễn kiểm tra này vì luôn ở trạng thái "chờ xác nhận".
  const stripped = stripUngroundedMetrics(filtered, fc.numbers, fc.fabrication);
  if (fc.fabrication) {
    if (hasAnyNumber(stripped.data, ["period"])) return { ok: false, code: "FABRICATION_NUMBERS" };
  } else if (findUngroundedNumbers(stripped.data, fc.numbers, ["period"]).length > 0) {
    return { ok: false, code: "UNGROUNDED_NUMBER" };
  }
  const data = stripped.data;

  // (e) Khớp JSON Schema (Ajv, $defs tương ứng, đã nới `required` cấp gốc).
  const validate = draftValidators[entityType];
  if (!validate(data)) {
    const errs = (validate.errors ?? []).filter((e) => !(e.keyword === "required" && e.instancePath === ""));
    if (errs.length > 0) return { ok: false, code: "SCHEMA_INVALID", detail: summarizeErrors(errs) };
  }

  const estimated = (picked.estimated as boolean | undefined) ?? false;
  return {
    ok: true,
    metricsRemoved: stripped.removed,
    targetRef,
    fact: {
      temp_id: picked.temp_id as string,
      intent,
      entity_type: entityType,
      target_id: intent === "correct" ? (picked.target_id as string) : null,
      parent_id: (picked.parent_id as string | null | undefined) ?? null,
      data,
      evidence_quote: quote,
      origin: (picked.origin as FactOrigin | undefined) ?? "user_stated",
      estimated,
      confidence: (picked.confidence as Confidence | undefined) ?? "medium",
    },
  };
}

const WARNING_TEXT: Record<string, string> = {
  QUOTE_NOT_FOUND: "Một dữ kiện chưa có căn cứ trong lời bạn kể nên chưa được ghi nhận.",
  UNGROUNDED_NUMBER: "Một dữ kiện chứa con số bạn chưa nói nên đã bị bỏ qua.",
  FABRICATION_NUMBERS: "Mình không ghi nhận số liệu chưa có thật. Bạn có thể cho mình con số thực hoặc ước lượng có cơ sở.",
  METRIC_REMOVED: "Một số đo chưa khớp lời bạn kể nên đã được bỏ khỏi dữ kiện.",
  DEFAULT: "Một dữ kiện chưa hợp lệ nên chưa được ghi nhận.",
};

interface AcceptedFact {
  id: string;
  fact: SuggestedFact;
  targetRef: ResolvedRef | null;
  parentRef: ResolvedRef | null;
}

function processFacts(rawFacts: unknown[], fc: FactContext, requestId: string): { accepted: AcceptedFact[]; warnings: ApiWarning[] } {
  const warnings = new Map<string, string>();
  const rejectCounts: Record<string, number> = {};
  const reject = (code: string, detail?: string) => {
    rejectCounts[code] = (rejectCounts[code] ?? 0) + 1;
    warnings.set(WARNING_TEXT[code] ? code : "FACT_REJECTED", WARNING_TEXT[code] ?? WARNING_TEXT.DEFAULT);
    if (detail) log("warn", requestId, "fact_rejected", { code, detail });
  };

  // Lượt 1: kiểm tra độc lập từng dữ kiện, một dữ kiện lỗi không kéo theo dữ kiện khác.
  const stage: AcceptedFact[] = [];
  const seenTemp = new Set<string>();
  for (const raw of rawFacts) {
    const r = validateFact(raw, fc);
    if (!r.ok) {
      reject(r.code, r.detail);
      continue;
    }
    if (seenTemp.has(r.fact.temp_id)) {
      reject("SHAPE_INVALID", "duplicate temp_id");
      continue;
    }
    seenTemp.add(r.fact.temp_id);
    if (r.metricsRemoved > 0) warnings.set("METRIC_REMOVED", WARNING_TEXT.METRIC_REMOVED);
    stage.push({ id: crypto.randomUUID(), fact: r.fact, targetRef: r.targetRef, parentRef: null });
  }

  // Lượt 2: xác định parent (thực thể đã biết hoặc dữ kiện khác trong cùng lượt); lặp tới khi ổn định.
  let accepted = stage;
  for (let i = 0; i < 3; i++) {
    const byTemp = new Map(accepted.map((a) => [a.fact.temp_id, a]));
    const next: AcceptedFact[] = [];
    for (const a of accepted) {
      const pid = a.fact.parent_id;
      if (!pid) {
        next.push(a);
        continue;
      }
      const known = fc.known.get(pid);
      const sibling = byTemp.get(pid);
      if (known) a.parentRef = { kind: known.kind, entity_type: known.entity_type, id: known.id };
      else if (sibling && sibling !== a) a.parentRef = { kind: "pending", entity_type: sibling.fact.entity_type, id: sibling.id };
      else {
        reject("PARENT_NOT_FOUND", `temp:${a.fact.temp_id}`);
        continue;
      }
      next.push(a);
    }
    if (next.length === accepted.length) {
      accepted = next;
      break;
    }
    accepted = next;
  }

  if (Object.keys(rejectCounts).length > 0) log("warn", requestId, "facts_rejected_summary", rejectCounts);
  return { accepted, warnings: [...warnings].map(([code, message]) => ({ code, message })) };
}

// ---------------------------------------------------------------------
// 9. Xử lý một lượt chat
// ---------------------------------------------------------------------
const toPublic = (f: AcceptedFact, policy: PendingFactInsert["commit_policy"], rawId: string): PendingFactInsert => ({
  id: f.id,
  user_id: "",
  session_id: "",
  raw_answer_id: rawId,
  temp_id: f.fact.temp_id,
  intent: f.fact.intent,
  entity_type: f.fact.entity_type,
  target_ref: f.targetRef,
  parent_ref: f.parentRef,
  data: f.fact.data,
  evidence_quote: f.fact.evidence_quote,
  origin: f.fact.origin,
  estimated: f.fact.estimated,
  confidence: f.fact.confidence,
  commit_policy: policy,
});

async function handleChat(req: Request, requestId: string): Promise<ChatResponseBody> {
  const env = readEnv(requestId);
  const { supabase, user } = await authenticate(req, env);
  const body = await parseBody(req);

  // Che số định danh/thẻ trước khi lưu và trước khi gửi ra ngoài (LLM).
  const redaction = redactSensitive(body.message);
  const message = redaction.text;

  await enforceRateLimit(supabase, user.id, requestId);

  // Bước 4a: lưu tin nhắn gốc NGAY (không mất tin nhắn nếu LLM lỗi).
  const raw = await saveRawAnswer(supabase, user.id, body, message, requestId);

  try {
    // Client gửi lại cùng message_id sau khi đã xử lý xong: trả kết quả đã lưu, không gọi LLM lần nữa.
    if (raw.completed) {
      log("info", requestId, "replayed", {});
      return {
        request_id: requestId,
        message_id: body.message_id,
        raw_answer_id: raw.id,
        replayed: true,
        ai_reply: raw.completed.ai_reply,
        categories: raw.completed.categories.filter((c): c is MessageCategory => CATEGORY_SET.has(c)),
        next_question_id: raw.completed.next_question_id,
        new_fact_ids: [],
        pending_facts: await loadSessionPending(supabase, user.id, body.session_id, requestId),
        warnings: [],
      };
    }

    const ctx = await loadContext(supabase, user.id, body, requestId);

    // Bước 1-2: gọi LLM để phân loại + trích xuất + soạn phản hồi.
    const t0 = Date.now();
    const turn = await generateTurn(env, buildSystemPrompt(), buildUserPrompt(ctx.prompt, message), requestId);

    const categories = uniq<MessageCategory>([
      ...turn.categories,
      ...(redaction.redactions > 0 ? (["sensitive_info"] as MessageCategory[]) : []),
      ...(looksLikeFabricationRequest(message) ? (["fabrication_request"] as MessageCategory[]) : []),
    ]);

    // Bước 3: validate dữ kiện (trích dẫn, số liệu, whitelist, JSON Schema).
    const { accepted, warnings } = processFacts(
      turn.facts,
      {
        message,
        numbers: buildNumberIndex([message]),
        known: ctx.known,
        fabrication: categories.includes("fabrication_request"),
      },
      requestId,
    );

    // Chọn câu hỏi tiếp theo: tôn trọng gợi ý của LLM nếu hợp lệ, nếu không thì lấy theo độ ưu tiên.
    const coveredNow = new Set([...ctx.covered, ...turn.covers]);
    const open = openQuestions(coveredNow, 5);
    const nextQuestionId = turn.nextQuestionId && open.some((q) => q.id === turn.nextQuestionId)
      ? turn.nextQuestionId
      : (open[0]?.id ?? null);

    // Bước 8 (rút gọn): 1 câu hỏi, độ dài, không thêm số lạ; sai thì thay bằng câu an toàn do code soạn.
    const replyCheck = checkReply(turn.reply, buildNumberIndex([message, ...ctx.numberTexts]));
    let aiReply = turn.reply;
    if (!replyCheck.ok) {
      log("warn", requestId, "reply_replaced", { reason: replyCheck.reason });
      const q = getQuestion(nextQuestionId);
      aiReply = `Mình đã ghi nhận rồi nhé. ${q ? q.text : "Bạn muốn bổ sung điều gì nữa, hay mình chuyển sang tạo CV luôn?"}`;
      warnings.push({ code: "REPLY_REPLACED", message: "Phản hồi của AI không đạt kiểm tra nên được thay bằng câu chuẩn." });
    }

    // Bước 4b: lưu dữ kiện chờ xác nhận, rồi đánh dấu tin nhắn đã xử lý xong (ai_reply là cờ hoàn tất).
    if (raw.resumed) {
      const { error } = await supabase.from("discovery_pending_facts").delete().eq("raw_answer_id", raw.id).eq("user_id", user.id);
      if (error) dbError(requestId, "pending_facts.cleanup", error);
    }
    if (accepted.length > 0) {
      const rows: PendingFactInsert[] = accepted.map((a) => ({
        ...toPublic(a, classifyCommitPolicy({ origin: a.fact.origin, intent: a.fact.intent, estimated: a.fact.estimated, data: a.fact.data }), raw.id),
        user_id: user.id,
        session_id: body.session_id,
      }));
      const { error } = await supabase.from("discovery_pending_facts").insert(rows);
      if (error) dbError(requestId, "pending_facts.insert", error);
    }
    {
      const { error } = await supabase
        .from("raw_answers")
        .update({ ai_reply: aiReply, categories, covers_question_ids: turn.covers, next_question_id: nextQuestionId })
        .eq("id", raw.id)
        .eq("user_id", user.id);
      if (error) dbError(requestId, "raw_answers.update", error);
    }

    log("info", requestId, "turn_done", {
      ms: Date.now() - t0,
      facts_in: turn.facts.length,
      facts_ok: accepted.length,
      categories,
      redactions: redaction.redactions,
    });

    // Bước 5: trả về lời đáp + danh sách dữ kiện chờ xác nhận.
    return {
      request_id: requestId,
      message_id: body.message_id,
      raw_answer_id: raw.id,
      replayed: false,
      ai_reply: aiReply,
      categories,
      next_question_id: nextQuestionId,
      new_fact_ids: accepted.map((a) => a.id),
      pending_facts: await loadSessionPending(supabase, user.id, body.session_id, requestId),
      warnings,
    };
  } catch (e) {
    // Mọi lỗi sau khi đã lưu tin nhắn: báo cho client biết tin nhắn KHÔNG mất, có thể gửi lại cùng message_id.
    if (e instanceof HttpError) e.extra.raw_answer_id = raw.id;
    throw e;
  }
}

// ---------------------------------------------------------------------
// 10. Entry point
// ---------------------------------------------------------------------
Deno.serve(async (req: Request): Promise<Response> => {
  const requestId = (req.headers.get("x-request-id") ?? "").slice(0, 64) || crypto.randomUUID();
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  try {
    if (req.method !== "POST") {
      throw new HttpError(405, "METHOD_NOT_ALLOWED", "Chỉ hỗ trợ POST.", { headers: { Allow: "POST, OPTIONS" } });
    }
    return json(await handleChat(req, requestId), 200, cors, requestId);
  } catch (err) {
    return errorResponse(err, cors, requestId);
  }
});
