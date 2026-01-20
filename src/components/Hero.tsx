import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Merge, Split, Minimize2, Sparkles, Brain, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import AIBadge from "./AIBadge";

const tools = [
  { to: "/merge", icon: Merge, label: "Merge PDF", desc: "AI-optimized combining", color: "bg-brand-blue", ai: true },
  { to: "/split", icon: Split, label: "Split PDF", desc: "Smart page detection", color: "bg-brand-green", ai: true },
  { to: "/compress", icon: Minimize2, label: "Compress PDF", desc: "AI compression engine", color: "bg-brand-purple", ai: true },
  { to: "/convert", icon: FileText, label: "Convert PDF", desc: "Multi-format AI conversion", color: "bg-brand-orange", ai: true },
];

const features = [
  { icon: Brain, title: "AI-Powered", desc: "Next-gen document intelligence", color: "text-brand-ai" },
  { icon: Zap, title: "Lightning Fast", desc: "Process in milliseconds", color: "text-brand-cyan" },
  { icon: Shield, title: "Bank-Grade Security", desc: "End-to-end encryption", color: "text-brand-green" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-brand-ai/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-accent/20 via-brand-purple/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-accent/5 to-brand-ai/5 rounded-full blur-3xl animate-spin-slow opacity-50" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="container relative mx-auto px-6 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* 2026 Badge */}
            <div className="inline-flex items-center gap-3 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span className="font-display">2026 Edition</span>
              </div>
              <AIBadge />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Next-Gen PDF Tools{" "}
              <span className="text-gradient-ai block mt-2">Powered by AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-in font-light" style={{ animationDelay: "0.2s" }}>
              Experience the future of document processing. Our AI understands your PDFs 
              and optimizes every action for perfect results.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="font-medium text-foreground">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button size="lg" className="text-base shadow-cta group bg-gradient-ai hover:opacity-90 transition-opacity h-14 px-8 rounded-2xl font-display font-semibold" asChild>
                <Link to="/merge">
                  Start Free with AI
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base h-14 px-8 rounded-2xl glass border-border hover:bg-muted/50 font-display" asChild>
                <a href="#tools">Explore All Tools</a>
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="flex items-center gap-8 pt-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-foreground">2M+</div>
                <div className="text-xs text-muted-foreground">PDFs Processed</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-foreground">99.9%</div>
                <div className="text-xs text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-foreground">150+</div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          {/* Right - Tool Cards */}
          <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
            {tools.map((tool, i) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group relative p-6 glass-card rounded-3xl hover:shadow-card-hover transition-all duration-500 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                {/* AI Badge */}
                {tool.ai && (
                  <div className="absolute top-3 right-3">
                    <AIBadge variant="small" glow={false} />
                  </div>
                )}
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-ai opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl" />
                
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <tool.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tool.label}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                
                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
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
