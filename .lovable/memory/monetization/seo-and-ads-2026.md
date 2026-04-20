---
name: monetization-and-seo-2026
description: AdSense slot registry (7 live slots), AdSlot fluid/in-article/autorelaxed support, RelatedTools widget, tool-result ad on Merge/Split/Compress/Convert, sitemap regen 2026-04-20
type: feature
---
# Monetization + SEO Boost (Apr 2026)

## AdSense — 7 live slots
Publisher: `ca-pub-4830449684268109` (loaded once via `index.html`).

`src/lib/adSlots.ts` exports `AD_SLOTS: Record<string, AdSlotConfig>` with `{ slot, format, layoutKey?, fullWidthResponsive?, minHeight? }`. Override per env: `VITE_ADSENSE_SLOT_<KEY>`.

| Key | Slot ID | Format | Notes |
|---|---|---|---|
| header | 8538234095 | auto | full-width responsive |
| inArticle | 4611643553 | in-article | fluid, centered |
| midContent | 3218670830 | autorelaxed | matched content / native |
| sidebar | 5653262489 | fluid | layout-key `-fb+5w+4e-db+86` |
| footer | 2283985461 | auto | full-width responsive |
| sticky | 2118230866 | fluid | mobile bottom (layout-key) |
| toolResult | 6112491783 | in-article | highest CPM, post-result |

## AdSlot component (`src/components/ads/AdSlot.tsx`)
- Preferred API: `<AdSlot config={AD_SLOTS.x} />`. Legacy `adSlot`/`adFormat` props still supported.
- Maps `format` → `<ins>` attributes:
  - `in-article` → `data-ad-layout=in-article`, `data-ad-format=fluid`, `text-align:center`
  - `fluid` → `data-ad-format=fluid` + optional `data-ad-layout-key`
  - `autorelaxed` → `data-ad-format=autorelaxed`
  - `auto/horizontal/rectangle/vertical` → `data-ad-format=<value>` + optional `data-full-width-responsive`
- Skips render for placeholder/short IDs.

## Internal linking
- `src/components/RelatedTools.tsx` curates 40+ tools with category metadata; renders 6 same-category siblings (with fallback to popular) as a card grid.
- Used inside `ToolPageTemplate` and on Merge / Split / Compress / Convert pages.

## Tool-result high-CPM placement
Merge, Split, Compress, Convert pages mount `<AdSlot config={AD_SLOTS.toolResult} />` inside their success state, right under the download CTA. This is the highest-engagement moment.

## Exit-intent + sticky ad
- `src/components/ExitIntentOffer.tsx` — desktop mouseleave + mobile rapid scroll-up triggers premium/donate modal once per session.
- `src/components/ads/StickyAd.tsx` — mobile-only, closeable, sessionStorage-persisted.
- Both mounted globally in `App.tsx`.

## SEO schemas (in `index.html`)
- `WebSite` + `SearchAction` (sitelinks search box)
- `HowTo` for Merge PDF (rich result eligible)
- `ItemList` of top 8 tools
- Existing: WebApplication, Organization, FAQPage, SoftwareApplication, BreadcrumbList.

## Crawler / geo / sitemap
- `robots.txt` allows AdsBot-Google, Mediapartners-Google, Googlebot-Image, DuckDuckBot, YandexBot.
- `index.html`: hreflang `en` + `hi-IN` + `x-default`, `geo.region=IN`.
- `public/sitemap.xml` regenerated 2026-04-20 with fresh `lastmod` for all 70+ URLs.

## Adding new slot IDs
1. AdSense → Ads → By ad unit → Create new ad unit.
2. Copy the 10-digit slot ID + format details.
3. Either set env (`VITE_ADSENSE_SLOT_HEADER=...`) or update `src/lib/adSlots.ts`.
4. Build redeploys automatically pick it up.
