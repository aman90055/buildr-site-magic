import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdSlot from "@/components/ads/AdSlot";
import StickyAd from "@/components/ads/StickyAd";
import { AD_SLOTS } from "@/lib/adSlots";
import { isAdRoute } from "@/lib/adsRoutes";
import { CONSENT_STORAGE_KEY } from "@/lib/adConsent";

/** The exact ad set the homepage declares (midContent + footer). */
const HomePageAds = () => (
  <>
    <AdSlot config={AD_SLOTS.midContent} />
    <AdSlot config={AD_SLOTS.footer} />
    <StickyAd />
  </>
);

const grantMarketingConsent = () =>
  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
      timestamp: Date.now(),
    }),
  );

const denyMarketingConsent = () =>
  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
      timestamp: Date.now(),
    }),
  );

const renderAt = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <HomePageAds />
    </MemoryRouter>,
  );

const units = () => document.querySelectorAll("ins.adsbygoogle").length;
const script = () => document.getElementById("adsbygoogle-js");

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.getElementById("adsbygoogle-js")?.remove();
});

afterEach(() => {
  cleanup();
  document.getElementById("adsbygoogle-js")?.remove();
});

describe("ad policy gate — route allow-list", () => {
  it("blocks thin/utility routes and allows content routes", () => {
    expect(isAdRoute("/auth")).toBe(false);
    expect(isAdRoute("/admin")).toBe(false);
    expect(isAdRoute("/admin/premium")).toBe(false);
    expect(isAdRoute("/tools")).toBe(false);
    expect(isAdRoute("/this-route-does-not-exist")).toBe(false);
    expect(isAdRoute("/")).toBe(true);
    expect(isAdRoute("/blog/some-post")).toBe(true);
  });

  it.each(["/auth", "/admin", "/tools", "/this-route-does-not-exist"])(
    "renders no ad units and no AdSense script on %s (consent granted)",
    (route) => {
      grantMarketingConsent();
      renderAt(route);
      expect(units()).toBe(0);
      expect(script()).toBeNull();
    },
  );

  it("renders exactly 2 ad units on / when marketing consent is granted", () => {
    grantMarketingConsent();
    renderAt("/");
    expect(units()).toBe(2);
    expect(script()).not.toBeNull();
  });
});

describe("ad policy gate — consent", () => {
  it("renders no units and injects no script on / before any consent decision", () => {
    renderAt("/");
    expect(units()).toBe(0);
    expect(script()).toBeNull();
  });

  it("renders no units and injects no script on / when marketing consent is denied", () => {
    denyMarketingConsent();
    renderAt("/");
    expect(units()).toBe(0);
    expect(script()).toBeNull();
  });
});
