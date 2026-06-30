import { useEffect, useRef, useState } from "react";
import { isAdsterraEnabled } from "@/lib/siteSettings";
import { trackAdEvent } from "@/lib/adAnalytics";

/**
 * Wires an ad container to track impressions (on mount + intersection)
 * and clicks (any click bubbling up from the iframe/anchor).
 */
const useAdTracking = (
  ref: React.RefObject<HTMLDivElement>,
  placement: string,
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let impressionFired = false;
    const fireImpression = () => {
      if (impressionFired) return;
      impressionFired = true;
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

/** Responsive Adsterra Native — works on every breakpoint (container based). */
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
      "//pl29713522.effectivecpmnetwork.com/155691d0aff80d6fc9b1187a19ffefe3/invoke.js";
    ref.current.appendChild(s);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="my-6 flex justify-center w-full overflow-hidden">
      <div id="container-155691d0aff80d6fc9b1187a19ffefe3" />
    </div>
  );
};

/** Adsterra 728×90 iframe banner — desktop only. */
const AdsterraBanner728Inner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  useAdTracking(ref, "banner-728x90");

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;
    const cfg = document.createElement("script");
    cfg.text = `atOptions = { 'key':'c9ba4b0fe96b924859e1b8da1f258722','format':'iframe','height':90,'width':728,'params':{} };`;
    const inv = document.createElement("script");
    inv.src =
      "//www.highperformanceformat.com/c9ba4b0fe96b924859e1b8da1f258722/invoke.js";
    ref.current.appendChild(cfg);
    ref.current.appendChild(inv);
  }, []);

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center w-full overflow-hidden"
      style={{ minHeight: 90 }}
    />
  );
};

/**
 * Responsive Adsterra banner.
 * - Desktop (≥768px) → 728×90 iframe
 * - Mobile/Tablet (<768px) → Native banner (fluid)
 * Re-evaluates on resize so SPA navigation between breakpoints works.
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

/** Loads Social Bar + Popunder globally (once) — respects admin toggle. */
export const AdsterraGlobalScripts = () => {
  useEffect(() => {
    if (!isAdsterraEnabled()) return;
    const w = window as unknown as { __adsterraLoaded?: boolean };
    if (w.__adsterraLoaded) return;
    w.__adsterraLoaded = true;

    const urls = [
      "//pl29713523.effectivecpmnetwork.com/95/81/e8/9581e8ee045c8057cf31d3832cf5423a.js",
      "//pl29713521.effectivecpmnetwork.com/a3/b3/9f/a3b39ff884c02ad5a6a9e13e0b265ef1.js",
    ];
    urls.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    });

    // Treat global script load as a single impression for "social-bar".
    trackAdEvent("adsterra", "social-bar", "impression");
  }, []);

  return null;
};
