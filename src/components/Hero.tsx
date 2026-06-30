import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Merge, Split, Minimize2, Sparkles, Lightbulb, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import AIBadge from "./AIBadge";
import { trackCTA, trackToolCard } from "@/lib/analytics";

const tools = [
  { to: "/merge", icon: Merge, label: "Merge PDF", desc: "AI-optimized combining", color: "bg-brand-blue", glow: "hsl(var(--brand-blue))", ai: true },
  { to: "/split", icon: Split, label: "Split PDF", desc: "Smart page detection", color: "bg-brand-green", glow: "hsl(var(--brand-green))", ai: true },
  { to: "/compress", icon: Minimize2, label: "Compress PDF", desc: "AI compression engine", color: "bg-brand-purple", glow: "hsl(var(--brand-purple))", ai: true },
  { to: "/convert", icon: FileText, label: "Convert PDF", desc: "Multi-format AI conversion", color: "bg-brand-orange", glow: "hsl(var(--brand-orange))", ai: true },
];

const features = [
  { icon: Lightbulb, title: "Smart Automation", color: "text-brand-ai" },
  { icon: Zap, title: "Fast Processing", color: "text-brand-cyan" },
  { icon: Shield, title: "Enterprise-Grade Security", color: "text-brand-green" },
  { icon: Globe, title: "Mobile Optimized", color: "text-brand-purple" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center" aria-label="PDF Tools Hero - Free Online PDF Editor">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-brand-ai/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-accent/20 via-brand-purple/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-accent/5 to-brand-ai/5 rounded-full blur-3xl animate-spin-slow opacity-50" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Sparkle pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-primary/30 text-xs sm:text-sm animate-fade-in shadow-[0_0_24px_hsl(var(--primary)/0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-brand-ai animate-pulse" />
              <span className="font-medium bg-gradient-to-r from-primary via-brand-ai to-accent bg-clip-text text-transparent">
                The 2026 AI Document Suite
              </span>
            </div>

            <h1
              className="relative text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold tracking-tight animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="bg-[linear-gradient(120deg,hsl(var(--foreground)),hsl(var(--primary)),hsl(var(--brand-ai)),hsl(var(--accent)),hsl(var(--primary)))] bg-[length:300%_300%] bg-clip-text text-transparent animate-gradient-shift drop-shadow-[0_2px_18px_hsl(var(--primary)/0.35)]">
                One Platform for PDFs, AI, Documents, Images &amp; Productivity
              </span>
              <span aria-hidden className="absolute -bottom-2 left-0 h-1 w-24 sm:w-32 rounded-full bg-gradient-to-r from-primary via-brand-ai to-accent blur-[2px] opacity-80" />
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-in font-light" style={{ animationDelay: "0.2s" }}>
              Document Edit Pro AI helps individuals, students, professionals, and
              businesses manage documents smarter. Edit, convert, organize,
              summarize, sign, and collaborate using 100+ powerful tools — all from
              a single modern workspace.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-card text-xs sm:text-sm">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="font-medium text-foreground whitespace-nowrap">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button size="lg" className="text-base shadow-cta group bg-gradient-ai hover:opacity-90 transition-opacity h-12 sm:h-14 px-6 sm:px-8 rounded-2xl font-display font-semibold w-full sm:w-auto" asChild>
                <Link to="/auth?next=/merge" onClick={() => trackCTA("Start Free Now", "hero", "/auth")}>
                  Start Free Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

              </Button>
              <Button size="lg" variant="outline" className="text-base h-12 sm:h-14 px-6 sm:px-8 rounded-2xl glass border-border hover:bg-muted/50 font-display w-full sm:w-auto" asChild>
                <a href="#tools" onClick={() => trackCTA("Explore All Tools", "hero", "#tools")}>Explore All Tools</a>
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-2 sm:pt-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-display font-bold text-foreground">2M+</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground">PDFs Processed</div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-border" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-display font-bold text-foreground">99.9%</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-border" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-display font-bold text-foreground">150+</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          {/* Right - Tool Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-in-right">
            {tools.map((tool, i) => (
              <Link
                key={tool.to}
                to={tool.to}
                onClick={() => trackToolCard(tool.label.toLowerCase().replace(/\s+/g, "_"), "hero")}
                className="group relative p-4 sm:p-6 glass-card rounded-2xl sm:rounded-3xl hover:shadow-card-hover transition-all duration-500 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                {/* AI Badge */}
                {tool.ai && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <AIBadge variant="small" glow={false} />
                  </div>
                )}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-ai opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                <div className={`w-11 h-11 sm:w-14 sm:h-14 ${tool.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <tool.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  {tool.label}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{tool.desc}</p>

                {/* Arrow indicator */}
                <div className="mt-3 sm:mt-4 hidden sm:flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                  <span className="text-sm font-medium">Try now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
