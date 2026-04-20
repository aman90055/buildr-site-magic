import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, type AdSlotConfig, type AdFormat } from "@/lib/adSlots";

interface AdSlotProps {
  /** Either pass a full config object (preferred) or just a slot id + format */
  config?: AdSlotConfig;
  adSlot?: string;
  adFormat?: AdFormat;
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
}: AdSlotProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  // Resolve effective values from config or props
  const slot = config?.slot ?? adSlot ?? "";
  const format: AdFormat = config?.format ?? adFormat ?? "auto";
  const lkey = config?.layoutKey ?? layoutKey;
  const fwr = config?.fullWidthResponsive ?? fullWidthResponsive;
  const minH = config?.minHeight;

  useEffect(() => {
    if (pushed.current || !slot) return;
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
  }, [slot]);

  // Skip render if no slot or obvious placeholder
  const isPlaceholder =
    !slot ||
    /^(1234|2345|3456|4567|5678|6789|7890|0000)/.test(slot) ||
    slot.length < 8;
  if (isPlaceholder) return null;

  // Build the ins attributes based on format
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
    // auto / horizontal / rectangle / vertical
    dataAttrs["data-ad-format"] = format;
    if (fwr) dataAttrs["data-full-width-responsive"] = "true";
  }

  return (
    <div
      className={`ad-container flex items-center justify-center ${className}`}
      style={minH ? { minHeight: minH } : undefined}
    >
      <ins ref={adRef} className="adsbygoogle" style={insStyle} {...dataAttrs} />
    </div>
  );
};

export default AdSlot;
