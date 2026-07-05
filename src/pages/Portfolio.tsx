import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialMeta from "@/components/SocialMeta";
import ShareButtons from "@/components/ShareButtons";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "The Docunova AI Suite",
    tag: "SaaS · AI · 2026",
    desc: "Flagship platform — 100+ document tools, AI assistants, and team workflows. Millions of documents processed.",
    href: "/",
    color: "from-primary to-brand-ai",
  },
  {
    title: "AI Smart Compression",
    tag: "ML · PDF",
    desc: "Self-tuning compression engine that picks the optimal level per document using content analysis.",
    href: "/compress",
    color: "from-brand-purple to-brand-blue",
  },
  {
    title: "AI Document Chat",
    tag: "RAG · LLM",
    desc: "Ask any PDF a question — extraction, summaries, and citations powered by Docunova-AI.",
    href: "/ai-hub",
    color: "from-brand-green to-brand-cyan",
  },
  {
    title: "Resume & Invoice Builder",
    tag: "Productivity",
    desc: "Beautiful templates with one-click PDF export, used by 200,000+ professionals.",
    href: "/resume-builder",
    color: "from-brand-orange to-brand-purple",
  },
  {
    title: "Smart OCR",
    tag: "Computer Vision",
    desc: "100+ language OCR with layout preservation and editable output.",
    href: "/ocr",
    color: "from-brand-cyan to-primary",
  },
  {
    title: "Set AV Profile",
    tag: "Personal · Side Project",
    desc: "A polished portfolio template by the founder, built with the same design system.",
    href: "https://set-av-profile.vercel.app/",
    color: "from-accent to-primary",
    external: true,
  },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Portfolio — The Docunova AI Suite"
        description="Showcase of products and projects built by The Docunova AI Suite and founder Aman Vishwakarma."
        path="/portfolio"
      />
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary mb-2">Portfolio</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Things we've built
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A selection of products, side projects and experiments from the The Docunova AI Suite team.
            </p>
          </div>
          <ShareButtons title="Portfolio — The Docunova AI Suite" />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-12">
          {projects.map((p) => {
            const Inner = (
              <Card className="p-6 glass-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full">
                <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${p.color} mb-4`} />
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-display font-semibold">{p.title}</h3>
                  {p.external && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{p.tag}</p>
                <p className="text-sm text-muted-foreground mt-3">{p.desc}</p>
              </Card>
            );
            return p.external ? (
              <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer">
                {Inner}
              </a>
            ) : (
              <Link key={p.title} to={p.href}>
                {Inner}
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
