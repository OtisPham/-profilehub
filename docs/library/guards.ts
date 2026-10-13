// =====================================================================
// guards.ts - Các hàm THUẦN (không phụ thuộc Deno/Supabase) để chặn bịa số,
// che dữ liệu nhạy cảm, kiểm tra trích dẫn và phản hồi của AI.
// Tách riêng để kiểm thử độc lập.
// =====================================================================
import type { CommitPolicy, FactIntent, FactOrigin } from "../_shared/types/discovery.ts";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

/** Chuẩn hoá để so khớp chuỗi: NFC, gộp khoảng trắng, chữ thường. */
export function normalizeForMatch(s: string): string {
  return s.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
}

// ---------------------------------------------------------------------
// 1. Che dữ liệu nhạy cảm TRƯỚC KHI gửi cho LLM và trước khi lưu raw_answers
//    (US-1.16: không lưu số định danh ở dạng rõ).
// ---------------------------------------------------------------------
function luhnValid(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const ID_KEYWORDS =
  "(?:cmnd|cmt|cccd|căn cước(?: công dân)?|chứng minh(?: nhân dân| thư)?|hộ chiếu|passport|mã số thuế|mst)";

export function redactSensitive(input: string): { text: string; redactions: number } {
  let count = 0;
  let text = input;

  // Số thẻ (13-19 chữ số, có thể có dấu cách/gạch) - chỉ che khi qua Luhn để tránh nhầm số tiền.
  text = text.replace(/(?<!\d)(?:\d[ -]?){13,19}(?!\d)/g, (m) => {
    const digits = m.replace(/\D/g, "");
    if (digits.length >= 13 && digits.length <= 19 && luhnValid(digits)) {
      count++;
      return "[SỐ THẺ ĐÃ ẨN]";
    }
    return m;
  });

  // CMND (9 số) / CCCD (12 số) đi kèm từ khoá.
  const keywordId = new RegExp(`(${ID_KEYWORDS}\\D{0,20}?)((?:\\d[ .-]?){9,12})(?!\\d)`, "giu");
  text = text.replace(keywordId, (m, prefix: string, num: string) => {
    const len = num.replace(/\D/g, "").length;
    if (len === 9 || len === 12) {
      count++;
      return `${prefix}[SỐ ĐỊNH DANH ĐÃ ẨN]`;
    }
    return m;
  });

  // Chuỗi đúng 12 chữ số đứng riêng (dạng CCCD).
  text = text.replace(/(?<!\d)\d{12}(?!\d)/g, () => {
    count++;
    return "[SỐ ĐỊNH DANH ĐÃ ẨN]";
  });

  return { text, redactions: count };
}

// ---------------------------------------------------------------------
// 2. Đối chiếu con số ("không tự bịa số liệu")
//    Mọi con số trong dữ kiện phải xuất hiện trong tin nhắn của người dùng.
// ---------------------------------------------------------------------
function parseNumberToken(t: string): number[] {
  if (/^\d+$/.test(t)) return [Number(t)];
  const parts = t.split(/[.,]/);
  const thousands = /^\d{1,3}([.,]\d{3})+$/.test(t); // 1.500 / 1,500,000
  const out = new Set<number>();
  if (thousands) out.add(Number(t.replace(/[.,]/g, "")));
  if (parts.length === 2) out.add(Number(`${parts[0]}.${parts[1]}`)); // 3.6 / 1.500 (thập phân)
  if (!thousands && parts.length > 2) for (const p of parts) out.add(Number(p)); // 10.5.2023
  return [...out];
}

function suffixMultiplier(after: string): number {
  if (/^\s*(?:k|nghìn|ngàn)(?![\p{L}])/iu.test(after)) return 1e3;
  if (/^\s*(?:tr|triệu)(?![\p{L}])/iu.test(after)) return 1e6;
  if (/^\s*(?:tỷ|tỉ|ty)(?![\p{L}])/iu.test(after)) return 1e9;
  return 1;
}

/** Mỗi con số trong văn bản -> danh sách giá trị chấp nhận được (vd "5tr" -> [5, 5000000]). */
export function numberTokens(text: string): number[][] {
  const tokens: number[][] = [];
  const re = /\d+(?:[.,]\d+)*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const token = m[0];
    const candidates = new Set<number>(parseNumberToken(token));
    const mult = suffixMultiplier(text.slice(m.index + token.length, m.index + token.length + 12));
    if (mult !== 1) for (const v of [...candidates]) candidates.add(v * mult);
    tokens.push([...candidates]);
  }
  return tokens;
}

