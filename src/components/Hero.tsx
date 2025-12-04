import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Merge, Split, Minimize2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))]">
      <div className="container mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <p className="text-accent font-semibold text-lg mb-4 tracking-wide">Welcome to Your PDF Hub</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              ✨ All-in-One PDF & Document Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Convert, merge, split, compress, and edit your files online with ease.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="p-4 bg-card/50 rounded-xl border border-border">
                <span className="text-2xl mb-2 block">🚀</span>
                <h3 className="font-semibold text-foreground mb-1">Fast, Simple, Free</h3>
                <p className="text-sm text-muted-foreground">No downloads, no hassle – just upload and get the job done in seconds.</p>
              </div>
              <div className="p-4 bg-card/50 rounded-xl border border-border">
                <span className="text-2xl mb-2 block">🔒</span>
                <h3 className="font-semibold text-foreground mb-1">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">Your files are processed safely, and privacy is always protected.</p>
              </div>
              <div className="p-4 bg-card/50 rounded-xl border border-border">
                <span className="text-2xl mb-2 block">🌍</span>
                <h3 className="font-semibold text-foreground mb-1">Access Anywhere</h3>
                <p className="text-sm text-muted-foreground">Work on your documents anytime, anywhere – desktop, tablet, or mobile.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg group" asChild>
                <Link to="/merge">
                  Get Started Now
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

              <Link 
                to="/split"
                className="group p-6 bg-card border border-border rounded-2xl hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Split className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Split PDF</h3>
                <p className="text-sm text-muted-foreground">Extract specific pages</p>
              </Link>

              <Link 
                to="/compress"
                className="group p-6 bg-card border border-border rounded-2xl hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Minimize2 className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Compress PDF</h3>
                <p className="text-sm text-muted-foreground">Reduce file size</p>
              </Link>

              <Link 
                to="/convert"
                className="group p-6 bg-card border border-border rounded-2xl hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <FileText className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Convert PDF</h3>
                <p className="text-sm text-muted-foreground">To images or text</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
