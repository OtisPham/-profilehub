import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": Deno.env.get("CORS_ALLOW_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}

export function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new ApiError(500, "SERVER_MISCONFIGURED", `Missing env ${name}`);
  return v;
}

let _admin: SupabaseClient | null = null;
/** Service-role client. Mọi query dùng client này PHẢI lọc theo user_id. */
export function adminClient(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

export interface AuthUser {
  id: string;
  email?: string;
}

export async function authenticate(req: Request): Promise<AuthUser> {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) throw new ApiError(401, "UNAUTHORIZED", "Missing bearer token");
  const { data, error } = await adminClient().auth.getUser(token);
  if (error || !data.user) throw new ApiError(401, "UNAUTHORIZED", "Invalid or expired token");
  return { id: data.user.id, email: data.user.email ?? undefined };
}

export async function readJson(req: Request, optional = false): Promise<unknown> {
  const text = await req.text();
  if (!text.trim()) {
    if (optional) return {};
    throw new ApiError(400, "INVALID_JSON", "Request body is empty");
  }
  if (text.length > 20_000) throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body too large");
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body is not valid JSON");
  }
}

export function errorResponse(e: unknown, requestId: string): Response {
  if (e instanceof ApiError) {
    if (e.status >= 500) console.error(JSON.stringify({ requestId, code: e.code, msg: e.message }));
    return json({ error: { code: e.code, message: e.message, details: e.details, request_id: requestId } }, e.status);
  }
  console.error(JSON.stringify({ requestId, unhandled: String(e), stack: (e as Error)?.stack }));
  return json(
    { error: { code: "INTERNAL_ERROR", message: "Internal server error", request_id: requestId } },
    500,
  );
}

export function log(requestId: string, event: string, data: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ requestId, event, ...data }));
}
