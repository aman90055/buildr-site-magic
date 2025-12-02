import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Merge, Split, Minimize2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))]">
      <div className="container mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              PDF Tools Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Merge, split, compress, and convert PDF files with ease. Fast, secure, and free to use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg group" asChild>
                <Link to="/merge">
                  Merge PDFs
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                View All Tools
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/merge"
                className="group p-6 bg-card border border-border rounded-2xl hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Merge className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Merge PDF</h3>
                <p className="text-sm text-muted-foreground">Combine multiple PDFs into one</p>
              </Link>

              <div className="p-6 bg-card border border-border rounded-2xl opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <Split className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Split PDF</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>

              <div className="p-6 bg-card border border-border rounded-2xl opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <Minimize2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Compress PDF</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>

              <div className="p-6 bg-card border border-border rounded-2xl opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Convert PDF</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
