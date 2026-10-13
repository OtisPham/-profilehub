/**
 * PROFILEHUB · Repository
 * Dùng service-role client => MỌI query đều phải lọc theo user_id.
 */
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { ApiError } from "./http.ts";
import { normalizeText } from "./text.ts";
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
} from "./types.ts";

function dbError(where: string, error: { message: string; code?: string }): never {
  console.error(JSON.stringify({ event: "db_error", where, code: error.code, message: error.message }));
  throw new ApiError(500, "DB_ERROR", "Database error");
}

/* ────────────────────────── Sessions ────────────────────────── */

export async function getSession(db: SupabaseClient, sessionId: string, userId: string): Promise<SessionRow> {
  const { data, error } = await db
    .from("career_discovery_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) dbError("getSession", error);
  if (!data) throw new ApiError(404, "SESSION_NOT_FOUND", "Session not found");
  return data as SessionRow;
}

export async function getActiveSession(db: SupabaseClient, userId: string): Promise<SessionRow | null> {
  const { data, error } = await db
    .from("career_discovery_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (error) dbError("getActiveSession", error);
  return (data as SessionRow) ?? null;
}

export async function abandonActiveSession(db: SupabaseClient, userId: string): Promise<void> {
  const { error } = await db
    .from("career_discovery_sessions")
    .update({ status: "abandoned" })
    .eq("user_id", userId)
    .eq("status", "active");
  if (error) dbError("abandonActiveSession", error);
}

export async function createSession(
  db: SupabaseClient,
  userId: string,
  locale: Locale,
  seed: ExtractedData,
  opening: ChatMessage,
  category: DiscoveryCategory,
): Promise<SessionRow> {
  const { data, error } = await db
    .from("career_discovery_sessions")
    .insert({
      user_id: userId,
      locale,
      messages: [opening],
      extracted_data: seed,
      current_category: category,
    })
    .select("*")
    .single();

  if (error) {
    // 23505: đã có session active (race giữa 2 request start) → trả session đó
    if (error.code === "23505") {
      const existing = await getActiveSession(db, userId);
      if (existing) return existing;
    }
    dbError("createSession", error);
  }
  return data as SessionRow;
}

/** Ghi 1 lượt chat với optimistic lock trên `version`. */
export async function saveSessionTurn(
  db: SupabaseClient,
  s: SessionRow,
  patch: {
    messages: ChatMessage[];
    extracted_data: ExtractedData;
    turn_count: number;
    current_category: DiscoveryCategory;
  },
): Promise<void> {
  const { data, error } = await db
    .from("career_discovery_sessions")
    .update({ ...patch, version: s.version + 1, last_message_at: new Date().toISOString() })
    .eq("id", s.id)
    .eq("user_id", s.user_id)
    .eq("version", s.version)
    .eq("status", "active")
    .select("id")
    .maybeSingle();
  if (error) dbError("saveSessionTurn", error);
  if (!data) {
    throw new ApiError(409, "CONCURRENT_UPDATE", "Session was modified by another request. Please retry.");
  }
}

export async function completeSession(db: SupabaseClient, s: SessionRow): Promise<void> {
  const { error } = await db
    .from("career_discovery_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString(), version: s.version + 1 })
    .eq("id", s.id)
    .eq("user_id", s.user_id)
    .eq("status", "active");
  if (error) dbError("completeSession", error);
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

export async function getProfile(db: SupabaseClient, userId: string): Promise<ProfileRow | null> {
  const { data, error } = await db.from("career_profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) dbError("getProfile", error);
  return (data as ProfileRow) ?? null;
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

/** Upsert: chỉ cập nhật các cột được truyền (không ghi đè summary khi cập nhật live). */
export async function upsertProfile(db: SupabaseClient, userId: string, w: ProfileWrite): Promise<void> {
  const row: Record<string, unknown> = { user_id: userId, ...w };
  if (w.career_summary !== undefined) row.summary_generated_at = new Date().toISOString();
  const { error } = await db.from("career_profiles").upsert(row, { onConflict: "user_id" });
  if (error) dbError("upsertProfile", error);
}

/* ────────────────────────── Evidence ────────────────────────── */

export const evidenceDedupeKey = (type: string, title: string) =>
  normalizeText(`${type} ${title}`).slice(0, 200);

export async function upsertEvidence(
  db: SupabaseClient,
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

export async function listEvidence(db: SupabaseClient, userId: string, limit = 50) {
  const { data, error } = await db
    .from("career_evidence")
    .select("id,type,title,source,verification_level,url,achievement_id,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) dbError("listEvidence", error);
  return data ?? [];
}
