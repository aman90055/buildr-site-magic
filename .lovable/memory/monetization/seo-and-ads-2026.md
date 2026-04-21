---
name: monetization-and-seo-2026
description: AdSense slot registry (7 live slots), AdSlot fluid/in-article/autorelaxed support, RelatedTools widget, ToolPageTemplate auto-emits HowTo+FAQ JSON-LD + toolResult ad on all 50+ tool pages, 10 Hindi SEO blogs, sitemap regen 2026-04-21 (domain typo fixed)
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

## ToolPageTemplate — auto SEO + monetization
`src/components/ToolPageTemplate.tsx` accepts:
- `faqs?: { question; answer }[]` → emits FAQPage JSON-LD + visible accordion
- `longFormContent?: { heading; body }[]` → renders 1500+ word SEO sections
- Always auto-emits HowTo JSON-LD from `howItWorks` steps
- Renders ads in this order on every tool page: `toolResult` → `inArticle` → longForm → FAQs → RelatedTools → `midContent` → AffiliateBanner → `footer`

Result: **all 50+ tool pages get tool-result ad + HowTo schema for free** without per-page edits.

## Internal linking
- `src/components/RelatedTools.tsx` curates 40+ tools with category metadata; renders 6 same-category siblings.

## Tool-result high-CPM placement
Per-page on Merge / Split / Compress / Convert AND auto on every other tool via `ToolPageTemplate`.

## Hindi SEO blog posts (India organic)
10 long-tail Hindi posts in `src/pages/BlogPost.tsx` + listing in `Blog.tsx`, new `Hindi` category:
- pdf-kaise-merge-karein, pdf-compress-online-free-hindi, pdf-split-kaise-karein,
  pdf-ko-word-me-convert-karein, image-ko-pdf-banayein, pdf-rotate-online,
  scan-to-pdf-mobile, pdf-password-protect-hindi, pdf-unlock-karein, pdf-text-extract-hindi.

## Sitemap
`public/sitemap.xml` fixed (was `documents-edit-in` typo → now `document-edit-in.lovable.app`) and Hindi blog URLs appended (lastmod 2026-04-21, priority 0.75-0.85).

## Exit-intent + sticky ad + ads.txt
- `src/components/ExitIntentOffer.tsx` mounted globally
- `src/components/ads/StickyAd.tsx` mobile-only
- `public/ads.txt` ✓ verified

## SEO setup guide
Top-level `SEO_MONETIZATION_GUIDE.md` has GSC sitemap submission, ads.txt verification, sellers.json note, Rich Results Test checklist, mobile/desktop QA list.
