import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles, ArrowRight } from "lucide-react";
import { AI_TOOLS } from "@/lib/aiTools";

const AIHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Ecosystem — 15 AI tools for documents, writing & work</title>
        <meta name="description" content="A full AI ecosystem: Document Chat, OCR, Translation, Resume, Cover Letter, Contract Review, Meeting Notes, Email Writer and more — all in one workspace." />
        <link rel="canonical" href="/ai-hub" />
      </Helmet>

      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold tracking-wider uppercase text-foreground">AI Ecosystem</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">15 AI tools</span> in one workspace
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chat with documents, generate resumes & proposals, review contracts, write emails, translate anything — powered by Docunova-AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  to={`/ai/${tool.slug}`}
                  className="group relative block rounded-[22px] p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-blue-400/60 hover:via-purple-400/40 hover:to-cyan-400/60 transition-all duration-500 hover:-translate-y-1.5"
                >
                  <div className="relative h-full rounded-[20px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 p-6 overflow-hidden shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] group-hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.45)] transition-shadow">
                    <div className={`pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-500`} />
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg ring-1 ring-white/40 dark:ring-white/10 mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1">{tool.name}</h3>
                    <p className="text-xs text-primary font-medium mb-2">{tool.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{tool.description}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIHub;