export interface NumberIndex {
  has(n: number): boolean;
}

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

export function buildNumberIndex(texts: readonly string[]): NumberIndex {
  const set = new Set<number>();
  for (const t of texts) for (const cands of numberTokens(t)) for (const c of cands) set.add(r6(c));
  return { has: (n: number) => set.has(r6(n)) };
}

function forEachNumber(
  value: unknown,
  skipRootKeys: readonly string[],
  cb: (candidates: number[]) => void,
): void {
  const walk = (v: unknown, depth: number) => {
    if (typeof v === "number") {
      if (Number.isFinite(v)) cb([v]);
    } else if (typeof v === "string") {
      for (const c of numberTokens(v)) cb(c);
    } else if (Array.isArray(v)) {
      for (const x of v) walk(x, depth + 1);
    } else if (isRecord(v)) {
      for (const [k, x] of Object.entries(v)) {
        if (depth === 0 && skipRootKeys.includes(k)) continue;
        walk(x, depth + 1);
      }
    }
  };
  walk(value, 0);
}

/** Các con số trong `value` KHÔNG có trong tin nhắn gốc. `skipRootKeys`: khoá gốc bỏ qua (vd "period"). */
export function findUngroundedNumbers(
  value: unknown,
  index: NumberIndex,
  skipRootKeys: readonly string[] = [],
): number[] {
  const bad: number[] = [];
  forEachNumber(value, skipRootKeys, (cands) => {
    if (!cands.some((c) => index.has(c))) bad.push(cands[0]);
  });
  return bad;
}

export function hasAnyNumber(value: unknown, skipRootKeys: readonly string[] = []): boolean {
  let found = false;
  forEachNumber(value, skipRootKeys, () => {
    found = true;
  });
  return found;
}

/**
 * Bỏ các số đo dạng CẤU TRÚC không có căn cứ (team_size, star.metrics[], result.metrics[]),
 * giữ nguyên phần còn lại của dữ kiện. dropAll = bỏ mọi số đo (lượt bị yêu cầu bịa số).
 */
export function stripUngroundedMetrics(
  data: Record<string, unknown>,
  index: NumberIndex,
  dropAll = false,
): { data: Record<string, unknown>; removed: number } {
  const out = structuredClone(data);
  let removed = 0;

  if (typeof out.team_size === "number" && (dropAll || !index.has(out.team_size))) {
    delete out.team_size;
    removed++;
  }
  for (const key of ["star", "result"]) {
    const parent = out[key];
    if (!isRecord(parent) || !Array.isArray(parent.metrics)) continue;
    const before = parent.metrics.length;
    parent.metrics = parent.metrics.filter((m: unknown) => {
      if (dropAll || !isRecord(m) || typeof m.value !== "number" || !index.has(m.value)) return false;
      return m.baseline === undefined || (typeof m.baseline === "number" && index.has(m.baseline));
    });
    removed += before - parent.metrics.length;
  }
  return { data: out, removed };
}

// ---------------------------------------------------------------------
// 3. Trích dẫn nguyên văn
// ---------------------------------------------------------------------
export function quoteIsVerbatim(message: string, quote: string): boolean {
  const q = normalizeForMatch(quote);
  return q.length >= 4 && normalizeForMatch(message).includes(q);
}

