import { ExternalLink, Sparkles, Rocket, Palette, type LucideIcon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface PromoCard {
  id: string;
  badge?: string;
  title: string;
  description: string;
  url: string;
  cta: string;
  icon: LucideIcon;
  accent: string; // tailwind gradient classes for icon bg
  glow: string; // tailwind class for blob color
}

const defaultCards: PromoCard[] = [
  {
    id: "set-av-profile",
    badge: "New",
    title: "Set AV Profile",
    description:
      "Create a stunning developer profile in seconds — beautiful, shareable, and 100% free. Showcase skills, projects, and socials with one link.",
    url: "https://set-av-profile.vercel.app/",
    cta: "Visit Site",
    icon: Sparkles,
    accent: "from-cyan-400 to-blue-600 shadow-cyan-500/30",
    glow: "bg-cyan-400/20",
  },
  {
    id: "build-with-lovable",
    badge: "Featured",
    title: "Build with Lovable",
    description:
      "Spin up production-ready apps with AI. From idea to deployed product in minutes — no boilerplate, no setup.",
    url: "https://lovable.dev/",
    cta: "Try Free",
    icon: Rocket,
    accent: "from-fuchsia-400 to-pink-600 shadow-fuchsia-500/30",
    glow: "bg-fuchsia-400/20",
  },
  {
    id: "design-tools",
    badge: "Popular",
    title: "Design Toolkit",
    description:
      "Free icons, palettes, gradients, and UI inspiration to ship beautiful interfaces faster than ever.",
    url: "https://www.canva.com/",
    cta: "Explore",
    icon: Palette,
    accent: "from-amber-400 to-orange-600 shadow-orange-500/30",
    glow: "bg-amber-400/20",
  },
];

interface PromoCardsProps {
  className?: string;
  cards?: PromoCard[];
  location?: string;
  heading?: string;
}

const PromoCards = ({
  className = "",
  cards = defaultCards,
  location = "home",
  heading = "Sponsored",
}: PromoCardsProps) => {
  const handleClick = (card: PromoCard, index: number) => {
    const isBrowser = typeof window !== "undefined";
    const width = isBrowser ? window.innerWidth : 0;
    const device = width === 0 ? "unknown" : width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
    trackEvent("promo_card_click", {
      promo_id: card.id,
      promo_title: card.title,
      href: card.url,
      location,
      index,
      device,
      viewport_width: width,
      page_url: isBrowser ? window.location.href : "",
      page_path: isBrowser ? window.location.pathname : "",
      referrer: isBrowser ? document.referrer : "",
    });
  };

  return (
    <section className={`w-full ${className}`} aria-label="Sponsored promotions">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 text-center">
          {heading}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch justify-items-stretch">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => handleClick(card, index)}
                onAuxClick={(e) => {
                  if (e.button === 1) handleClick(card, index);
                }}
                className="group relative flex h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] hover:border-white/25 hover:shadow-[0_12px_48px_rgba(56,189,248,0.2)]"
                data-promo-id={card.id}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
                <div
                  className={`pointer-events-none absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-40 h-40 sm:w-56 sm:h-56 rounded-full blur-3xl transition-colors ${card.glow} group-hover:opacity-80`}
                />
                <div
                  className={`pointer-events-none absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 w-40 h-40 sm:w-56 sm:h-56 rounded-full blur-3xl opacity-60 ${card.glow}`}
                />

                <div className="relative flex flex-col gap-4 p-5 sm:p-6 h-full w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div
                      className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    {card.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 border border-white/15 text-foreground/80">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 break-words">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words">
                      {card.description}
                    </p>
                  </div>

                  <span className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold text-foreground group-hover:bg-white/20 group-hover:border-white/30 transition-all w-full sm:w-fit">

          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => handleClick(card)}
                onAuxClick={(e) => {
                  if (e.button === 1) handleClick(card);
                }}
                className="group relative block overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] hover:border-white/25 hover:shadow-[0_12px_48px_rgba(56,189,248,0.2)]"
                data-promo-id={card.id}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
                <div
                  className={`pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl transition-colors ${card.glow} group-hover:opacity-80`}
                />
                <div
                  className={`pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-60 ${card.glow}`}
                />

                <div className="relative flex flex-col gap-4 p-6 h-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {card.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 border border-white/15 text-foreground/80">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <span className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold text-foreground group-hover:bg-white/20 group-hover:border-white/30 transition-all w-fit">
                    {card.cta}
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoCards;
