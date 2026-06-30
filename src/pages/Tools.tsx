import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search, X, ArrowRight, FolderOpen, FileType2, PenLine, Sparkles,
  Image as ImageIcon, ShieldCheck, FileText, LayoutGrid,
} from "lucide-react";
import {
  CATEGORY_META,
  TOOL_REGISTRY,
  getToolMeta,
  type ToolMeta,
  type ToolCategory,
} from "@/lib/toolRegistry";

// Extra AI/document tools that exist as routes but aren't in toolRegistry's NAME_MAP yet
const EXTRA_TOOLS: ToolMeta[] = [
  { slug: "/ai-cover-letter", name: "AI Cover Letter Writer", category: "ai", short: "Generate tailored cover letters in seconds", guide: "", faqs: [] },
  { slug: "/ai-email-writer", name: "AI Email Writer", category: "ai", short: "Draft professional emails instantly", guide: "", faqs: [] },
  { slug: "/ai-blog-writer", name: "AI Blog Writer", category: "ai", short: "Generate full blog articles with AI", guide: "", faqs: [] },
  { slug: "/ai-code-explainer", name: "AI Code Explainer", category: "ai", short: "Understand any code snippet line-by-line", guide: "", faqs: [] },
  { slug: "/ai-math-solver", name: "AI Math Solver", category: "ai", short: "Step-by-step solutions to math problems", guide: "", faqs: [] },
  { slug: "/ai-idea-generator", name: "AI Idea Generator", category: "ai", short: "Brainstorm ideas for any topic", guide: "", faqs: [] },
  { slug: "/ai-hashtag-generator", name: "AI Hashtag Generator", category: "ai", short: "Trending hashtags for Instagram, TikTok, X", guide: "", faqs: [] },
  { slug: "/ai-youtube-titles", name: "AI YouTube Title Generator", category: "ai", short: "Click-worthy YouTube titles", guide: "", faqs: [] },
  { slug: "/ai-tweet-generator", name: "AI Tweet Generator", category: "ai", short: "Punchy tweets in your tone", guide: "", faqs: [] },
  { slug: "/ai-resume-analyzer", name: "AI Resume Analyzer", category: "ai", short: "Free ATS scan and feedback", guide: "", faqs: [] },
];

function getAllTools(): ToolMeta[] {
  // Combine registry, NAME_MAP entries (via getToolMeta), and extras. Dedupe by slug.
  const slugs = new Set<string>();
  const out: ToolMeta[] = [];
  const push = (t: ToolMeta | null) => {
    if (!t || slugs.has(t.slug)) return;
    slugs.add(t.slug);
    out.push(t);
  };
  Object.values(TOOL_REGISTRY).forEach(push);
  // pull every NAME_MAP entry via the helper
  // toolRegistry exposes getToolMeta for known slugs; iterate the known list:
  [
    "/edit-pdf","/protect-pdf","/image-to-pdf","/pdf-to-image","/remove-pages",
    "/extract-pages","/organize-pdf","/scan-to-pdf","/reverse-pdf","/repair-pdf",
    "/powerpoint-to-pdf","/excel-to-pdf","/html-to-pdf","/svg-to-pdf",
    "/markdown-to-pdf","/text-to-pdf","/pdf-to-powerpoint","/pdf-to-excel",
    "/pdf-to-pdfa","/pdf-to-text","/pdf-to-html","/pdf-to-png","/pdf-to-svg",
    "/pdf-to-epub","/rotate-pdf","/add-page-numbers","/add-watermark","/crop-pdf",
    "/flatten-pdf","/grayscale-pdf","/pdf-metadata","/unlock-pdf","/sign-pdf",
    "/redact-pdf","/compare-pdf","/compress-image","/resize-image","/crop-image",
    "/png-to-jpg","/jpg-to-png","/webp-to-jpg","/jpg-to-webp","/rotate-image",
    "/remove-background","/image-to-text","/ai-image-enhance","/ai-grammar-check",
    "/ai-rewriter","/ai-data-extractor","/resume-builder","/invoice-generator",
    "/certificate-maker","/letter-writer",
  ].forEach(s => push(getToolMeta(s)));
  EXTRA_TOOLS.forEach(push);
  return out;
}

