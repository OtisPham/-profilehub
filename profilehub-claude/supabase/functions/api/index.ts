/**
 * PROFILEHUB · Career Discovery API (Supabase Edge Function `api`)
 *
 *   POST /api/discovery/start
 *   POST /api/discovery/message
 *   POST /api/discovery/finish
 *   GET  /api/profile
 *
 * URL thực tế: https://<project>.supabase.co/functions/v1/api/discovery/start ...
 */
import { adminClient, ApiError, authenticate, corsHeaders, errorResponse, json, log, readJson } from "../_shared/http.ts";
import { anthropic } from "../_shared/llm.ts";
import {
  FinishRequestSchema,
  MAX_SESSION_TURNS,
  MessageRequestSchema,
  MIN_MESSAGE_INTERVAL_MS,
  parseBody,
  StartRequestSchema,
} from "../_shared/validation.ts";
import { generateReply, openingMessage } from "../_shared/agent.ts";
import { mergeExtraction, runExtraction } from "../_shared/extraction.ts";
import { applyIntent, applyPlan, canFinish, categoryCoverage, planNextTurn } from "../_shared/planner.ts";
import { computeEmployability, computeStrengths } from "../_shared/scoring.ts";
import { buildCareerDna, generateCareerDna } from "../_shared/career-dna.ts";
import { generateCareerSummary } from "../_shared/summary.ts";
import {
  abandonActiveSession,
  completeSession,
  createSession,
  getActiveSession,
  getProfile,
  getSession,
  listEvidence,
  parseExtractedData,
  saveSessionTurn,
  upsertEvidence,
  upsertProfile,
} from "../_shared/repo.ts";
import { sanitizeUserText } from "../_shared/text.ts";
import type { ChatMessage, ExtractedData, Locale, TurnPlan } from "../_shared/types.ts";

/* ────────────────────────── Router ────────────────────────── */

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const requestId = crypto.randomUUID();
  const started = Date.now();
  try {
    const path = new URL(req.url).pathname;
    const i = path.indexOf("/api/");
    const route = `${req.method} ${(i >= 0 ? path.slice(i) : path).replace(/\/+$/, "")}`;

    const handlers: Record<string, (req: Request, userId: string, rid: string) => Promise<Response>> = {
      "POST /api/discovery/start": handleStart,
      "POST /api/discovery/message": handleMessage,
      "POST /api/discovery/finish": handleFinish,
      "GET /api/profile": handleGetProfile,
    };
    const handler = handlers[route];
    if (!handler) throw new ApiError(404, "NOT_FOUND", `No route for ${route}`);

    const user = await authenticate(req);
    const res = await handler(req, user.id, requestId);
    log(requestId, "request_done", { route, status: res.status, ms: Date.now() - started });
    return res;
  } catch (e) {
    return errorResponse(e, requestId);
  }
});

/* ────────────────────────── Helpers ────────────────────────── */

const msg = (role: ChatMessage["role"], content: string, turn: number, meta?: Record<string, unknown>): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  turn,
  created_at: new Date().toISOString(),
  ...(meta ? { meta } : {}),
});

function liveProfile(data: ExtractedData, locale: Locale) {
  const { score, breakdown } = computeEmployability(data);
  return {
    score,
    breakdown,
    strengths: computeStrengths(data, locale),
    dna: buildCareerDna(data),
    coverage: categoryCoverage(data),
  };
}

/* ────────────────────────── POST /api/discovery/start ────────────────────────── */

async function handleStart(req: Request, userId: string): Promise<Response> {
  const body = parseBody(StartRequestSchema, await readJson(req, true));
  const db = adminClient();

  let session = await getActiveSession(db, userId);
  let resumed = false;

  if (session && body.force_new) {
    await abandonActiveSession(db, userId);
    session = null;
  }

  if (session) {
    resumed = true;
  } else {
    const locale: Locale = body.locale ?? "vi";
    // Seed từ profile hiện có → không hỏi lại những gì đã biết
    const profile = await getProfile(db, userId);
    const seed = parseExtractedData(profile?.profile_data ?? {});
    seed.category_turns = {};
    seed.last_plan = null;

    const plan = planNextTurn(seed, 0, "answering");
    const opening = msg("assistant", openingMessage(locale, seed, seed.achievements.length ? plan : null), 0, {
      plan_category: plan.category,
    });
    session = await createSession(db, userId, locale, seed, opening, plan.category);
  }

  const last = [...session.messages].reverse().find((m) => m.role === "assistant");
  return json({
    session_id: session.id,
    resumed,
    turn_count: session.turn_count,
    opening_message: last?.content ?? null,
  });
}

