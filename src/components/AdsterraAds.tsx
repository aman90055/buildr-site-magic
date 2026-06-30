import { useEffect, useRef, useState } from "react";
import { isAdsterraEnabled } from "@/lib/siteSettings";
import { trackAdEvent } from "@/lib/adAnalytics";

/**
 * Impression (on intersection) + click tracking for any ad container.
 */
const useAdTracking = (
  ref: React.RefObject<HTMLDivElement>,
  placement: string,
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let fired = false;
    const fireImpression = () => {
      if (fired) return;
      fired = true;
      trackAdEvent("adsterra", placement, "impression");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            fireImpression();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    const onClick = () => trackAdEvent("adsterra", placement, "click");
    el.addEventListener("click", onClick, true);
    return () => {
      io.disconnect();
      el.removeEventListener("click", onClick, true);
    };
  }, [ref, placement]);
};

/* ------------------------------------------------------------------ */
/* Native banner (responsive, container based)                         */
/* ------------------------------------------------------------------ */
export const AdsterraNative = () => {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const enabled = isAdsterraEnabled();

  useAdTracking(ref, "native-banner");

  useEffect(() => {
    if (!enabled || loaded.current || !ref.current) return;
    loaded.current = true;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src =
      "//pl30135546.effectivecpmnetwork.com/7b86d1ea5986c2f007703310d325c14a/invoke.js";
    ref.current.appendChild(s);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="my-6 flex justify-center w-full overflow-hidden">
      <div id="container-7b86d1ea5986c2f007703310d325c14a" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Iframe banners (highperformanceformat.com)                          */
/* ------------------------------------------------------------------ */
interface IframeBannerConfig {
  adKey: string;
  width: number;
  height: number;
  placement: string;
}

const IframeBanner = ({ adKey, width, height, placement }: IframeBannerConfig) => {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  useAdTracking(ref, placement);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;
    const cfg = document.createElement("script");
    cfg.text = `atOptions = { 'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{} };`;
    const inv = document.createElement("script");
    inv.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    ref.current.appendChild(cfg);
    ref.current.appendChild(inv);
  }, [adKey, width, height]);

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center w-full overflow-hidden"
      style={{ minHeight: height, minWidth: width }}
    />
  );
};

/** 728×90 leaderboard — desktop. */
const AdsterraBanner728Inner = () => (
  <IframeBanner
    key="728"
    adKey="0808815f2478d610f9a03c21a2d74230"
    width={728}
    height={90}
    placement="banner-728x90"
  />
);

/** 300×250 medium rectangle — works on all breakpoints. */
export const AdsterraBanner300 = () => {
  const enabled = isAdsterraEnabled();
  if (!enabled) return null;
  return (
    <IframeBanner
      adKey="67ef1b077b40ae6bd633e096f153ebb9"
      width={300}
      height={250}
      placement="banner-300x250"
    />
  );
};

/** 160×300 small skyscraper — sidebar/mobile. */
export const AdsterraBanner160x300 = () => {
  const enabled = isAdsterraEnabled();
  if (!enabled) return null;
  return (
    <IframeBanner
      adKey="3c62615c74568e491d2fc840cd9a3290"
      width={160}
      height={300}
      placement="banner-160x300"
    />
  );
};

/** 160×600 wide skyscraper — desktop sidebar. */
export const AdsterraBanner160x600 = () => {
  const enabled = isAdsterraEnabled();
  if (!enabled) return null;
  return (
    <IframeBanner
      adKey="8e3a3573b6a8b37023e5e9e98f74a2a7"
      width={160}
      height={600}
      placement="banner-160x600"
    />
  );
};

/**
 * Responsive top banner.
 * - Desktop (≥768px) → 728×90 iframe
 * - Mobile/Tablet (<768px) → Native banner
 */
export const AdsterraBanner728 = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 768,
  );
  const enabled = isAdsterraEnabled();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!enabled) return null;
  return isDesktop ? <AdsterraBanner728Inner /> : <AdsterraNative />;
};

/* ------------------------------------------------------------------ */
/* Global Social Bar + Popunder scripts (load once per session)        */
/* ------------------------------------------------------------------ */
export const AdsterraGlobalScripts = () => {
  useEffect(() => {
    if (!isAdsterraEnabled()) return;
    const w = window as unknown as { __adsterraLoaded?: boolean };
    if (w.__adsterraLoaded) return;
    w.__adsterraLoaded = true;

    const urls = [
      // Social bar
      "//pl30135545.effectivecpmnetwork.com/a3/1c/e9/a31ce9fcb2bd1565e5197fad0fc2137b.js",
      // Popunder
      "//pl30135547.effectivecpmnetwork.com/29/10/fa/2910facd87554b229366214f60d47087.js",
    ];
    urls.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    });

    trackAdEvent("adsterra", "social-bar", "impression");
  }, []);

  return null;
};

/**
 * Adsterra "Smart" direct link — wrap any element/button with this
 * component to route the click to the smart-link offer URL.
 */
export const ADSTERRA_SMART_LINK =
  "https://www.effectivecpmnetwork.com/ixshsbtu1p?key=c6365c6b657fbd1fb4e84bce207a106b";
