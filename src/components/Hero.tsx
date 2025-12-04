import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Merge, Split, Minimize2, Sparkles, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  { to: "/merge", icon: Merge, label: "Merge PDF", desc: "Combine multiple PDFs", color: "bg-brand-blue" },
  { to: "/split", icon: Split, label: "Split PDF", desc: "Extract specific pages", color: "bg-brand-green" },
  { to: "/compress", icon: Minimize2, label: "Compress PDF", desc: "Reduce file size", color: "bg-brand-purple" },
  { to: "/convert", icon: FileText, label: "Convert PDF", desc: "To images or text", color: "bg-brand-orange" },
];

const features = [
  { icon: Sparkles, title: "Fast & Simple", desc: "No downloads, just upload and get the job done in seconds.", color: "text-brand-blue" },
  { icon: Shield, title: "Secure & Reliable", desc: "Your files are processed safely with privacy protected.", color: "text-brand-green" },
  { icon: Globe, title: "Access Anywhere", desc: "Work on documents anytime – desktop, tablet, or mobile.", color: "text-brand-purple" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Welcome to Your PDF Hub
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              All-in-One PDF &{" "}
              <span className="text-gradient">Document Tools</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Convert, merge, split, compress, and edit your files online with ease. 
              Simple, fast, and completely free.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span>{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button size="lg" className="text-base shadow-cta group" asChild>
                <Link to="/merge">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <a href="#tools">View All Tools</a>
              </Button>
            </div>
          </div>

          {/* Right - Tool Cards */}
          <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
            {tools.map((tool, i) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group p-6 bg-card border border-border rounded-2xl hover:shadow-card-hover hover:border-transparent transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {tool.label}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
