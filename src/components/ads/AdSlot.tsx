import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ADSENSE_CLIENT, ADS_ENABLED, type AdSlotConfig, type AdFormat } from "@/lib/adSlots";
import { isAdRoute, ensureAdsenseLoaded } from "@/lib/adsRoutes";
import { isAdsEnabled } from "@/lib/siteSettings";
import { trackAdEvent } from "@/lib/adAnalytics";
import { hasMarketingConsent, onConsentChange } from "@/lib/adConsent";
import { logAdPolicy } from "@/lib/adPolicyLog";



interface AdSlotProps {
  /** Either pass a full config object (preferred) or just a slot id + format */
  config?: AdSlotConfig;
  adSlot?: string;
  adFormat?: AdFormat;
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Hide the "Advertisement" label (default: shown — required for AdSense policy compliance) */
  hideLabel?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSlot = ({
  config,
  adSlot,
  adFormat,
  layoutKey,
  fullWidthResponsive,
  className = "",
  style,
  hideLabel = false,
}: AdSlotProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const { pathname } = useLocation();
  const allowedHere = isAdRoute(pathname);
  const [consented, setConsented] = useState<boolean>(() => hasMarketingConsent());

  const slot = config?.slot ?? adSlot ?? "";
  const format: AdFormat = config?.format ?? adFormat ?? "auto";
  const lkey = config?.layoutKey ?? layoutKey;
  const fwr = config?.fullWidthResponsive ?? fullWidthResponsive;
  const minH = config?.minHeight;

  // React to consent granted/revoked without a reload.
  useEffect(() => onConsentChange(() => setConsented(hasMarketingConsent())), []);

  useEffect(() => {
    if (!ADS_ENABLED) {
      logAdPolicy("skipped_ads_disabled", { route: pathname, slot, reason: "ADS_ENABLED=false" });
      return;
    }
    if (!allowedHere) {
      logAdPolicy("unit_suppressed", { route: pathname, slot, reason: "route not allow-listed" });
      return;
    }
    if (!consented) {
      logAdPolicy("unit_suppressed", { route: pathname, slot, reason: "no marketing consent" });
      return;
    }
    if (pushed.current || !slot) return;
    // Load the AdSense script on demand — allow-listed route + consent only.
    if (!ensureAdsenseLoaded(pathname)) return;
    logAdPolicy("unit_rendered", { route: pathname, slot });
    const tryPush = (attempt = 0) => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        } else if (attempt < 10) {
          setTimeout(() => tryPush(attempt + 1), 500);
        }
      } catch (err) {
        console.warn("AdSense push failed:", err);
      }
    };
    tryPush();


    // Impression tracking — fire when slot first scrolls into view.
    const el = adRef.current;
    if (!el) return;
    let impressionFired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !impressionFired) {
            impressionFired = true;
            trackAdEvent("adsense", slot, "impression");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    const onClick = () => trackAdEvent("adsense", slot, "click");
    el.addEventListener("click", onClick, true);

    return () => {
      io.disconnect();
      el.removeEventListener("click", onClick, true);
    };
  }, [slot, allowedHere, consented, pathname]);

  // Global kill-switch: while AdSense review is pending, render no ad UI at all.
  if (!ADS_ENABLED) return null;
  // Owner-tunable runtime switch (Admin Dashboard → Settings).
  if (!isAdsEnabled()) return null;

  // Policy: ads only on content-rich, allow-listed routes (single source of truth
  // in src/lib/adsRoutes.ts). Prevents ads on screens without publisher content.
  if (!allowedHere) return null;

  // Consent gate: nothing ad-related renders until marketing consent is granted.
  if (!consented) return null;



  const isPlaceholder =
    !slot ||
    /^(1234|2345|3456|4567|5678|6789|7890|0000)/.test(slot) ||
    slot.length < 8;
  if (isPlaceholder) return null;

  const insStyle: React.CSSProperties =
    format === "in-article"
      ? { display: "block", textAlign: "center", ...style }
      : { display: "block", ...style };

  const dataAttrs: Record<string, string> = {
    "data-ad-client": ADSENSE_CLIENT,
    "data-ad-slot": slot,
  };

  if (format === "in-article") {
    dataAttrs["data-ad-layout"] = "in-article";
    dataAttrs["data-ad-format"] = "fluid";
  } else if (format === "fluid") {
    dataAttrs["data-ad-format"] = "fluid";
    if (lkey) dataAttrs["data-ad-layout-key"] = lkey;
  } else if (format === "autorelaxed") {
    dataAttrs["data-ad-format"] = "autorelaxed";
  } else {
    dataAttrs["data-ad-format"] = format;
    if (fwr) dataAttrs["data-full-width-responsive"] = "true";
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`ad-container flex flex-col items-center justify-center my-10 border-y border-border/60 bg-muted/20 py-6 ${className}`}
      style={minH ? { minHeight: minH } : undefined}
    >
      {!hideLabel && (
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-1 select-none">
          Advertisement
        </span>
      )}
      <ins ref={adRef} className="adsbygoogle w-full" style={insStyle} {...dataAttrs} />
    </aside>
  );
};

export default AdSlot;
