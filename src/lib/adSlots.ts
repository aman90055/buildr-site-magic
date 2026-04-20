/**
 * AdSense slot ID registry — production-ready.
 * Publisher: ca-pub-4830449684268109
 *
 * Each entry includes the slot id + format hints so AdSlot can render
 * the right unit (auto / fluid / in-article / autorelaxed / multiplex).
 *
 * Env override: VITE_ADSENSE_SLOT_<KEY>
 */

const env = (key: string): string | undefined => {
  const v = (import.meta as any).env?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
};

export type AdFormat =
  | "auto"
  | "fluid"
  | "in-article"
  | "autorelaxed"
  | "horizontal"
  | "rectangle"
  | "vertical";

export interface AdSlotConfig {
  slot: string;
  format: AdFormat;
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  minHeight?: number;
}

export const AD_SLOTS: Record<string, AdSlotConfig> = {
  // 1. Multiplex / fluid (great for sidebars, related-content blocks, footers)
  sidebar: {
    slot: env("VITE_ADSENSE_SLOT_SIDEBAR") ?? "5653262489",
    format: "fluid",
    layoutKey: "-fb+5w+4e-db+86",
    minHeight: 250,
  },
  // 2. Auto-relaxed (matched content / native — great between sections)
  midContent: {
    slot: env("VITE_ADSENSE_SLOT_MID") ?? "3218670830",
    format: "autorelaxed",
    minHeight: 280,
  },
  // 3. In-article (high CPM — inside long content)
  inArticle: {
    slot: env("VITE_ADSENSE_SLOT_IN_ARTICLE") ?? "4611643553",
    format: "in-article",
    minHeight: 250,
  },
  // 4. Display auto (header banner, full-width responsive)
  header: {
    slot: env("VITE_ADSENSE_SLOT_HEADER") ?? "8538234095",
    format: "auto",
    fullWidthResponsive: true,
    minHeight: 100,
  },
  // 5. In-article (second variant — used on tool result pages, highest engagement)
  toolResult: {
    slot: env("VITE_ADSENSE_SLOT_TOOL_RESULT") ?? "6112491783",
    format: "in-article",
    minHeight: 250,
  },
  // 6. Display auto (footer / sticky bottom)
  footer: {
    slot: env("VITE_ADSENSE_SLOT_FOOTER") ?? "2283985461",
    format: "auto",
    fullWidthResponsive: true,
    minHeight: 90,
  },
  // 7. Multiplex / fluid (sticky mobile bottom — compact)
  sticky: {
    slot: env("VITE_ADSENSE_SLOT_STICKY") ?? "2118230866",
    format: "fluid",
    layoutKey: "-fb+5w+4e-db+86",
    minHeight: 60,
  },
};

export const ADSENSE_CLIENT = "ca-pub-4830449684268109";
