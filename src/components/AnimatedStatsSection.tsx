import AnimatedCounter from "./AnimatedCounter";
import { Users, FileCheck2, Globe2, Star } from "lucide-react";

const stats = [
  { icon: FileCheck2, end: 2, suffix: "M+", label: "PDFs Processed", color: "text-brand-blue" },
  { icon: Users, end: 250, suffix: "K+", label: "Active Users", color: "text-brand-purple" },
  { icon: Globe2, end: 150, suffix: "+", label: "Countries Served", color: "text-brand-cyan" },
  { icon: Sparkles, end: 99.9, suffix: "%", decimals: 1, label: "Accuracy Rate", color: "text-brand-ai" },
];

const AnimatedStatsSection = () => {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden" aria-label="Platform statistics">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-ai/5 pointer-events-none" />
      <div className="container relative mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground via-primary to-brand-ai bg-clip-text text-transparent">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">Real numbers from a growing community.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
            >
              <s.icon className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 ${s.color}`} />
              <div className="text-3xl sm:text-4xl font-display font-extrabold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                <AnimatedCounter end={s.end} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStatsSection;
