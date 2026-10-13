import { Request, Response } from "express";
import crypto from "crypto";
import { supabase } from "../config/supabase.js";
import { anthropic } from "../services/llm.service.js";

import {
  FinishRequestSchema,
  MAX_SESSION_TURNS,
  MessageRequestSchema,
  MIN_MESSAGE_INTERVAL_MS,
  parseBody,
  StartRequestSchema,
} from "../services/validation.service.js";
import { generateReply, openingMessage } from "../services/agent.service.js";
import { mergeExtraction, runExtraction } from "../services/extraction.service.js";
import { applyIntent, applyPlan, canFinish, categoryCoverage, planNextTurn } from "../services/planner.service.js";
import { computeEmployability, computeStrengths } from "../services/scoring.service.js";
import { buildCareerDna, generateCareerDna } from "../services/career-dna.service.js";
import { generateCareerSummary } from "../services/summary.service.js";
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
} from "../services/discovery-repo.service.js";
import { sanitizeUserText } from "../utils/text.utils.js";
import { ApiError, log } from "../utils/http.utils.js";
import type { ChatMessage, ExtractedData, Locale, TurnPlan } from "../types/discovery.types.js";

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

async function toProfileDto(userId: string, row: NonNullable<Awaited<ReturnType<typeof getProfile>>>) {
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
    achievements: data.achievements.map((item: any) => {
      const { probes: _p, ...rest } = item;
      return rest;
    }),
    evidence: await listEvidence(undefined, userId),
    updated_at: row.updated_at,
  };
}

