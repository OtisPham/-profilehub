import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env.js";

export class LlmError extends Error {
  constructor(message: string, public status?: number, public retryable = false) {
    super(message);
    this.name = "LlmError";
  }
}

export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CompleteOptions {
  model: string;
  system: string;
  messages: LlmMessage[];
  maxTokens: number;
  temperature?: number;
  timeoutMs?: number;
}

export interface ToolSpec {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export const MODELS = {
  reply: () => (ENV.GEMINI_API_KEY ? ENV.GEMINI_MODEL || "gemini-3.5-flash" : ENV.ANTHROPIC_MODEL_REPLY || "claude-3-5-sonnet-20241022"),
  extract: () => (ENV.GEMINI_API_KEY ? ENV.GEMINI_MODEL || "gemini-3.5-flash" : ENV.ANTHROPIC_MODEL_EXTRACT || "claude-3-5-haiku-20241022"),
  generate: () => (ENV.GEMINI_API_KEY ? ENV.GEMINI_MODEL || "gemini-3.5-flash" : ENV.ANTHROPIC_MODEL_GENERATE || "claude-3-5-sonnet-20241022"),
};

/** Đệ quy làm sạch JSON schema tương thích chuẩn OpenAPI 3.0 cho Gemini */
export function cleanJsonSchema(schema: any): any {
  if (schema === null || typeof schema !== "object") return schema;
  if (Array.isArray(schema)) {
    return schema.map(cleanJsonSchema);
  }
  const copy: Record<string, any> = {};
  for (const [key, val] of Object.entries(schema)) {
    if (key === "$schema" || key === "additionalProperties") {
      continue;
    }
    // Chuyển type: ["string", "null"] -> type: "string", nullable: true cho Gemini
    if (key === "type" && Array.isArray(val)) {
      const nonNull = val.filter((t) => t !== "null");
      copy["type"] = nonNull[0] || "string";
      if (val.includes("null")) {
        copy["nullable"] = true;
      }
      continue;
    }
    // Chuyển anyOf: [{type: "string"}, {type: "null"}] -> type: "string", nullable: true
    if (key === "anyOf" && Array.isArray(val)) {
      const nonNull = val.filter((v: any) => v?.type !== "null");
      if (nonNull.length === 1) {
        const cleaned = cleanJsonSchema(nonNull[0]);
        Object.assign(copy, cleaned);
        copy["nullable"] = true;
        continue;
      }
    }
    copy[key] = cleanJsonSchema(val);
  }
  return copy;
}

/** Chuyển zod schema -> input_schema hợp lệ */
export function toToolSchema(schema: any): Record<string, unknown> {
  const js = zodToJsonSchema(schema as any, { $refStrategy: "none", target: "jsonSchema7" }) as Record<
    string,
    unknown
  >;
  return cleanJsonSchema(js);
}

export function toToolSpecFor(name: string, description: string, schema: z.ZodTypeAny): ToolSpec {
  return { name, description, input_schema: toToolSchema(schema) };
}

export interface Llm {
  complete(o: CompleteOptions): Promise<string>;
  callTool(o: CompleteOptions & { tool: ToolSpec }): Promise<unknown>;
}

/* ────────────────────────── Google Gemini Provider ────────────────────────── */

let geminiClientInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
  }
  return geminiClientInstance;
}

const FALLBACK_GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-latest',
];

