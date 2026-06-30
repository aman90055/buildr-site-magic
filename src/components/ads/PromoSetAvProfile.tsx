import { ExternalLink, Sparkles } from "lucide-react";

interface PromoSetAvProfileProps {
  className?: string;
}

const PromoSetAvProfile = ({ className = "" }: PromoSetAvProfileProps) => {
  return (
    <section className={`w-full ${className}`} aria-label="Sponsored promotion">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 text-center">
          Sponsored
        </p>

        <a
          href="https://set-av-profile.vercel.app/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative block overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.01] hover:border-white/25 hover:shadow-[0_12px_48px_rgba(56,189,248,0.25)]"
        >
          {/* Gradient glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-fuchsia-500/15" />
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl group-hover:bg-cyan-400/30 transition-colors" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl group-hover:bg-fuchsia-400/30 transition-colors" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 sm:p-7">
            {/* Icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 border border-white/15 text-foreground/80">
                  New
                </span>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Set AV Profile
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create a stunning developer profile in seconds — beautiful, shareable, and 100% free.
                Showcase your skills, projects, and social presence with a single link.
              </p>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold text-foreground group-hover:bg-white/20 group-hover:border-white/30 transition-all">
                Visit Site
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default PromoSetAvProfile;
