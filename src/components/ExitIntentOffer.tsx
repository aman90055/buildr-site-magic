import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Exit-intent modal — converts leaving traffic into Premium / donations.
 * Triggers on desktop mouse-leave or mobile rapid scroll-up.
 * Once-per-session.
 */
const ExitIntentOffer = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exit-offer-shown")) return;

    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;

    const trigger = () => {
      if (sessionStorage.getItem("exit-offer-shown")) return;
      sessionStorage.setItem("exit-offer-shown", "1");
      setShow(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    const onScroll = () => {
      const dy = window.scrollY - lastScrollY;
      if (dy < -50) {
        scrollUpCount += 1;
        if (scrollUpCount >= 3) trigger();
      } else if (dy > 0) {
        scrollUpCount = 0;
      }
      lastScrollY = window.scrollY;
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={() => setShow(false)}
    >
      <div
        className="relative w-full max-w-md bg-background border border-border rounded-2xl p-6 shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          aria-label="Close offer"
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold">Wait! Before you go...</h3>
          <p className="text-muted-foreground">
            Unlock <span className="text-foreground font-semibold">Premium</span> for unlimited fast processing,
            no ads, and priority AI access — or support us with a coffee ☕
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button asChild size="lg" className="w-full">
              <Link to="/premium">
                <Zap className="h-4 w-4 mr-2" />
                Go Premium
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <a
                href="https://buymeacoffee.com/amanvishwakarma"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Donate
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            ❤️ Made in India · Trusted by millions
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentOffer;
