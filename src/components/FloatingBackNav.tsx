import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const HISTORY_KEY = "app:navHistory";

const readHistory = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeHistory = (h: string[]) => {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  } catch {
    /* ignore */
  }
};

const FloatingBackNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const lastPath = useRef<string | null>(null);

  // Track in-app navigation history so Back knows the actual previous route.
  useEffect(() => {
    const current = location.pathname + location.search;
    if (lastPath.current === current) return;
    const h = readHistory();
    // If user hit browser Back (matches previous entry), pop the current one.
    if (h.length >= 2 && h[h.length - 2] === current) {
      h.pop();
    } else if (h[h.length - 1] !== current) {
      h.push(current);
    }
    // Cap history
    if (h.length > 50) h.splice(0, h.length - 50);
    writeHistory(h);
    lastPath.current = current;
  }, [location.pathname, location.search]);

  if (isHome) return null;

  const handleBack = () => {
    const h = readHistory();
    // Previous in-app entry is second-to-last (last is current).
    const prev = h.length >= 2 ? h[h.length - 2] : null;
    if (prev) {
      navigate(-1);
    } else {
      // No prior in-app page (deep link / direct load): go home instead of
      // leaving the site via browser back.
      navigate("/");
    }
  };

  return (
    <div
      className="fixed z-40 flex items-center gap-2 left-3 sm:left-6 bottom-3 sm:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Button
        variant="secondary"
        size="default"
        className="rounded-full shadow-lg glass-card gap-1.5 px-4 h-11 sm:h-10 min-w-[44px]"
        onClick={handleBack}
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden xs:inline sm:inline">Back</span>
      </Button>
      <Button
        variant="outline"
        size="default"
        className="rounded-full shadow-lg gap-1.5 px-4 h-11 sm:h-10 min-w-[44px]"
        onClick={() => navigate("/")}
        aria-label="Go to home"
      >
        <Home className="w-4 h-4" />
        <span className="hidden xs:inline sm:inline">Home</span>
      </Button>
    </div>
  );
};

export default FloatingBackNav;
