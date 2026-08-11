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
  return AD_ALLOWED_ROUTES.some((p) => pathname === p || pathname.startsWith(p === "/" ? "//" : p + "/"));
};

const SCRIPT_ID = "adsbygoogle-js";

/** Injects the AdSense script once, only when called from an allow-listed route. */
export const ensureAdsenseLoaded = (): void => {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(s);
};
