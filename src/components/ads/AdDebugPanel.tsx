import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bug, ShieldCheck, ShieldAlert, X, Trash2 } from "lucide-react";
import { isAdRoute, isAdsenseScriptLoaded, AD_ALLOWED_ROUTES, AD_BLOCKED_PREFIXES } from "@/lib/adsRoutes";
import { hasMarketingConsent, onConsentChange } from "@/lib/adConsent";
import {
  getAdPolicyEvents,
  clearAdPolicyEvents,
  isAdDebugMode,
  setAdDebugMode,
  type AdPolicyEvent,
} from "@/lib/adPolicyLog";

/**
 * Optional in-app ad-policy debug panel.
 * Enable with ?adDebug=1 (persisted), disable with ?adDebug=0.
 */
const AdDebugPanel = () => {
  const { pathname } = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);
  const [events, setEvents] = useState<AdPolicyEvent[]>([]);
  const [consent, setConsent] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    setEnabled(isAdDebugMode());
  }, [pathname]);

  useEffect(() => {
    const sync = () => {
      setEvents(getAdPolicyEvents());
      setConsent(hasMarketingConsent());
      setScriptLoaded(isAdsenseScriptLoaded());
    };
    sync();
    window.addEventListener("ad-policy-log", sync);
    const offConsent = onConsentChange(sync);
    const id = window.setInterval(sync, 1500);
    return () => {
      window.removeEventListener("ad-policy-log", sync);
      offConsent();
      window.clearInterval(id);
    };
  }, [pathname]);

  const allowed = useMemo(() => isAdRoute(pathname), [pathname]);

  if (!enabled) return null;

  const Pill = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
        ok
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-destructive/40 bg-destructive/10 text-destructive"
      }`}
    >
      {ok ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
      {children}
    </span>
  );

  return (
    <div className="fixed left-3 bottom-3 z-[9998] w-[min(92vw,22rem)]">
      <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border/50 bg-gradient-to-r from-primary/15 via-transparent to-cyan-400/10 px-3 py-2">
          <Bug className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold tracking-wide">Ad policy debug</span>
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto text-[10px] text-muted-foreground hover:text-foreground"
          >
            {open ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => {
              setAdDebugMode(false);
              setEnabled(false);
            }}
            aria-label="Disable ad debug mode"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {open && (
          <div className="space-y-3 p-3">
            <div className="flex flex-wrap gap-1.5">
              <Pill ok={allowed}>{allowed ? "route allow-listed" : "route blocked"}</Pill>
              <Pill ok={consent}>{consent ? "marketing consent" : "no consent"}</Pill>
              <Pill ok={scriptLoaded}>{scriptLoaded ? "script injected" : "script blocked"}</Pill>
            </div>

            <p className="text-[10px] text-muted-foreground break-all">
              route: <span className="text-foreground">{pathname}</span>
            </p>

            <div className="rounded-xl border border-border/50 bg-muted/20 p-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Allow-list
              </p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {AD_ALLOWED_ROUTES.join("  ·  ")}
              </p>
              <p className="mt-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Blocked prefixes
              </p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {AD_BLOCKED_PREFIXES.join("  ·  ")}
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Recent gate events
                </p>
                <button
                  onClick={clearAdPolicyEvents}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-3 w-3" /> clear
                </button>
              </div>
              <ul className="max-h-40 space-y-1 overflow-y-auto text-[10px]">
                {events.length === 0 && (
                  <li className="text-muted-foreground">No events yet.</li>
                )}
                {events.map((e, i) => (
                  <li
                    key={`${e.ts}-${i}`}
                    className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/40 px-2 py-1"
                  >
                    <span className="tabular-nums text-muted-foreground">
                      {new Date(e.ts).toLocaleTimeString()}
                    </span>
                    <span
                      className={
                        e.decision.startsWith("skipped") ? "text-amber-500" : "text-primary"
                      }
                    >
                      {e.decision}
                    </span>
                    <span className="ml-auto truncate text-muted-foreground">{e.route}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdDebugPanel;