/* ────────────────────────── POST /api/discovery/message ────────────────────────── */

async function handleMessage(req: Request, userId: string, requestId: string): Promise<Response> {
  const { session_id, message } = parseBody(MessageRequestSchema, await readJson(req));
  const text = sanitizeUserText(message);
  if (!text) throw new ApiError(400, "VALIDATION_ERROR", "Message is empty");

  const db = adminClient();
  const session = await getSession(db, session_id, userId);

  if (session.status !== "active") {
    throw new ApiError(409, "SESSION_NOT_ACTIVE", `Session is ${session.status}`);
  }
  if (session.turn_count >= MAX_SESSION_TURNS) {
    throw new ApiError(409, "SESSION_TURN_LIMIT", "Đã đạt giới hạn số lượt. Hãy hoàn tất để tạo Career Profile.");
  }
  if (Date.now() - Date.parse(session.last_message_at) < MIN_MESSAGE_INTERVAL_MS) {
    throw new ApiError(429, "TOO_MANY_REQUESTS", "Vui lòng chờ một chút trước khi gửi tiếp.");
  }

  const locale = session.locale;
  const turn = session.turn_count + 1;
  const history = session.messages;
  const prevData = parseExtractedData(session.extracted_data);
  const prevScore = computeEmployability(prevData).score;

  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant")?.content ?? null;
  const prevUser = [...history].reverse().find((m) => m.role === "user")?.content ?? null;

  /* 1. EXTRACT + VALIDATE */
  const { extraction, issues } = await runExtraction({
    llm: anthropic,
    data: prevData,
    userMessage: text,
    prevUserMessage: prevUser,
    lastAssistantMessage: lastAssistant,
  });
  if (issues.length) log(requestId, "extraction_issues", { codes: issues.map((i) => i.code) });

  /* 2. MERGE → PLAN */
  let data = applyIntent(prevData, extraction.user_intent);
  const merged = mergeExtraction(data, extraction, turn);
  data = merged.data;

  const plan: TurnPlan = planNextTurn(data, turn, extraction.user_intent);
  data = applyPlan(data, plan);

  /* 3. REPLY (fallback tất định nếu LLM lỗi) */
  const reply = await generateReply({ llm: anthropic, data, plan, history, userMessage: text, locale, turn });

  /* 4. PERSIST (session trước: optimistic lock) */
  const messages = [
    ...history,
    msg("user", text, turn),
    msg("assistant", reply.text, turn, {
      plan_mode: plan.mode,
      plan_category: plan.category,
      clarify: plan.clarify,
      fallback: reply.usedFallback,
    }),
  ];
  await saveSessionTurn(db, session, {
    messages,
    extracted_data: data,
    turn_count: turn,
    current_category: plan.category,
  });

  /* 5. LIVE PROFILE */
  const live = liveProfile(data, locale);
  try {
    await upsertProfile(db, userId, {
      strengths: live.strengths,
      career_dna: live.dna,
      employability_score: live.score,
      score_breakdown: live.breakdown,
      profile_data: data,
      coverage: live.coverage,
      last_session_id: session.id,
    });
    await upsertEvidence(db, userId, session.id, merged.changes.evidence);
  } catch (e) {
    // Session đã lưu; profile sẽ được đồng bộ ở lượt sau hoặc khi finish.
    log(requestId, "live_profile_sync_failed", { error: String(e) });
  }

  const c = merged.changes;
  return json({
    reply: reply.text,
    extracted_data: {
      user_intent: extraction.user_intent,
      achievements: c.achievements.map((a) => ({
        id: a.id,
        achievement: a.title,
        metric: a.metric?.raw ?? null,
        metric_verified: a.metric_verified,
        impact_type: a.impact_type,
        timeframe: a.timeframe,
        result: a.result,
      })),
      task_claims: c.task_claims.map((f) => ({ id: f.id, summary: f.subject })),
      evidence: c.evidence,
      problem_solving: c.problem_solving,
      leadership: c.leadership,
      learning: c.learning,
      context_fields: c.context_fields,
      goal_fields: c.goal_fields,
    },
    profile_updates: {
      employability_score: live.score,
      score_delta: live.score - prevScore,
      score_breakdown: live.breakdown,
      strengths: live.strengths,
      career_dna: live.dna,
      coverage: live.coverage,
      next: {
        category: plan.category,
        mode: plan.mode,
        can_finish: plan.can_finish,
        ready_to_finish: plan.ready_to_finish,
      },
    },
  });
}

