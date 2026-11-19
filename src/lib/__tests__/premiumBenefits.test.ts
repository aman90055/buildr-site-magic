import { describe, expect, it } from "vitest";
import { DAILY_AI_LIMITS, PAID_PLANS, PREMIUM_UPI_ID, planFeatures, planUpiLink } from "@/lib/premiumPlans";
import { DAILY_AI_LIMITS as SERVER_LIMITS, tierFor, isPlanActive } from "../../../supabase/functions/_shared/aiLimits";
import { resolveAdStatus } from "@/lib/adFree";

const now = Date.parse("2026-11-18T12:00:00Z");

describe("daily AI limits", () => {
  it("matches the owner-approved numbers", () => {
    expect(DAILY_AI_LIMITS).toEqual({ anonymous: 10, free: 30, basic: 100, pro: 300, enterprise: 1000 });
  });
  it("server enforces the same numbers the Premium page shows", () => {
    expect(SERVER_LIMITS).toEqual(DAILY_AI_LIMITS);
  });
  it("signed-out visitors get the anonymous tier", () => {
    expect(tierFor(null, false, now)).toBe("anonymous");
  });
  it("signed-in users without a plan get the free tier", () => {
    expect(tierFor(null, true, now)).toBe("free");
  });
  it("an expired Pro plan falls back to free", () => {
    expect(tierFor({ plan: "pro", is_active: true, expires_at: "2026-11-01T00:00:00Z" }, true, now)).toBe("free");
  });
  it("an active Pro plan gets the Pro tier", () => {
    expect(tierFor({ plan: "pro", is_active: true, expires_at: "2026-12-01T00:00:00Z" }, true, now)).toBe("pro");
  });
  it("owner lifetime grants get the Enterprise tier", () => {
    expect(tierFor({ plan: "lifetime", is_active: true, expires_at: null }, true, now)).toBe("enterprise");
  });
  it("a switched-off plan is not active", () => {
    expect(isPlanActive({ plan: "basic", is_active: false, expires_at: null }, now)).toBe(false);
  });
});

describe("ads", () => {
  it("premium users are ad-free", () => {
    expect(resolveAdStatus(false, false, true)).toBe("ad-free");
  });
  it("no ads load while plan status is still loading", () => {
    expect(resolveAdStatus(false, true, false)).toBe("pending");
    expect(resolveAdStatus(true, false, false)).toBe("pending");
  });
  it("free users can see ads", () => {
    expect(resolveAdStatus(false, false, false)).toBe("ads");
  });
});

describe("Premium payments", () => {
  it("go to the owner's UPI ID", () => {
    expect(PREMIUM_UPI_ID).toBe("Docu2026@nyes");
    for (const p of PAID_PLANS) expect(planUpiLink(p)).toContain("pa=Docu2026@nyes");
  });
  it("charge the listed plan prices", () => {
    expect(PAID_PLANS.map((p) => [p.id, p.price])).toEqual([["basic", 99], ["pro", 249], ["enterprise", 599]]);
    expect(planUpiLink(PAID_PLANS[1])).toContain("am=249");
  });
  it("list each plan's own daily AI limit", () => {
    expect(planFeatures(PAID_PLANS[2]).join(" ")).toContain("1000 AI requests per day");
  });
});