const CATEGORY_ICONS: Record<ToolCategory, typeof FolderOpen> = {
  organize: FolderOpen,
  convert: FileType2,
  edit: PenLine,
  ai: Sparkles,
  image: ImageIcon,
  security: ShieldCheck,
  documents: FileText,
};

const RECENT_KEY = "tools-page-recent";
const MAX_RECENT = 8;

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function pushRecent(slug: string) {
  try {
    const next = [slug, ...getRecent().filter(s => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}

export default function Tools() {
  const allTools = useMemo(getAllTools, []);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all" | "recent">("all");
  const [recent, setRecent] = useState<string[]>(() => getRecent());

  useEffect(() => {
    const onStorage = () => setRecent(getRecent());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    let list = allTools;
    if (activeCategory === "recent") {
      const order = new Map(recent.map((s, i) => [s, i]));
      list = allTools.filter(t => order.has(t.slug))
        .sort((a, b) => (order.get(a.slug)! - order.get(b.slug)!));
    } else if (activeCategory !== "all") {
      list = list.filter(t => t.category === activeCategory);
    }
    if (q) {
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.category.includes(q)
      );
    }
    return list;
  }, [allTools, activeCategory, q, recent]);

  const categories: { key: ToolCategory | "all" | "recent"; label: string; count: number }[] = [
    { key: "all", label: "All tools", count: allTools.length },
    ...(recent.length ? [{ key: "recent" as const, label: "Recent", count: recent.length }] : []),
    ...(Object.keys(CATEGORY_META) as ToolCategory[]).map(c => ({
      key: c,
      label: CATEGORY_META[c].title.replace(" Tools", "").replace(" PDF", ""),
      count: allTools.filter(t => t.category === c).length,
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>All Tools — Search 100+ PDF, AI & Image Tools | Document Edit Pro AI</title>
        <meta name="description" content="Browse and search every free tool — merge, split, compress, convert, OCR, AI summarize, translate, image edit and more. Instant search by name or category." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/tools" />
        <meta property="og:title" content="All Tools — Search 100+ PDF, AI & Image Tools" />
        <meta property="og:description" content="Find the right tool in seconds. Instant search across 100+ free PDF, AI and image tools." />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" />
              {allTools.length}+ tools available
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Find the right tool, fast
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Search by name, action or file type. Filter by category. Every tool runs free, in your browser, with no signup.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search merge, compress, OCR, translate, resume…"
              className="pl-12 pr-12 h-14 text-base rounded-2xl bg-card/50 backdrop-blur-xl border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Search tools"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(c => {
              const active = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={[
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-card/40 backdrop-blur border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
                  ].join(" ")}
                >
                  {c.label}
                  <span className={`ml-2 text-xs ${active ? "opacity-80" : "opacity-60"}`}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium mb-1">No tools match “{query}”</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try a broader keyword like “pdf”, “image”, or “ai”.
              </p>
              <Button variant="outline" onClick={() => { setQuery(""); setActiveCategory("all"); }}>
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> tool{filtered.length === 1 ? "" : "s"}
                {activeCategory !== "all" && activeCategory !== "recent" && (
                  <> in <span className="font-semibold text-foreground">{CATEGORY_META[activeCategory].title}</span></>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(tool => {
                  const Icon = CATEGORY_ICONS[tool.category];
                  return (
                    <Link
                      key={tool.slug}
                      to={tool.slug}
                      onClick={() => pushRecent(tool.slug)}
                      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                    >
                      <Card className="h-full p-5 bg-card/50 backdrop-blur-xl border-border/60 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold leading-tight mb-0.5 truncate">{tool.name}</h3>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wide px-1.5 py-0">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {tool.short}
                        </p>
                        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Open tool <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Category quick-jump */}
          <div className="mt-16 pt-10 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6 text-center">Browse by category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(Object.keys(CATEGORY_META) as ToolCategory[]).map(c => {
                const Icon = CATEGORY_ICONS[c];
                const count = allTools.filter(t => t.category === c).length;
                return (
                  <Link
                    key={c}
                    to={`/category/${c}`}
                    className="group p-4 rounded-xl bg-card/40 backdrop-blur border border-border/60 hover:border-primary/50 transition-all"
                  >
                    <Icon className="h-6 w-6 text-primary mb-2" />
                    <div className="font-semibold text-sm">{CATEGORY_META[c].title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{count} tools →</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
