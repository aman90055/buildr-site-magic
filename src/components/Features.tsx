import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Shield, Sparkles, FileSearch, Bot, Lock, Globe } from "lucide-react";
import AIBadge from "./AIBadge";

const features = [
  {
    icon: Brain,
    title: "AI Document Understanding",
    description: "Our AI reads and understands your documents, automatically detecting structure, tables, and key information.",
    badge: "AI",
    color: "from-brand-ai to-brand-purple",
  },
  {
    icon: FileSearch,
    title: "Smart OCR Technology",
    description: "Extract text from any scanned document or image with 99.9% accuracy using advanced neural networks.",
    badge: "AI",
    color: "from-brand-cyan to-brand-blue",
  },
  {
    icon: Bot,
    title: "AI PDF Assistant",
    description: "Chat with your documents. Ask questions, get summaries, and extract insights instantly.",
    badge: "AI",
    color: "from-brand-purple to-brand-pink",
  },
  {
    icon: Zap,
    title: "Lightning Processing",
    description: "Process documents in milliseconds with our optimized cloud infrastructure. No waiting, instant results.",
    color: "from-brand-orange to-brand-pink",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "256-bit SSL encryption, automatic file deletion after processing. Your documents never leave secure servers.",
    color: "from-brand-green to-brand-cyan",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Access from any device, any browser. No downloads, no installations. Just upload and go.",
    color: "from-brand-blue to-brand-purple",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-ai" />
            <span className="text-brand-ai font-display font-medium text-sm uppercase tracking-wider">2026 AI Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
            Supercharged with{" "}
            <span className="text-gradient-ai">Artificial Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Every tool is enhanced with AI to give you faster, smarter, and more accurate results than ever before.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group glass-card border-0 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 relative">
                {/* Gradient line at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  {feature.badge && <AIBadge variant="small" />}
                </div>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
