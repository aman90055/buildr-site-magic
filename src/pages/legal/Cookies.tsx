import LegalPage from "@/components/LegalPage";

const Cookies = () => (
  <LegalPage
    slug="cookies"
    title="Cookie Policy"
    description="How Document Edit Pro AI uses cookies and similar technologies for authentication, preferences, analytics, and advertising — and how you can control them."
    updated="2026-06-30"
    intro="This Cookie Policy explains what cookies are, which ones we use, why we use them, and the choices available to you. It complements our Privacy Policy."
    sections={[
      {
        id: "what-are-cookies",
        heading: "1. What Are Cookies?",
        body: `Cookies are small text files placed on your device by websites you visit. They allow a site to remember your actions and preferences (sign-in, language, theme) over a period of time, so you don't have to keep re-entering them.

We also use related technologies such as localStorage, sessionStorage, and pixel tags. For simplicity we refer to all of these as "cookies" in this policy.`,
      },
      {
        id: "categories",
        heading: "2. Categories of Cookies We Use",
        body: `We group cookies into four categories:

- Strictly necessary — required for the Service to work (authentication tokens, CSRF protection, load balancing). These cannot be turned off.
- Functional — remember your preferences such as dark mode, language, dismissed banners, and recently used tools.
- Analytics — help us understand how visitors use the site (page views, popular tools, anonymous device class). We use Google Analytics 4 with IP anonymisation.
- Advertising — used by Google AdSense and similar partners to display relevant ads and measure their performance. Advertising cookies are only set on pages that show ads.`,
      },
      {
        id: "specific-cookies",
        heading: "3. Specific Cookies & Storage Keys",
        body: `Examples of the most common items we set:

- sb-* — Lovable Cloud / Supabase authentication tokens (necessary)
- theme — light/dark mode preference (functional)
- site.* — feature toggles such as ad slots and exit-intent (functional)
- ad_events — anonymous impression/click counters for ad performance (functional/analytics)
- _ga, _gid — Google Analytics 4 measurement (analytics)
- __gads, __gpi, IDE, ANID — Google AdSense / advertising cookies (advertising)`,
      },
      {
        id: "third-parties",
        heading: "4. Third-Party Cookies",
        body: `Some cookies are set by trusted third parties when their scripts run on our site:

- Google AdSense — ad delivery and frequency capping
- Google Analytics — usage measurement
- Razorpay — fraud prevention during checkout
- Lovable Cloud — backend session management

Each third party operates under its own privacy and cookie policy, which you can find by following the links in our Privacy Policy.`,
      },
      {
        id: "controls",
        heading: "5. How to Control Cookies",
        body: `You can control cookies in several ways:

- Browser settings — block or delete cookies in Chrome, Firefox, Safari, Edge, or your mobile browser
- Google Ad Settings — opt out of personalised advertising at https://adssettings.google.com
- Google Analytics opt-out — install the official browser add-on
- Site preferences — adjust feature toggles inside your Document Edit Pro AI account

Blocking strictly necessary cookies may break sign-in, file uploads, and saved preferences.`,
      },
      {
        id: "do-not-track",
        heading: "6. Do Not Track & Global Privacy Control",
        body: `Browsers and operating systems may send Do Not Track (DNT) or Global Privacy Control (GPC) signals. Where required by law we honour these signals by disabling analytics and advertising cookies for that session. We will expand support as standards mature.`,
      },
      {
        id: "updates",
        heading: "7. Updates to This Policy",
        body: `We may update this Cookie Policy when we change the cookies we use or to reflect legal updates. The "Last updated" date at the top reflects the most recent revision. Material changes will be highlighted in-product.`,
      },
      {
        id: "contact",
        heading: "8. Contact",
        body: `If you have questions about cookies on Document Edit Pro AI, please use our contact form. We respond to privacy queries within 48 business hours.`,
      },
    ]}
  />
);

export default Cookies;
