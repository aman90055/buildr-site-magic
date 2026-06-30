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

      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero — compact */}
          <div className="text-center mb-5">
            <Badge variant="secondary" className="mb-2 gap-1.5 text-xs">
              <LayoutGrid className="h-3 w-3" />
              {allTools.length}+ tools
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
              Find the right tool, fast
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Search by name or filter by category. All free, in-browser.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search merge, compress, OCR, translate…"
              className="pl-9 pr-9 h-10 text-sm rounded-xl bg-card/50 backdrop-blur-xl border-border/60"
              aria-label="Search tools"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category chips — compact */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-5">
            {categories.map(c => {
              const active = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={[
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card/40 backdrop-blur border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
                  ].join(" ")}
                >
                  {c.label}
                  <span className={`ml-1 text-[10px] ${active ? "opacity-80" : "opacity-60"}`}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium mb-1">No tools match “{query}”</p>
              <p className="text-xs text-muted-foreground mb-4">
                Try “pdf”, “image”, or “ai”.
              </p>
              <Button size="sm" variant="outline" onClick={() => { setQuery(""); setActiveCategory("all"); }}>
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                <span className="font-semibold text-foreground">{filtered.length}</span> tool{filtered.length === 1 ? "" : "s"}
                {activeCategory !== "all" && activeCategory !== "recent" && (
                  <> · {CATEGORY_META[activeCategory].title}</>
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                {filtered.map(tool => {
                  const Icon = CATEGORY_ICONS[tool.category];
                  return (
                    <Link
                      key={tool.slug}
                      to={tool.slug}
                      onClick={() => pushRecent(tool.slug)}
                      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                      title={tool.short}
                    >
                      <Card className="h-full p-3 bg-card/50 backdrop-blur-xl border-border/60 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-xs leading-tight line-clamp-2 mb-0.5">{tool.name}</h3>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">{tool.category}</p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Category quick-jump — compact */}
          <div className="mt-10 pt-6 border-t border-border/50">
            <h2 className="text-sm font-semibold mb-3 text-center text-muted-foreground uppercase tracking-wide">Browse by category</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {(Object.keys(CATEGORY_META) as ToolCategory[]).map(c => {
                const Icon = CATEGORY_ICONS[c];
                const count = allTools.filter(t => t.category === c).length;
                return (
                  <Link
                    key={c}
                    to={`/category/${c}`}
                    className="group p-2.5 rounded-lg bg-card/40 backdrop-blur border border-border/60 hover:border-primary/50 transition-all text-center"
                  >
                    <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
                    <div className="font-semibold text-xs leading-tight">{c}</div>
                    <div className="text-[10px] text-muted-foreground">{count}</div>
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
