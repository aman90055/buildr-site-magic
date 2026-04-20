import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdSlot from "./AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

/**
 * Mobile sticky bottom ad — high-revenue placement.
 * Closeable, hides on tool result/upload screens, hides on desktop.
 */
const StickyAd = () => {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("sticky-ad-closed");
    if (dismissed) return;
    const t = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!visible || closed || !AD_SLOTS.sticky) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur border-t border-border shadow-lg">
      <button
        onClick={() => {
          setClosed(true);
          sessionStorage.setItem("sticky-ad-closed", "1");
        }}
        aria-label="Close ad"
        className="absolute -top-3 right-2 bg-background border border-border rounded-full p-1 shadow-md"
      >
        <X className="h-3 w-3" />
      </button>
      <AdSlot adSlot={AD_SLOTS.sticky} adFormat="horizontal" style={{ minHeight: 60 }} />
    </div>
  );
};

export default StickyAd;
