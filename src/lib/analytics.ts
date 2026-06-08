// Lightweight analytics wrapper around Google Analytics (gtag).
// Safe no-op when gtag is unavailable (SSR, ad-blockers, dev preview).

type GtagFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export const trackEvent = (eventName: string, params: AnalyticsParams = {}): void => {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", eventName, params);
    }
  } catch {
    // ignore — analytics must never break the app
  }
};

export const trackCTA = (label: string, location: string, href?: string): void =>
  trackEvent("cta_click", { label, location, href });

export const trackToolCard = (toolId: string, location: string): void =>
  trackEvent("tool_card_click", { tool_id: toolId, location });
