import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Upload, ArrowRight, CheckCircle, Zap, Shield, LucideIcon } from "lucide-react";
import AIBadge from "@/components/AIBadge";

interface ToolPageTemplateProps {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  color: string;
  isAI?: boolean;
  features: string[];
  howItWorks: string[];
  acceptedFormats?: string;
  category: string;
}

const ToolPageTemplate = ({
  title,
  description,
  metaTitle,
  metaDescription,
  icon: Icon,
  color,
  isAI = false,
  features,
  howItWorks,
  acceptedFormats = "PDF, DOC, DOCX, JPG, PNG",
  category,
}: ToolPageTemplateProps) => {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-24">
          {/* Hero */}
          <section className="py-16 md:py-24">
            <div className="container max-w-4xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {category}
                </Badge>
                {isAI && <AIBadge variant="inline" glow />}
              </div>

              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-6`}>
                <Icon className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {description}
              </p>

              {/* Upload Area */}
              <Card className="max-w-2xl mx-auto border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer bg-card/50 backdrop-blur-sm">
                <CardContent className="py-16 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Drop your files here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse • Supports {acceptedFormats}
                    </p>
                  </div>
                  <Button className="rounded-xl bg-gradient-ai hover:opacity-90 gap-2">
                    <Upload className="w-4 h-4" />
                    Select Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                {isAI && <Sparkles className="w-6 h-6 text-brand-ai inline mr-2" />}
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1">
                    <CardContent className="p-6 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm">{feature}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16">
            <div className="container max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="flex flex-col gap-6">
                {howItWorks.map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                    {i < howItWorks.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden md:block" />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust */}
          <section className="py-12 bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" /> 100% Secure
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" /> Lightning Fast
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-brand-ai" /> AI-Enhanced
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ToolPageTemplate;
