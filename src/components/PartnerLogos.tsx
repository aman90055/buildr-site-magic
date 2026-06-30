import { Chrome, Github, Slack, Figma, Dribbble, Twitch, Youtube, Twitter } from "lucide-react";

const partners = [
  { icon: Chrome, name: "Chrome" },
  { icon: Github, name: "GitHub" },
  { icon: Slack, name: "Slack" },
  { icon: Figma, name: "Figma" },
  { icon: Dribbble, name: "Dribbble" },
  { icon: Twitch, name: "Twitch" },
  { icon: Youtube, name: "YouTube" },
  { icon: Twitter, name: "Twitter" },
];

const PartnerLogos = () => {
  return (
    <section className="py-12 sm:py-16 border-y border-border/40 bg-background/50" aria-label="Trusted by teams worldwide">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <p className="text-center text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-8 font-display">
          Loved by teams from companies using
        </p>
        <div className="relative overflow-hidden">
          <div className="flex gap-12 sm:gap-16 animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex items-center gap-2 text-muted-foreground/70 hover:text-foreground transition-colors shrink-0"
              >
                <p.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="font-display font-semibold text-base sm:text-lg">{p.name}</span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
