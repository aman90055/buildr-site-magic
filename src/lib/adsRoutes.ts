/**
 * AdSense route policy + on-demand script loader.
 *
 * Google flagged "Google-served ads on screens without publisher-content".
 * Root cause: the adsbygoogle.js tag was loaded globally from index.html, so
 * Auto Ads could inject units on every screen — including auth, dashboard,
 * admin, tool-upload and 404 screens that carry no publisher content.
 *
 * Fix: never load the AdSense script globally. It is injected only while the
 * visitor is on a content-rich, allow-listed route.
 */

import { ADSENSE_CLIENT } from "./adSlots";
import { hasMarketingConsent } from "./adConsent";
import { logAdPolicy } from "./adPolicyLog";
import { getRichContent } from "./richToolContent";

const hasRichContent = (pathname: string): boolean => !!getRichContent(pathname);


/** Routes with substantial, original publisher content. */
export const AD_ALLOWED_ROUTES = [
  "/",
  "/blog",
  "/about",
  "/faq",
  "/privacy",
  "/contact",
  "/guides",
] as const;

/** Screens that must never serve ads (thin/utility/transactional). */
export const AD_BLOCKED_PREFIXES = [
  "/auth",
  "/reset-password",
  "/dashboard",
  "/admin",
  "/workspace",
  "/oauth",
  "/premium",
  "/launch",
] as const;

export const isAdRoute = (pathname: string): boolean => {
  if (AD_BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return false;
  }
  // Tool pages that ship a full long-form guide count as content-rich.
  if (hasRichContent(pathname)) return true;
  return AD_ALLOWED_ROUTES.some((p) => pathname === p || pathname.startsWith(p === "/" ? "//" : p + "/"));
};


const SCRIPT_ID = "adsbygoogle-js";

export const isAdsenseScriptLoaded = (): boolean =>
  typeof document !== "undefined" &&
  (!!document.getElementById(SCRIPT_ID) ||
    !!document.querySelector('script[src*="adsbygoogle.js"]'));

/**
 * Injects the AdSense script once — only from an allow-listed route AND only
 * after the visitor granted marketing consent. Returns true when the script
 * is present after the call.
 */
export const ensureAdsenseLoaded = (pathname?: string): boolean => {
  if (typeof document === "undefined") return false;
  const route = pathname ?? window.location.pathname;

  if (!isAdRoute(route)) {
    logAdPolicy("skipped_route_blocked", { route, reason: "route not allow-listed" });
    return false;
  }
  if (!hasMarketingConsent()) {
    logAdPolicy("skipped_no_consent", { route, reason: "marketing consent not granted" });
    return false;
  }
  if (isAdsenseScriptLoaded()) {
    logAdPolicy("script_already_loaded", { route });
    return true;
  }

  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(s);
  logAdPolicy("script_injected", { route });
  return true;
};

