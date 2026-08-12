/**
 * Ad policy gate telemetry.
 *
 * Records every decision the ad gate makes during SPA navigation:
 *  - script injected / already loaded
 *  - skipped because route is not allow-listed
 *  - skipped because marketing consent is missing
 *  - ad unit rendered / suppressed
 *
 * Events go to (a) console when debug mode is on, (b) a bounded
 * localStorage ring buffer for the in-app debug panel, and (c) GA4 via
 * gtag so they are reviewable in monitoring/analytics.
 */

const STORAGE_KEY = "site.adPolicyLog.v1";
const MAX_EVENTS = 100;
const DEBUG_KEY = "site.adDebug";

export type AdPolicyDecision =
  | "script_injected"
  | "script_already_loaded"
  | "skipped_route_blocked"
  | "skipped_no_consent"
  | "skipped_ads_disabled"
  | "unit_rendered"
  | "unit_suppressed";

export interface AdPolicyEvent {
  ts: number;
  route: string;
  decision: AdPolicyDecision;
  slot?: string;
  reason?: string;
}

export const isAdDebugMode = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("adDebug") === "1") {
      localStorage.setItem(DEBUG_KEY, "1");
      return true;
    }
    if (q.get("adDebug") === "0") {
      localStorage.removeItem(DEBUG_KEY);
      return false;
    }
    return localStorage.getItem(DEBUG_KEY) === "1";
  } catch {
    return false;
  }
};

export const setAdDebugMode = (on: boolean) => {
  try {
    if (on) localStorage.setItem(DEBUG_KEY, "1");
    else localStorage.removeItem(DEBUG_KEY);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ad-policy-log"));
  }
};

const read = (): AdPolicyEvent[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const getAdPolicyEvents = (): AdPolicyEvent[] => read().slice().reverse();

export const clearAdPolicyEvents = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("ad-policy-log"));
};

export const logAdPolicy = (
  decision: AdPolicyDecision,
  detail: { route?: string; slot?: string; reason?: string } = {},
) => {
  if (typeof window === "undefined") return;
  const event: AdPolicyEvent = {
    ts: Date.now(),
    route: detail.route ?? window.location.pathname,
    decision,
    slot: detail.slot,
    reason: detail.reason,
  };

  try {
    const next = [...read(), event].slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }

  if (isAdDebugMode()) {
    const style = decision.startsWith("skipped")
      ? "color:#f59e0b"
      : decision === "script_injected"
        ? "color:#22d3ee"
        : "color:#94a3b8";
    // eslint-disable-next-line no-console
    console.log(
      `%c[ad-gate] ${decision}`,
      style,
      { route: event.route, slot: event.slot, reason: event.reason },
    );
  }

  // Monitoring: forward to GA4 when available (respects Consent Mode).
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", "ad_policy_gate", {
      decision,
      route: event.route,
      ad_slot: event.slot ?? "",
      reason: event.reason ?? "",
    });
  }

  window.dispatchEvent(new Event("ad-policy-log"));
};
