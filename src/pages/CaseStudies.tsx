import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialMeta from "@/components/SocialMeta";
import ShareButtons from "@/components/ShareButtons";
import { Card } from "@/components/ui/card";
import { Quote, TrendingUp } from "lucide-react";

const cases = [
  {
    company: "Acme Legal LLP",
    industry: "Legal",
    headline: "Cut contract review time by 68% with AI summarization",
    metrics: [
      { k: "68%", v: "Faster reviews" },
      { k: "12k", v: "Contracts / yr" },
      { k: "₹40L", v: "Saved annually" },
    ],
    quote:
      "Document Edit Pro AI replaced three tools and a junior reviewer's grunt-work. Our partners now spend time on judgement, not page-flipping.",
    author: "Managing Partner, Acme Legal",
  },
  {
    company: "Northstar University",
    industry: "Education",
    headline: "Issued 24,000 verified certificates in one semester",
    metrics: [
      { k: "24,000", v: "Certificates" },
      { k: "0", v: "Manual edits" },
      { k: "99.9%", v: "Delivery rate" },
    ],
    quote:
      "Bulk certificate generation that used to take a team of five and three weeks now finishes overnight, fully branded.",
    author: "Registrar, Northstar University",
  },
  {
    company: "Bluewave Finance",
    industry: "FinTech",
    headline: "Automated KYC document processing across 14 countries",
    metrics: [
      { k: "14", v: "Countries" },
      { k: "92%", v: "OCR accuracy gain" },
      { k: "5x", v: "Throughput" },
    ],
    quote:
      "The OCR + AI extraction stack handles every document format our customers throw at us. Onboarding dropped from days to minutes.",
    author: "Head of Operations, Bluewave Finance",
  },
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Case Studies — Document Edit Pro AI"
        description="Real customer stories: legal, education and fintech teams shipping faster with Document Edit Pro AI."
        path="/case-studies"
      />
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Case Studies
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Outcomes from real customers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              How legal, education and fintech teams use Document Edit Pro AI to ship faster
              and serve more users.
            </p>
          </div>
          <ShareButtons title="Case Studies — Document Edit Pro AI" />
        </div>

        <div className="space-y-6 mt-12">
          {cases.map((c) => (
            <Card key={c.company} className="p-8 glass-card">
              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  {c.industry}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-display font-semibold">{c.company}</span>
              </div>
              <h2 className="text-2xl font-display font-bold mb-5">{c.headline}</h2>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {c.metrics.map((m) => (
                  <div
                    key={m.v}
                    className="rounded-xl bg-muted/40 border border-border/60 p-4 text-center"
                  >
                    <div className="text-2xl font-display font-bold text-primary">{m.k}</div>
                    <div className="text-xs text-muted-foreground mt-1">{m.v}</div>
                  </div>
                ))}
              </div>

              <blockquote className="relative pl-8 border-l-2 border-primary/40">
                <Quote className="w-5 h-5 text-primary/60 absolute -left-3 top-0 bg-background rounded-full" />
                <p className="italic text-foreground/90">"{c.quote}"</p>
                <footer className="text-sm text-muted-foreground mt-2">— {c.author}</footer>
              </blockquote>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-12 max-w-xl mx-auto">
          Built with Document Edit Pro AI · Aggregated metrics shared with customer permission.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudies;
