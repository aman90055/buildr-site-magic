import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Merge, Split, Minimize2 } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  { to: "/merge", icon: Merge, label: "Merge" },
  { to: "/split", icon: Split, label: "Split" },
  { to: "/compress", icon: Minimize2, label: "Compress" },
  { to: "/convert", icon: FileText, label: "Convert" },
];

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Upload your first file and experience the easiest way to manage PDFs.
          </p>
          
          {/* Quick access tools */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {tools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="text-base shadow-cta group" asChild>
              <Link to="/merge">
                Start Now – It's Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
