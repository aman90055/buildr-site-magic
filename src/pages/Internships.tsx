import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialMeta from "@/components/SocialMeta";
import ShareButtons from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Code, Palette, Megaphone, Sparkles } from "lucide-react";

const tracks = [
  { icon: Code, title: "Engineering Intern", focus: "React, TypeScript, Supabase, PDF tooling", stipend: "₹25,000 – ₹40,000 / mo" },
  { icon: Sparkles, title: "AI Research Intern", focus: "LLM prompts, document AI, evals", stipend: "₹30,000 – ₹50,000 / mo" },
  { icon: Palette, title: "Product Design Intern", focus: "Figma, design systems, motion", stipend: "₹20,000 – ₹35,000 / mo" },
  { icon: Megaphone, title: "Growth & Content Intern", focus: "SEO, social, video, community", stipend: "₹15,000 – ₹30,000 / mo" },
];

const Internships = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Internships — Document Edit Pro AI"
        description="Paid, fully-remote internships in engineering, AI, design and growth. Build real products used by millions."
        path="/internships"
      />
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Internship Program 2026
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Learn by shipping real products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              3 – 6 month paid internships. Remote. Direct mentorship from the founding team.
              Top performers get full-time offers.
            </p>
          </div>
          <ShareButtons title="Internships at Document Edit Pro AI" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {tracks.map((t) => (
            <Card key={t.title} className="p-6 glass-card">
              <t.icon className="w-7 h-7 text-primary mb-3" />
              <h3 className="text-xl font-display font-semibold mb-1">{t.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t.focus}</p>
              <p className="text-sm font-medium text-foreground">{t.stipend}</p>
              <Button className="mt-4" asChild>
                <a href={`mailto:documentai999@gmail.com?subject=Internship application — ${t.title}`}>
                  Apply now
                </a>
              </Button>
            </Card>
          ))}
        </div>

        <section className="mt-16 grid md:grid-cols-3 gap-4">
          {[
            { k: "Stipend", v: "Paid monthly" },
            { k: "Format", v: "Remote · Async" },
            { k: "Conversion", v: "70%+ to full-time" },
          ].map((s) => (
            <Card key={s.k} className="p-6 text-center glass-card">
              <div className="text-2xl font-display font-bold text-primary">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.k}</div>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Internships;
