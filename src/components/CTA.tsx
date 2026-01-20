import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AIBadge from "./AIBadge";

const CTA = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary/10 via-brand-ai/10 to-accent/10 rounded-full blur-3xl animate-pulse-subtle" />
      
      <div className="container relative mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 mb-8 animate-fade-in">
            <AIBadge />
            <span className="text-muted-foreground font-medium">Free to use • No signup required</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Ready to Experience the{" "}
            <span className="text-gradient-ai">Future of PDFs?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Join millions of users who are already using our AI-powered tools to work smarter, not harder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="text-lg shadow-cta group bg-gradient-ai hover:opacity-90 transition-opacity h-16 px-10 rounded-2xl font-display font-semibold" asChild>
              <Link to="/merge">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free with AI
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Features List */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No file limits
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited processing
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              AI-powered tools
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Bank-grade security
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
