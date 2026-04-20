---
name: monetization-and-seo-2026
description: AdSense slot registry, robots/sitemap, exit-intent offer, sticky ad, and SEO schemas (HowTo, ItemList, WebSite SearchAction)
type: feature
---
# Monetization + SEO Boost (Apr 2026)

## AdSense slots
- Central registry: `src/lib/adSlots.ts` exposes `AD_SLOTS.{header,inArticle,midContent,sidebar,footer,sticky,toolResult}`.
- Override via env: `VITE_ADSENSE_SLOT_<KEY>` (e.g. `VITE_ADSENSE_SLOT_HEADER`).
- `AdSlot.tsx` auto-skips placeholder/short IDs (`/^(1234|2345|3456|4567|5678|6789|7890|0000)/` or length < 8).
- Client: `ca-pub-4830449684268109` (already in `index.html`).

## Sticky bottom ad (mobile)
- `src/components/ads/StickyAd.tsx` — renders `AD_SLOTS.sticky`, mobile-only, closeable, sessionStorage-persisted.

## Exit-intent monetization
- `src/components/ExitIntentOffer.tsx` — desktop mouseleave + mobile rapid scroll-up triggers premium/donate modal once per session.
- Mounted globally in `App.tsx` alongside `StickyAd`.

## SEO schemas added (`index.html`)
- `WebSite` + `SearchAction` (Google sitelinks search box)
- `HowTo` for Merge PDF (rich result eligibility)
- `ItemList` of top 8 tools (sitelink hint)
- Existing: WebApplication, Organization, FAQPage, SoftwareApplication, BreadcrumbList.

## Crawler & geo
- `robots.txt` allows AdsBot-Google, Mediapartners-Google, Googlebot-Image, DuckDuckBot, YandexBot.
- `index.html` adds hreflang `en` + `hi-IN` + `x-default`, `geo.region=IN`.

## How to add real AdSense slot IDs
1. AdSense → Ads → By ad unit → Create new ad unit (Display, Responsive).
2. Copy the 10-digit slot ID.
3. Either set env var (`VITE_ADSENSE_SLOT_HEADER=1234567890`) or hardcode in `src/lib/adSlots.ts`.
4. Build redeploys automatically pick it up.
