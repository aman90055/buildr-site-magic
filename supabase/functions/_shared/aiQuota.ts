import { DAILY_AI_LIMITS, tierFor, type AiTier } from "./aiLimits.ts";

/** AI features that share one daily allowance. Each allowed request writes one rate_limits row. */
export const AI_QUOTA_FUNCTIONS = [
  "ai-chat",
  "ai-analyze",
  "ai-ocr",
  "ai-assistant",
  "ai-generate-image",
  "ai-transcribe",
];

export interface QuotaResult {
  allowed: boolean;
  tier: AiTier;
  limit: number;
  used: number;
}

// deno-lint-ignore no-explicit-any
export async function checkDailyAiQuota(admin: any, userId: string | null, ipIdentifier: string): Promise<QuotaResult> {
  let row = null;
  if (userId) {
    const { data } = await admin
      .from("user_premium_status")
      .select("plan,is_active,expires_at")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("activated_at", { ascending: false })
      .limit(1);
    row = data?.[0] ?? null;
  }
  const tier = tierFor(row, !!userId);
  const limit = DAILY_AI_LIMITS[tier];
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", userId || ipIdentifier)
    .in("function_name", AI_QUOTA_FUNCTIONS)
    .gte("window_start", since);
  const used = count || 0;
  return { allowed: used < limit, tier, limit, used };
}

export function dailyLimitResponse(q: QuotaResult, corsHeaders: Record<string, string>): Response {
  const upgrade = q.tier === "anonymous"
    ? " Sign in for a higher daily limit."
    : q.tier === "free" ? " Premium plans raise this limit." : "";
  return new Response(
    JSON.stringify({
      error: `Daily AI limit reached (${q.limit} requests per 24 hours).${upgrade}`,
      code: "daily_ai_limit",
      limit: q.limit,
      tier: q.tier,
    }),
    { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
