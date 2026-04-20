/**
 * AdSense slot ID registry.
 * Replace these with real slot IDs from your AdSense dashboard.
 * Env override: VITE_ADSENSE_SLOT_<KEY> (e.g. VITE_ADSENSE_SLOT_HEADER)
 *
 * To get slot IDs: AdSense → Ads → By ad unit → Create new ad unit
 * Use "Display ads" responsive for most placements.
 */

const env = (key: string): string | undefined => {
  const v = (import.meta as any).env?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
};

export const AD_SLOTS = {
  // Top of page – horizontal banner
  header: env("VITE_ADSENSE_SLOT_HEADER") ?? "",
  // Inside content – auto responsive
  inArticle: env("VITE_ADSENSE_SLOT_IN_ARTICLE") ?? "",
  // Between sections – rectangle
  midContent: env("VITE_ADSENSE_SLOT_MID") ?? "",
  // Sidebar – vertical
  sidebar: env("VITE_ADSENSE_SLOT_SIDEBAR") ?? "",
  // Bottom of page – horizontal
  footer: env("VITE_ADSENSE_SLOT_FOOTER") ?? "",
  // Sticky bottom mobile
  sticky: env("VITE_ADSENSE_SLOT_STICKY") ?? "",
  // Tool result page – high-revenue placement
  toolResult: env("VITE_ADSENSE_SLOT_TOOL_RESULT") ?? "",
} as const;

export const ADSENSE_CLIENT = "ca-pub-4830449684268109";