export const gemini: Llm = {
  async complete(o) {
    if (!ENV.GEMINI_API_KEY) {
      return "Cảm ơn bạn đã chia sẻ. Hãy kể thêm về con số hoặc kết quả cụ thể mà bạn đạt được trong công việc nhé!";
    }

    const ai = getGeminiClient();
    const primaryModel = o.model && o.model.startsWith("gemini-") ? o.model : (ENV.GEMINI_MODEL || "gemini-3.5-flash");
    const candidateModels = Array.from(new Set([primaryModel, ...FALLBACK_GEMINI_MODELS]));

    const contents = o.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: o.system,
            maxOutputTokens: Math.max(o.maxTokens || 2048, 2048),
            temperature: o.temperature ?? 0.6,
          },
        });

        const text = response.text?.trim();
        if (text) return text;
      } catch (e: any) {
        lastError = e;
        console.warn(`[Gemini Complete] Model ${modelName} error (${e?.status || e?.message}), trying fallback...`);
      }
    }

    throw new LlmError(`Gemini error across models: ${lastError?.message || String(lastError)}`, lastError?.status || 500, true);
  },

  async callTool(o) {
    if (!ENV.GEMINI_API_KEY) {
      // Dev fallback mock tool extraction
      const lastMsg = o.messages[o.messages.length - 1]?.content || "";
      const match = lastMsg.match(/(\d+(?:\.\d+)?%|\d+\s*(?:triệu|tỷ|nghìn|usd|k))/i);
      return {
        user_intent: "answering",
        context_updates: {},
        goal_updates: {},
        achievements: match
          ? [
              {
                ref_id: null,
                resolves_followup_id: null,
                title: "Hoàn thành mục tiêu công việc",
                action: "Triển khai nhiệm vụ",
                result: `Đạt mức ${match[1]}`,
                metric: {
                  raw: match[1],
                  value: parseFloat(match[1]) || null,
                  unit: match[1].includes("%") ? "%" : "VND",
                  direction: "increase",
                  baseline: null,
                  timeframe: null,
                  is_estimate: false,
                },
                impact_type: "Business",
                timeframe: null,
                own_contribution: "Trực tiếp thực hiện",
                skills: [],
                dna_signals: [],
                confidence: 0.85,
              },
            ]
          : [],
        task_claims: match ? [] : [{ summary: lastMsg.slice(0, 100) }],
        evidence: [],
        problem_solving: [],
        leadership: [],
        learning: [],
      };
    }

    const ai = getGeminiClient();
    const primaryModel = o.model && o.model.startsWith("gemini-") ? o.model : (ENV.GEMINI_MODEL || "gemini-3-flash-preview");
    const candidateModels = Array.from(new Set([primaryModel, ...FALLBACK_GEMINI_MODELS]));

    const contents = o.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const cleanSchema = cleanJsonSchema(o.tool.input_schema);
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: o.system,
            maxOutputTokens: 8192,
            temperature: o.temperature ?? 0.1,
            responseMimeType: "application/json",
            responseSchema: cleanSchema,
          },
        });

        let text = response.text?.trim();
        if (text) {
          if (text.startsWith("```json")) {
            text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
          } else if (text.startsWith("```")) {
            text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
          }
          try {
            return JSON.parse(text);
          } catch (jsonErr) {
            // Thử trích xuất khối json hoàn chỉnh
            const firstBrace = text.indexOf("{");
            const lastBrace = text.lastIndexOf("}");
            if (firstBrace >= 0 && lastBrace > firstBrace) {
              const sub = text.substring(firstBrace, lastBrace + 1);
              return JSON.parse(sub);
            }
            throw jsonErr;
          }
        }
      } catch (e: any) {
        lastError = e;
        console.warn(`[Gemini CallTool] Model ${modelName} error (${e?.status || e?.message}), trying fallback...`);
      }
    }

    // Return safe fallback structured data if all remote calls failed
    console.warn(`[Gemini CallTool] All models failed, using safe fallback.`);
    return {
      user_intent: "answering",
      context_updates: {},
      goal_updates: {},
      achievements: [],
      task_claims: [],
      evidence: [],
      problem_solving: [],
      leadership: [],
      learning: [],
    };
  },
};

/* ────────────────────────── Anthropic Fallback Provider ────────────────────────── */

const API_URL = "https://api.anthropic.com/v1/messages";
const MAX_ATTEMPTS = 3;

const backoff = (attempt: number) => 400 * 2 ** attempt + Math.floor(Math.random() * 250);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function requestAnthropic(body: Record<string, unknown>, timeoutMs: number): Promise<any> {
  const apiKey = ENV.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new LlmError("ANTHROPIC_API_KEY is not configured", 500, false);
  }

  let lastErr: LlmError | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if (res.ok) return await res.json();

      const retryable = res.status === 429 || res.status === 529 || res.status >= 500;
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      lastErr = new LlmError(`Anthropic ${res.status}: ${detail}`, res.status, retryable);
      if (!retryable) throw lastErr;

      const retryAfter = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 8000) : backoff(attempt));
    } catch (e) {
      if (e instanceof LlmError && !e.retryable) throw e;
      lastErr = e instanceof LlmError ? e : new LlmError(`Network/timeout: ${String(e)}`, undefined, true);
      if (attempt < MAX_ATTEMPTS - 1) await sleep(backoff(attempt));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr ?? new LlmError("Unknown LLM failure");
}

export const anthropicProvider: Llm = {
  async complete(o) {
    if (!ENV.ANTHROPIC_API_KEY) {
      return "Cảm ơn bạn đã chia sẻ. Hãy kể thêm về con số hoặc kết quả cụ thể nhé!";
    }
    const res = await requestAnthropic(
      {
        model: o.model,
        max_tokens: o.maxTokens,
        ...(o.temperature !== undefined ? { temperature: o.temperature } : {}),
        system: o.system,
        messages: o.messages,
      },
      o.timeoutMs ?? 40_000,
    );
    const text = (res.content ?? [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();
    if (!text) throw new LlmError("Empty completion", undefined, true);
    return text;
  },

  async callTool(o) {
    if (!ENV.ANTHROPIC_API_KEY) {
      return gemini.callTool(o);
    }
    const res = await requestAnthropic(
      {
        model: o.model,
        max_tokens: o.maxTokens,
        ...(o.temperature !== undefined ? { temperature: o.temperature } : {}),
        system: o.system,
        messages: o.messages,
        tools: [o.tool],
        tool_choice: { type: "tool", name: o.tool.name },
      },
      o.timeoutMs ?? 40_000,
    );
    const block = (res.content ?? []).find((b: any) => b.type === "tool_use" && b.name === o.tool.name);
    if (!block) throw new LlmError("Model did not return tool_use", undefined, true);
    return block.input;
  },
};

/* ────────────────────────── Unified Default LLM Router ────────────────────────── */

export const llm: Llm = {
  async complete(o) {
    if (ENV.GEMINI_API_KEY || ENV.LLM_PROVIDER === "gemini") {
      return gemini.complete(o);
    }
    return anthropicProvider.complete(o);
  },
  async callTool(o) {
    if (ENV.GEMINI_API_KEY || ENV.LLM_PROVIDER === "gemini") {
      return gemini.callTool(o);
    }
    return anthropicProvider.callTool(o);
  },
};

// Aliases for compatibility
export const anthropic = llm;
