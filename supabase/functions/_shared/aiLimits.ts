/**
 * Daily AI request allowance per tier (rolling 24 hours, all AI features combined).
 * Pure module: imported by Edge Functions and checked against the app's copy in tests.
 */
export const DAILY_AI_LIMITS = {
  anonymous: 10,
  free: 30,
  basic: 100,
  pro: 300,
  enterprise: 1000,
} as const;

export type AiTier = keyof typeof DAILY_AI_LIMITS;

export interface PremiumRow {
  plan: string | null;
  is_active: boolean | null;
  expires_at: string | null;
}

/** A premium row counts only while active and not past its expiry. */
export function isPlanActive(row: PremiumRow | null | undefined, now = Date.now()): boolean {
  if (!row || !row.is_active) return false;
  if (!row.expires_at) return true;
  return new Date(row.expires_at).getTime() > now;
}

/** Owner "lifetime" grants get the highest tier; unknown paid plans get Basic. */
export function tierFor(row: PremiumRow | null | undefined, signedIn: boolean, now = Date.now()): AiTier {
  if (!signedIn) return "anonymous";
  if (!isPlanActive(row, now)) return "free";
  const plan = (row?.plan ?? "").toLowerCase();
  if (plan === "enterprise" || plan === "lifetime") return "enterprise";
  if (plan === "pro") return "pro";
  return "basic";
}
