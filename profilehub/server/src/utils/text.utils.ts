import crypto from "crypto";
import type { Locale } from "../types/discovery.types.js";

export function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** lowercase, bỏ dấu, bỏ ký tự đặc biệt (giữ chữ, số, %), gộp khoảng trắng. */
export function normalizeText(s: string): string {
  return stripDiacritics(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenSet(s: string): Set<string> {
  return new Set(normalizeText(s).split(" ").filter((w) => w.length > 1));
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Hai chuỗi "cùng ý" (dùng để dedupe). */
export function sameText(a: string, b: string, threshold = 0.7): boolean {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return jaccard(tokenSet(na), tokenSet(nb)) >= threshold;
}

/**
 * Trích các token số (đã chuẩn hoá) từ văn bản.
 * "1.000.000" -> "1000000", "2,5" -> "2.5", "35%" -> "35".
 */
export function numericTokens(s: string): Set<string> {
  const out = new Set<string>();
  const matches = s.match(/\d+(?:[.,]\d+)*/g) ?? [];
  for (const m of matches) {
    let t = m;
    if (/^\d{1,3}([.,]\d{3})+$/.test(t)) t = t.replace(/[.,]/g, "");
    else t = t.replace(",", ".");
    out.add(t.replace(/^0+(?=\d)/, ""));
  }
  return out;
}

/** Chuỗi bị coi là "lưu nguyên văn" tin nhắn của user. */
export function isVerbatim(field: string, message: string): boolean {
  const f = normalizeText(field);
  const m = normalizeText(message);
  if (f.length < 30 || m.length === 0) return false;
  if (m.includes(f)) return f.length >= 0.6 * m.length || f.length >= 60;
  return jaccard(tokenSet(f), tokenSet(m)) > 0.85 && f.length > 0.7 * m.length;
}

export function clamp(s: string | null | undefined, max: number): string | null {
  if (s === null || s === undefined) return null;
  const t = s.replace(/\s+/g, " ").trim();
  if (!t) return null;
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}

export function unionCI(a: string[], b: string[], max = 50): string[] {
  const seen = new Map<string, string>();
  for (const x of [...a, ...b]) {
    const v = x.trim();
    if (!v) continue;
    const k = normalizeText(v);
    if (k && !seen.has(k)) seen.set(k, v);
  }
  return [...seen.values()].slice(0, max);
}

export function shortId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

/** Chọn chuỗi theo locale. */
export function t(locale: Locale, vi: string, en: string): string {
  return locale === "en" ? en : vi;
}

/** Loại ký tự điều khiển + vô hiệu hoá thẻ dùng để bọc dữ liệu không tin cậy. */
export function sanitizeUserText(s: string): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<\/?\s*user_message\s*>/gi, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}
