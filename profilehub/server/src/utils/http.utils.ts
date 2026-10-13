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

export function log(requestId: string, event: string, data: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ requestId, event, ...data }));
}
