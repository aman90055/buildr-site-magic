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
    if (pushed.current) return;
    try {
      if (window.adsbygoogle && adSlot) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded yet
    }
  }, [adSlot]);

  // If no AdSense slot configured, show a placeholder for affiliate/self-serve ads
  if (!adSlot) {
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
