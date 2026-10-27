import { hasMarketingConsent } from "@/lib/adConsent";

export const GOOGLE_ADS_ID = "AW-18537557674";
export const MERGE_VISIT_SEND_TO = "AW-18537557674/B3xaCKrAr6sdEKrdsodF";

type W = Window & { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void };

/** Loads the Google Ads tag only after the visitor accepted marketing cookies. */
export function loadGoogleAds(): boolean {
  if (typeof window === "undefined" || !hasMarketingConsent()) return false;
  const w = window as unknown as W;
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  if (document.querySelector("script[data-google-ads]")) return true;
  w.gtag("set", "developer_id.dZjgwMW", true);
  w.gtag("js", new Date());
  w.gtag("config", GOOGLE_ADS_ID);
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  s.async = true;
  s.dataset.googleAds = "";
  document.head.appendChild(s);
  return true;
}

/** Reports a Merge PDF page visit (report-only; not used for bidding). */
export function reportMergeVisit() {
  if (!loadGoogleAds()) return;
  (window as unknown as W).gtag?.("event", "conversion", { send_to: MERGE_VISIT_SEND_TO });
}
