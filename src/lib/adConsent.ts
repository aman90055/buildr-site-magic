/**
 * Marketing/advertising consent gate.
 *
 * AdSense (script + units) must NEVER load before the visitor grants
 * marketing consent in the cookie banner. This module is the single source
 * of truth, shared by AdSlot, StickyAd and the on-demand script loader.
 */

export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_EVENT = "cookie-consent-change";

export type ConsentValue = "granted" | "denied";

export interface StoredConsent {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
  timestamp: number;
}

export const readConsent = (): StoredConsent | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

/** True only when the visitor explicitly allowed advertising storage. */
export const hasMarketingConsent = (): boolean =>
  readConsent()?.ad_storage === "granted";

/** No decision recorded yet (banner still pending). */
export const isConsentUndecided = (): boolean => readConsent() === null;

export const notifyConsentChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_EVENT));
};

/** Subscribe to consent changes (same tab + other tabs). */
export const onConsentChange = (cb: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(CONSENT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};
