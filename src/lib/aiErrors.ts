/**
 * Turns an Edge Function error into an Error carrying the server's message
 * (for example the daily AI limit text), instead of the generic
 * "non-2xx status code" from functions.invoke.
 */
export async function aiInvokeError(error: unknown): Promise<Error> {
  const ctx = (error as { context?: Response } | null)?.context;
  if (ctx && typeof ctx.json === "function") {
    try {
      const body = await ctx.clone().json();
      if (body?.error && typeof body.error === "string") return new Error(body.error);
    } catch {
      /* fall through */
    }
  }
  return error instanceof Error ? error : new Error("Something went wrong");
}

/** True when the server rejected the request because the daily AI allowance is used up. */
export const isDailyAiLimit = (message: string) => message.startsWith("Daily AI limit reached");