// ---------------------------------------------------------------------
// 4. Parse JSON an toàn từ đầu ra LLM
// ---------------------------------------------------------------------
export function extractJson(raw: string): unknown {
  let s = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(s);
  if (fence) s = fence[1];
  try {
    return JSON.parse(s);
  } catch { /* thử cắt phần {...} bên dưới */ }
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(s.slice(start, end + 1));
    } catch { /* rơi xuống lỗi */ }
  }
  throw new Error("INVALID_JSON");
}

// ---------------------------------------------------------------------
// 5. Kiểm tra phản hồi của AI (bước 8 trong spec): 1 câu hỏi, độ dài, không thêm số lạ
// ---------------------------------------------------------------------
export const MAX_REPLY_WORDS = 90; // spec: ~60 từ; nới nhẹ để tránh loại nhầm

export function checkReply(reply: string, allowedNumbers: NumberIndex): { ok: boolean; reason?: string } {
  const r = reply.trim();
  if (!r) return { ok: false, reason: "EMPTY" };
  const questions = (r.match(/[?？]/g) ?? []).length;
  if (questions === 0) return { ok: false, reason: "NO_QUESTION" };
  if (questions > 1) return { ok: false, reason: "MULTI_QUESTION" };
  if (r.split(/\s+/).length > MAX_REPLY_WORDS) return { ok: false, reason: "TOO_LONG" };
  if (findUngroundedNumbers(r, allowedNumbers).length > 0) return { ok: false, reason: "UNGROUNDED_NUMBER" };
  return { ok: true };
}

// ---------------------------------------------------------------------
// 6. Chính sách ghi nhận (mục 5.4)
// ---------------------------------------------------------------------
const HIGH_RISK_KEYS = new Set([
  "period", "team_size", "role", "title", "result", "star", "gpa", "honors",
  "degree", "employment_type", "beyond_scope", "outcome",
]);

export function classifyCommitPolicy(input: {
  origin: FactOrigin;
  intent: FactIntent;
  estimated: boolean;
  data: Record<string, unknown>;
}): CommitPolicy {
  if (input.origin === "ai_inferred") return "suggest_only";
  if (input.intent === "correct" || input.estimated) return "confirm";
  return Object.keys(input.data).some((k) => HIGH_RISK_KEYS.has(k)) ? "confirm" : "auto";
}

// ---------------------------------------------------------------------
// 7. Lưới an toàn cho "yêu cầu bịa/thổi phồng" (điều kiện chặn ra mắt, US-1.16).
//    Chỉ là heuristic bổ sung cho nhãn của LLM, không thay thế.
// ---------------------------------------------------------------------
const FABRICATION_PATTERNS: readonly RegExp[] = [
  /(?:^|[^\p{L}])(?:bịa|thổi phồng|nói quá)(?![\p{L}])/iu,
  /(?:viết|ghi|thêm)\s+(?:giúp\s+)?(?:mình\s+)?(?:là\s+)?(?:tăng|giảm|đạt)\s*\d/iu,
  /(?:cho đẹp|cho ấn tượng|cho oách)/iu,
  /(?:ghi|viết)\s+(?:đại|bừa|tạm)(?![\p{L}])/iu,
];

export function looksLikeFabricationRequest(message: string): boolean {
  return FABRICATION_PATTERNS.some((p) => p.test(message));
}

// ---------------------------------------------------------------------
// 8. Siết JSON Schema: thêm additionalProperties:false cho mọi object có `properties`
//    (schema gốc cho phép khoá lạ; bản nháp AI thì không được phép).
//    Gọi trên BẢN SAO của $defs, không sửa file schema gốc.
// ---------------------------------------------------------------------
export function hardenObjectSchemas(node: unknown): void {
  if (Array.isArray(node)) {
    for (const n of node) hardenObjectSchemas(n);
    return;
  }
  if (isRecord(node)) {
    if (node.type === "object" && isRecord(node.properties) && node.additionalProperties === undefined) {
      node.additionalProperties = false;
    }
    for (const v of Object.values(node)) hardenObjectSchemas(v);
  }
}