/* ────────────────────────── POST /api/discovery/finish ────────────────────────── */

async function handleFinish(req: Request, userId: string, requestId: string): Promise<Response> {
  const { session_id } = parseBody(FinishRequestSchema, await readJson(req));
  const db = adminClient();
  const session = await getSession(db, session_id, userId);

  // Idempotent: đã hoàn tất → trả profile hiện có
  if (session.status === "completed") {
    const existing = await getProfile(db, userId);
    if (existing) {
      return json({ career_profile: await toProfileDto(db, userId, existing), career_summary: existing.career_summary });
    }
  }
  if (session.status === "abandoned") throw new ApiError(409, "SESSION_NOT_ACTIVE", "Session was abandoned");

  const data = parseExtractedData(session.extracted_data);
  if (!canFinish(data)) {
    throw new ApiError(422, "INSUFFICIENT_DATA", "Cần thêm thông tin trước khi tạo Career Profile.", {
      need: [
        "Bối cảnh nghề nghiệp (vai trò hoặc ngành)",
        "Ít nhất 1 thành tựu có kết quả hoặc con số",
      ],
    });
  }

  const locale = session.locale;
  const { score, breakdown } = computeEmployability(data);

  const [summary, dna] = await Promise.all([
    generateCareerSummary(anthropic, data, locale),
    generateCareerDna(anthropic, data, locale),
  ]);
  log(requestId, "finish_generated", { summary_source: summary.source, dna: dna.primary });

  await upsertProfile(db, userId, {
    headline: summary.headline,
    career_summary: summary.career_summary,
    strengths: summary.strengths,
    career_dna: dna,
    employability_score: score,
    score_breakdown: breakdown,
    profile_data: data,
    coverage: categoryCoverage(data),
    last_session_id: session.id,
  });
  await upsertEvidence(db, userId, session.id, data.evidence);
  if (session.status === "active") await completeSession(db, session);

  const profile = await getProfile(db, userId);
  if (!profile) throw new ApiError(500, "DB_ERROR", "Profile not found after save");
  return json({
    career_profile: await toProfileDto(db, userId, profile),
    career_summary: summary.career_summary,
  });
}

/* ────────────────────────── GET /api/profile ────────────────────────── */

async function handleGetProfile(_req: Request, userId: string): Promise<Response> {
  const db = adminClient();
  const row = await getProfile(db, userId);
  if (!row) return json({ profile: null });
  return json({ profile: await toProfileDto(db, userId, row) });
}

async function toProfileDto(db: ReturnType<typeof adminClient>, userId: string, row: NonNullable<Awaited<ReturnType<typeof getProfile>>>) {
  const data = parseExtractedData(row.profile_data);
  return {
    user_id: userId,
    headline: row.headline,
    career_summary: row.career_summary,
    strengths: row.strengths,
    career_dna: row.career_dna,
    employability_score: row.employability_score,
    score_breakdown: row.score_breakdown,
    coverage: row.coverage,
    career_context: data.career_context,
    career_goal: data.career_goal,
    achievements: data.achievements.map(({ probes: _p, ...a }) => a),
    evidence: await listEvidence(db, userId),
    updated_at: row.updated_at,
  };
}
