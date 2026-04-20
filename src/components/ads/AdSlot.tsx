import { useEffect, useRef } from "react";

interface AdSlotProps {
  adSlot?: string;
  adFormat?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSlot = ({ adSlot, adFormat = "auto", className = "", style }: AdSlotProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !adSlot) return;
    // Retry pushing until adsbygoogle script is loaded
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
  }, [adSlot]);

  // If no AdSense slot configured, render nothing (avoids empty ad calls with fake IDs)
  // Real slot IDs from AdSense are typically 10 digits; placeholders we used start with 1234.. etc.
  const isPlaceholder =
    !adSlot ||
    /^(1234|2345|3456|4567|5678|6789|7890|0000)/.test(adSlot) ||
    adSlot.length < 8;
  if (isPlaceholder) {
    return null;
  }

  return (
    <div className={`ad-container flex items-center justify-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-4830449684268109"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
