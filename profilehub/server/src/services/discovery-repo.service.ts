import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/http.utils.js";
import { normalizeText } from "../utils/text.utils.js";
import {
  type ChatMessage,
  type CareerDna,
  type DiscoveryCategory,
  type EvidenceItem,
  type ExtractedData,
  ExtractedDataSchema,
  type Locale,
  type ProfileStrength,
  type ScoreBreakdownItem,
  type SessionRow,
} from "../types/discovery.types.js";

const memorySessions = new Map<string, SessionRow>();
const memoryProfiles = new Map<string, ProfileRow>();
const memoryEvidence = new Map<string, EvidenceItem[]>();

function dbError(where: string, error: { message: string; code?: string }): void {
  console.warn(JSON.stringify({ event: "db_error", where, code: error.code, message: error.message }));
}

/* ────────────────────────── Sessions ────────────────────────── */

export async function getSession(db: SupabaseClient = supabase, sessionId: string, userId: string): Promise<SessionRow> {
  try {
    const { data, error } = await db
      .from("career_discovery_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) dbError("getSession", error);
    if (data) return data as SessionRow;
  } catch (err: any) {
    dbError("getSession catch", err);
  }

  const mem = memorySessions.get(`${userId}:${sessionId}`) || memorySessions.get(sessionId);
  if (!mem) throw new ApiError(404, "SESSION_NOT_FOUND", "Session not found");
  return mem;
}

export async function getActiveSession(db: SupabaseClient = supabase, userId: string): Promise<SessionRow | null> {
  try {
    const { data, error } = await db
      .from("career_discovery_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (error) dbError("getActiveSession", error);
    if (data) return data as SessionRow;
  } catch (err: any) {
    dbError("getActiveSession catch", err);
  }

  for (const session of memorySessions.values()) {
    if (session.user_id === userId && session.status === "active") {
      return session;
    }
  }
  return null;
}

export async function abandonActiveSession(db: SupabaseClient = supabase, userId: string): Promise<void> {
  try {
    const { error } = await db
      .from("career_discovery_sessions")
      .update({ status: "abandoned" })
      .eq("user_id", userId)
      .eq("status", "active");
    if (error) dbError("abandonActiveSession", error);
  } catch (err: any) {
    dbError("abandonActiveSession catch", err);
  }

  for (const [key, session] of memorySessions.entries()) {
    if (session.user_id === userId && session.status === "active") {
      memorySessions.set(key, { ...session, status: "abandoned", updated_at: new Date().toISOString() });
    }
  }
}

export async function createSession(
  db: SupabaseClient = supabase,
  userId: string,
  locale: Locale,
  seed: ExtractedData,
  opening: ChatMessage,
  category: DiscoveryCategory,
): Promise<SessionRow> {
  try {
    const { data, error } = await db
      .from("career_discovery_sessions")
      .insert({
        user_id: userId,
        locale,
        messages: [opening],
        extracted_data: seed,
      })
      .select("*")
      .single();

    if (!error && data) {
      return { ...data, current_category: category } as SessionRow;
    }
    if (error) {
      if (error.code === "23505") {
        const existing = await getActiveSession(db, userId);
        if (existing) return existing;
      }
      dbError("createSession", error);
    }
  } catch (err: any) {
    dbError("createSession catch", err);
  }

  // Resilient memory session creation
  const sessionId = crypto.randomUUID();
  const now = new Date().toISOString();
  const sessionRow: SessionRow = {
    id: sessionId,
    user_id: userId,
    status: "active",
    locale,
    messages: [opening],
    extracted_data: seed,
    current_category: category,
    turn_count: 0,
    version: 0,
    started_at: now,
    last_message_at: now,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };

  memorySessions.set(`${userId}:${sessionId}`, sessionRow);
  memorySessions.set(sessionId, sessionRow);
  return sessionRow;
}

/** Ghi 1 lượt chat với optimistic lock trên `version`. */
export async function saveSessionTurn(
  db: SupabaseClient = supabase,
  s: SessionRow,
  patch: {
    messages: ChatMessage[];
    extracted_data: ExtractedData;
    turn_count: number;
    current_category: DiscoveryCategory;
  },
): Promise<void> {
  const updatedVersion = s.version + 1;
  const now = new Date().toISOString();

  try {
    const { data, error } = await db
      .from("career_discovery_sessions")
      .update({
        messages: patch.messages,
        extracted_data: patch.extracted_data,
        turn_count: patch.turn_count,
        version: updatedVersion,
        last_message_at: now,
      })
      .eq("id", s.id)
      .eq("user_id", s.user_id)
      .eq("status", "active")
      .select("id")
      .maybeSingle();
    if (error) dbError("saveSessionTurn", error);
    if (data) return;
  } catch (err: any) {
    dbError("saveSessionTurn catch", err);
  }

  // In-memory update
  const updated: SessionRow = {
    ...s,
    ...patch,
    version: updatedVersion,
    last_message_at: now,
    updated_at: now,
  };
  memorySessions.set(`${s.user_id}:${s.id}`, updated);
  memorySessions.set(s.id, updated);
}

export async function completeSession(db: SupabaseClient = supabase, s: SessionRow): Promise<void> {
  const now = new Date().toISOString();
  try {
    const { error } = await db
      .from("career_discovery_sessions")
      .update({ status: "completed", completed_at: now, version: s.version + 1 })
      .eq("id", s.id)
      .eq("user_id", s.user_id)
      .eq("status", "active");
    if (error) dbError("completeSession", error);
  } catch (err: any) {
    dbError("completeSession catch", err);
  }

  const updated: SessionRow = {
    ...s,
    status: "completed",
    completed_at: now,
    version: s.version + 1,
    updated_at: now,
  };
  memorySessions.set(`${s.user_id}:${s.id}`, updated);
  memorySessions.set(s.id, updated);
}

/* ────────────────────────── Profiles ────────────────────────── */

export interface ProfileRow {
  user_id: string;
  headline: string | null;
  career_summary: string | null;
  strengths: ProfileStrength[];
  career_dna: CareerDna | Record<string, never>;
  employability_score: number;
  score_breakdown: ScoreBreakdownItem[];
  profile_data: unknown;
  coverage: Record<string, number>;
  updated_at: string;
}

export async function getProfile(db: SupabaseClient = supabase, userId: string): Promise<ProfileRow | null> {
  try {
    const { data, error } = await db.from("career_profiles").select("*").eq("user_id", userId).maybeSingle();
    if (error) dbError("getProfile", error);
    if (data) return data as ProfileRow;
  } catch (err: any) {
    dbError("getProfile catch", err);
  }
  return memoryProfiles.get(userId) ?? null;
}

export function parseExtractedData(raw: unknown): ExtractedData {
  const r = ExtractedDataSchema.safeParse(raw ?? {});
  if (!r.success) {
    console.error(JSON.stringify({ event: "extracted_data_corrupt", issues: r.error.issues.slice(0, 3) }));
    throw new ApiError(500, "CORRUPT_STATE", "Stored discovery data is invalid");
  }
  return r.data;
}

export interface ProfileWrite {
  strengths: ProfileStrength[];
  career_dna: CareerDna;
  employability_score: number;
  score_breakdown: ScoreBreakdownItem[];
  profile_data: ExtractedData;
  coverage: Record<string, number>;
  last_session_id: string;
  headline?: string | null;
  career_summary?: string | null;
}

export async function upsertProfile(db: SupabaseClient = supabase, userId: string, w: ProfileWrite): Promise<void> {
  const now = new Date().toISOString();

  // Always keep in memory
  const memRow: ProfileRow = {
    user_id: userId,
    headline: w.headline ?? null,
    career_summary: w.career_summary ?? null,
    strengths: w.strengths,
    career_dna: w.career_dna,
    employability_score: w.employability_score,
    score_breakdown: w.score_breakdown,
    profile_data: w.profile_data,
    coverage: w.coverage,
    updated_at: now,
  };
  memoryProfiles.set(userId, memRow);

  const dbRow: Record<string, unknown> = {
    user_id: userId,
    headline: w.headline ?? null,
    career_summary: w.career_summary ?? null,
    strengths: w.strengths,
    career_dna: w.career_dna,
    employability_score: w.employability_score,
    score_breakdown: w.score_breakdown,
    profile_data: w.profile_data,
    last_session_id: w.last_session_id,
  };
  if (w.career_summary !== undefined) dbRow.summary_generated_at = now;

  try {
    const { error } = await db.from("career_profiles").upsert(dbRow, { onConflict: "user_id" });
    if (error) dbError("upsertProfile", error);
  } catch (err: any) {
    dbError("upsertProfile catch", err);
  }
}

/* ────────────────────────── Evidence ────────────────────────── */

export const evidenceDedupeKey = (type: string, title: string) =>
  normalizeText(`${type} ${title}`).slice(0, 200);

export async function upsertEvidence(
  db: SupabaseClient = supabase,
  userId: string,
  sessionId: string,
  items: EvidenceItem[],
): Promise<void> {
  if (items.length === 0) return;
  const rows = items.map((e) => ({
    user_id: userId,
    session_id: sessionId,
    type: e.type,
    title: e.title,
    source: e.source,
    verification_level: e.verification_level,
    url: e.url,
    achievement_id: e.achievement_id,
    dedupe_key: evidenceDedupeKey(e.type, e.title),
  }));
  const { error } = await db
    .from("career_evidence")
    .upsert(rows, { onConflict: "user_id,dedupe_key", ignoreDuplicates: true });
  if (error) dbError("upsertEvidence", error);
}

export async function listEvidence(db: SupabaseClient = supabase, userId: string, limit = 50) {
  const { data, error } = await db
    .from("career_evidence")
    .select("id,type,title,source,verification_level,url,achievement_id,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) dbError("listEvidence", error);
  return data ?? [];
}
