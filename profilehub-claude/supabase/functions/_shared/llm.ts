/**
 * Anthropic Messages API client (fetch thuần, không SDK → cold start nhanh).
 * - Retry với exponential backoff cho 429/5xx/529/network.
 * - Timeout bằng AbortController.
 * - `callTool` ép model trả JSON có cấu trúc qua tool_choice.
 */
import { zodToJsonSchema } from "npm:zod-to-json-schema@3.23.5";
import type { z } from "npm:zod@3.23.8";
import { requireEnv } from "./http.ts";

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
  reply: () => Deno.env.get("ANTHROPIC_MODEL_REPLY") ?? "claude-sonnet-5-5",
  extract: () => Deno.env.get("ANTHROPIC_MODEL_EXTRACT") ?? "claude-haiku-4-5-20251001",
  generate: () => Deno.env.get("ANTHROPIC_MODEL_GENERATE") ?? "claude-sonnet-5-5",
};

/** Chuyển zod schema → input_schema hợp lệ cho Anthropic tool. */
export function toToolSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const js = zodToJsonSchema(schema, { $refStrategy: "none", target: "jsonSchema7" }) as Record<
    string,
    unknown
  >;
  delete js["$schema"];
  return js;
}

export function toToolSpecFor(name: string, description: string, schema: z.ZodTypeAny): ToolSpec {
  return { name, description, input_schema: toToolSchema(schema) };
}

export interface Llm {
  complete(o: CompleteOptions): Promise<string>;
  callTool(o: CompleteOptions & { tool: ToolSpec }): Promise<unknown>;
}

const API_URL = "https://api.anthropic.com/v1/messages";
const MAX_ATTEMPTS = 3;

async function request(body: Record<string, unknown>, timeoutMs: number): Promise<any> {
  const apiKey = requireEnv("ANTHROPIC_API_KEY");
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

const backoff = (attempt: number) => 400 * 2 ** attempt + Math.floor(Math.random() * 250);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const anthropic: Llm = {
  async complete(o) {
    const res = await request(
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
    const res = await request(
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
