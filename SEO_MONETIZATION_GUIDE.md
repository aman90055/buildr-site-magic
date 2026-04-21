# SEO + Monetization Setup Guide

## ✅ Already Done
- 7 production AdSense slots wired (`ca-pub-4830449684268109`)
- `public/ads.txt` ✓ (verified: `google.com, pub-4830449684268109, DIRECT, f08c47fec0942fa0`)
- `toolResult` ad now auto-renders on **all 50+ tool pages** (via `ToolPageTemplate`)
- HowTo + FAQPage JSON-LD auto-emitted on every tool page
- 10 Hindi SEO blog posts live at `/blog/<slug>`
- Sitemap with hreflang `en` + `hi-IN`

---

## 1️⃣ ads.txt — Verify

**File**: `public/ads.txt` (already correct)
```
google.com, pub-4830449684268109, DIRECT, f08c47fec0942fa0
```

**Verify after deploy**:
1. Visit `https://document-edit-in.lovable.app/ads.txt` → should show the line above.
2. AdSense → **Sites** → status will turn ✓ Ready in 24–48 hrs.

---

## 2️⃣ sellers.json — Note

`sellers.json` is **published by Google itself** at `https://realtimebidding.google.com/sellers.json`. As a publisher you **don't host it** — Google lists you automatically once your AdSense account is verified.

✓ No file needed in your project. Just keep `ads.txt` correct.

---

## 3️⃣ Google Search Console — Sitemap Submission

### Step 1 — Verify domain ownership
1. Open https://search.google.com/search-console
2. Add property → choose **URL prefix** → enter `https://document-edit-in.lovable.app`
3. Verify via **HTML tag** (already present in `index.html` if you used `google-site-verification` meta) OR **DNS TXT record** for custom domain.

### Step 2 — Submit sitemap
1. In GSC → left menu → **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**
4. Status should show ✅ Success within 1–24 hours.

### Step 3 — Request indexing for top pages
Use **URL Inspection** tool → paste these high-value URLs → click **Request Indexing**:
- `/`
- `/merge`, `/split`, `/compress`, `/convert`
- `/blog/pdf-kaise-merge-karein`
- `/blog/pdf-compress-online-free-hindi`
- `/blog/top-10-free-pdf-tools-2026`

### Step 4 — Enable Performance reporting for India
GSC → **Performance** → filter Country = **India** → track impressions/clicks for Hindi posts.

---

## 4️⃣ Rich Results Test

After deploy, validate every key page type:

| Page | Schema to validate |
|---|---|
| `/` | WebSite, Organization, FAQPage, ItemList, SoftwareApplication |
| `/merge` | HowTo (auto), FAQ (if added), BreadcrumbList |
| `/blog/pdf-kaise-merge-karein` | Article (add later) |

Open: https://search.google.com/test/rich-results → paste URL → check ✓ Eligible for rich results.

---

## 5️⃣ AdSense Verification Checklist

In AdSense dashboard:
- ✅ **Sites** → status `Ready`
- ✅ **Ads → By ad unit** → all 7 slots active (header, inArticle, midContent, sidebar, footer, sticky, toolResult)
- ✅ **Privacy & messaging → GDPR/CCPA** → consent message published
- ✅ **Payments** → bank/UPI added, address verified

---

## 6️⃣ Mobile + Desktop QA Checklist

**Desktop (985×638 or larger)**:
- [ ] `/merge` → upload 2 PDFs → result page shows download + ad below
- [ ] `/compress` → success state shows AdSense `toolResult` slot
- [ ] Move mouse to top edge → **Exit Intent** modal appears
- [ ] No console errors

**Mobile (≤768px)**:
- [ ] Sticky bottom ad appears after 4s
- [ ] Sticky ad close button works, doesn't reappear that session
- [ ] Hamburger menu opens
- [ ] Tool pages scrollable, ads don't break layout

---

## 7️⃣ Next High-Impact Wins

1. **Add real FAQs to top 10 tool pages** — pass `faqs={[...]}` prop to `ToolPageTemplate`. Each tool page becomes FAQ-rich-result eligible automatically.
2. **Add `longFormContent` prop** with 1500+ words on Merge/Split/Compress/Convert pages for ranking.
3. **Backlinks** — submit to Product Hunt, AlternativeTo, BetaList, Hacker News.
4. **Internal linking** — already done via `RelatedTools` widget on every tool page.
5. **Core Web Vitals** — run https://pagespeed.web.dev/ on `/` → target 90+ on mobile.

---

Made with ❤️ in India · 2026
