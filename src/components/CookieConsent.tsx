import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "cookie-consent";

type ConsentState = {
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  timestamp: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function saveConsent(state: Omit<ConsentState, "timestamp">) {
  const payload: ConsentState = { ...state, timestamp: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
  window.gtag?.("consent", "update", state);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    setVisible(false);
  };

  const essentialOnly = () => {
    saveConsent({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[9999] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md"
    >
      <div className="rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold">We value your privacy</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to run the site, measure usage, and — with your
              permission — show personalized ads via Google AdSense. Read our{" "}
              <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link> and{" "}
              <Link to="/cookies" className="underline hover:text-foreground">Cookie Policy</Link>.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={acceptAll} className="text-xs">
                Accept all
              </Button>
              <Button size="sm" variant="outline" onClick={essentialOnly} className="text-xs">
                Essential only
              </Button>
              <Button size="sm" variant="ghost" onClick={rejectAll} className="text-xs">
                Reject all
              </Button>
            </div>
          </div>
          <button
            onClick={rejectAll}
            aria-label="Close cookie banner"
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
