import AnimatedCounter from "./AnimatedCounter";
import { FileCheck2, LayoutGrid, Laptop, BadgeIndianRupee } from "lucide-react";
import { TOOL_COUNT, CATEGORY_META } from "@/lib/toolRegistry";

const CATEGORY_COUNT = Object.keys(CATEGORY_META).length;

/** Counters only for numbers we can verify from the codebase itself. */
const stats = [
  { icon: FileCheck2, end: TOOL_COUNT, suffix: "", label: "Tools in the suite", color: "text-brand-blue" },
  { icon: LayoutGrid, end: CATEGORY_COUNT, suffix: "", label: "Tool categories", color: "text-brand-purple" },
  { icon: Laptop, end: 0, suffix: "", label: "Uploads for in-browser tools", color: "text-brand-cyan" },
  { icon: BadgeIndianRupee, end: 0, suffix: "", label: "Cost, in rupees", color: "text-brand-ai" },
];

const AnimatedStatsSection = () => {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden" aria-label="Platform capabilities">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-ai/5 pointer-events-none" />
      <div className="container relative mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground via-primary to-brand-ai bg-clip-text text-transparent">
            One suite, every document job
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Numbers taken straight from our tool catalogue — nothing inflated.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
            >
              <s.icon className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 ${s.color}`} />
              <div className="text-3xl sm:text-4xl font-display font-extrabold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                <AnimatedCounter end={s.end} suffix={s.suffix} decimals={0} />
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