export const discoveryController = {
  /**
   * POST /api/v1/discovery/start
   */
  async start(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req.body?.user_id as string) || "00000000-0000-0000-0000-000000000000";
      const body = parseBody(StartRequestSchema, req.body);

      let session = await getActiveSession(undefined, userId);
      let resumed = false;

      if (session && body.force_new) {
        await abandonActiveSession(undefined, userId);
        session = null;
      }

      if (session) {
        resumed = true;
      } else {
        const locale: Locale = body.locale ?? "vi";
        const profile = await getProfile(undefined, userId);
        const seed = parseExtractedData(profile?.profile_data ?? {});
        seed.category_turns = {};
        seed.last_plan = null;

        const plan = planNextTurn(seed, 0, "answering");
        const opening = msg("assistant", openingMessage(locale, seed, seed.achievements.length ? plan : null), 0, {
          plan_category: plan.category,
        });
        session = await createSession(undefined, userId, locale, seed, opening, plan.category);
      }

      const last = [...session.messages].reverse().find((m) => m.role === "assistant");
      res.json({
        success: true,
        data: {
          session_id: session.id,
          resumed,
          turn_count: session.turn_count,
          opening_message: last?.content ?? null,
        },
      });
    } catch (err: any) {
      console.error("Error in discoveryController.start:", err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to start discovery session",
        code: err.code || "DISCOVERY_START_ERROR",
      });
    }
  },

  /**
   * POST /api/v1/discovery/message
   */
  async message(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req.body?.user_id as string) || "00000000-0000-0000-0000-000000000000";
      const requestId = crypto.randomUUID();
      const parsed = parseBody(MessageRequestSchema, req.body);
      const session_id = parsed.session_id;
      const rawInput = parsed.message || parsed.text || "";
      const text = sanitizeUserText(rawInput);
      if (!text) {
        res.status(400).json({ success: false, message: "Message is empty" });
        return;
      }

      const session = await getSession(undefined, session_id, userId);

      if (session.status !== "active") {
        res.status(409).json({ success: false, message: `Session is ${session.status}`, code: "SESSION_NOT_ACTIVE" });
        return;
      }
      if (session.turn_count >= MAX_SESSION_TURNS) {
        res.status(409).json({ success: false, message: "Đã đạt giới hạn số lượt. Hãy hoàn tất để tạo Career Profile.", code: "SESSION_TURN_LIMIT" });
        return;
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
      if (issues.length) log(requestId, "extraction_issues", { codes: issues.map((i: any) => i.code) });

      /* 2. MERGE -> PLAN */
      let data = applyIntent(prevData, extraction.user_intent);
      const merged = mergeExtraction(data, extraction, turn);
      data = merged.data;

      const plan: TurnPlan = planNextTurn(data, turn, extraction.user_intent);
      data = applyPlan(data, plan);

      /* 3. REPLY */
      const reply = await generateReply({ llm: anthropic, data, plan, history, userMessage: text, locale, turn });

      /* 4. PERSIST */
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
      await saveSessionTurn(undefined, session, {
        messages,
        extracted_data: data,
        turn_count: turn,
        current_category: plan.category,
      });

      /* 5. LIVE PROFILE */
      const live = liveProfile(data, locale);
      try {
        await upsertProfile(undefined, userId, {
          strengths: live.strengths,
          career_dna: live.dna,
          employability_score: live.score,
          score_breakdown: live.breakdown,
          profile_data: data,
          coverage: live.coverage,
          last_session_id: session.id,
        });
        await upsertEvidence(undefined, userId, session.id, merged.changes.evidence);
      } catch (e) {
        log(requestId, "live_profile_sync_failed", { error: String(e) });
      }

      const c = merged.changes;
      res.json({
        success: true,
        data: {
          reply: reply.text,
          extracted_data: {
            user_intent: extraction.user_intent,
            achievements: c.achievements.map((a: any) => ({
              id: a.id,
              achievement: a.title,
              metric: a.metric?.raw ?? null,
              metric_verified: a.metric_verified,
              impact_type: a.impact_type,
              timeframe: a.timeframe,
              result: a.result,
            })),
            task_claims: c.task_claims.map((f: any) => ({ id: f.id, summary: f.subject })),
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
        },
      });
    } catch (err: any) {
      console.error("Error in discoveryController.message:", err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to process interview message",
        code: err.code || "DISCOVERY_MESSAGE_ERROR",
      });
    }
  },

  /**
   * POST /api/v1/discovery/finish
   */
  async finish(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req.body?.user_id as string) || "00000000-0000-0000-0000-000000000000";
      const requestId = crypto.randomUUID();
      const { session_id } = parseBody(FinishRequestSchema, req.body);
      const session = await getSession(undefined, session_id, userId);

      if (session.status === "completed") {
        const existing = await getProfile(undefined, userId);
        if (existing) {
          res.json({
            success: true,
            data: {
              career_profile: await toProfileDto(userId, existing),
              career_summary: existing.career_summary,
            },
          });
          return;
        }
      }
      if (session.status === "abandoned") {
        res.status(409).json({ success: false, message: "Session was abandoned", code: "SESSION_NOT_ACTIVE" });
        return;
      }

      const data = parseExtractedData(session.extracted_data);
      const locale = session.locale;
      const { score, breakdown } = computeEmployability(data);

      const [summary, dna] = await Promise.all([
        generateCareerSummary(anthropic, data, locale),
        generateCareerDna(anthropic, data, locale),
      ]);
      log(requestId, "finish_generated", { summary_source: summary.source, dna: dna.primary });

      await upsertProfile(undefined, userId, {
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
      await upsertEvidence(undefined, userId, session.id, data.evidence);

      // Đồng bộ trực tiếp bio vào student_profiles để CV Builder và trang cá nhân nhận ngay
      try {
        await supabase.from("student_profiles").update({
          bio: summary.career_summary,
          ...(data.career_context?.skills?.length ? { skills: data.career_context.skills } : {}),
        }).eq("id", userId);
      } catch (syncErr) {
        console.warn("Could not sync to student_profiles:", syncErr);
      }

      if (session.status === "active") await completeSession(undefined, session);

      const profile = await getProfile(undefined, userId);
      if (!profile) {
        res.status(500).json({ success: false, message: "Profile not found after save", code: "DB_ERROR" });
        return;
      }

      res.json({
        success: true,
        data: {
          career_profile: await toProfileDto(userId, profile),
          career_summary: summary.career_summary,
        },
      });
    } catch (err: any) {
      console.error("Error in discoveryController.finish:", err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to finish discovery session",
        code: err.code || "DISCOVERY_FINISH_ERROR",
      });
    }
  },

  /**
   * GET /api/v1/discovery/profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req.query?.user_id as string) || "00000000-0000-0000-0000-000000000000";
      const row = await getProfile(undefined, userId);
      if (!row) {
        res.json({ success: true, data: { profile: null } });
        return;
      }
      res.json({ success: true, data: { profile: await toProfileDto(userId, row) } });
    } catch (err: any) {
      console.error("Error in discoveryController.getProfile:", err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to get career profile",
        code: err.code || "PROFILE_GET_ERROR",
      });
    }
  },
};
