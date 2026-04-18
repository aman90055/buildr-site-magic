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
  if (!adSlot || adSlot.startsWith("123") || adSlot.startsWith("234") || adSlot.startsWith("345") || adSlot.startsWith("456") || adSlot.startsWith("567")) {
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
