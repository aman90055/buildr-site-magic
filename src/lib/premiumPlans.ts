import { DONATION_RECIPIENT, DONATION_UPI_ID } from "./donation";

/** Daily AI requests (rolling 24h, all AI features combined). Mirrors supabase/functions/_shared/aiLimits.ts. */
export const DAILY_AI_LIMITS = {
  anonymous: 10,
  free: 30,
  basic: 100,
  pro: 300,
  enterprise: 1000,
} as const;

export type PaidPlanId = "basic" | "pro" | "enterprise";

export interface PaidPlan {
  id: PaidPlanId;
  name: string;
  price: number;
  description: string;
  dailyAiLimit: number;
  popular?: boolean;
}

/** Premium payments go to the same UPI ID as donations. */
export const PREMIUM_UPI_ID = DONATION_UPI_ID;

export const PAID_PLANS: PaidPlan[] = [
  { id: "basic", name: "Basic", price: 99, description: "For regular AI use", dailyAiLimit: DAILY_AI_LIMITS.basic },
  { id: "pro", name: "Pro", price: 249, description: "For daily, heavier AI use", dailyAiLimit: DAILY_AI_LIMITS.pro, popular: true },
  { id: "enterprise", name: "Enterprise", price: 599, description: "For very heavy AI use", dailyAiLimit: DAILY_AI_LIMITS.enterprise },
];

/** The only benefits Premium promises; each one is enforced in code. */
export const planFeatures = (plan: PaidPlan): string[] => [
  "No ads anywhere on Docunova",
  `${plan.dailyAiLimit} AI requests per day (free accounts: ${DAILY_AI_LIMITS.free})`,
  "30 days from activation, no auto-renewal",
  "Every PDF and image tool, same as free",
];

export const planUpiLink = (plan: PaidPlan): string =>
  `upi://pay?pa=${PREMIUM_UPI_ID}&pn=${encodeURIComponent(DONATION_RECIPIENT)}&am=${plan.price}&cu=INR&tn=${encodeURIComponent(`Docunova ${plan.name} plan`)}`;
