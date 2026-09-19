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
  Search, X, FolderOpen, FileType2, PenLine, Sparkles,
  Image as ImageIcon, ShieldCheck, FileText, LayoutGrid, List, ArrowUpRight,
  Star,
} from "lucide-react";
import {
  POPULAR_SLUGS,
  FAV_STORAGE_KEY,
  RECENT_STORAGE_KEY,
  readStoredSlugs,
  writeStoredSlugs,
} from "@/lib/toolHighlights";
import {
  CATEGORY_META,
  getAllTools,
  type ToolCategory,
} from "@/lib/toolRegistry";

const CATEGORY_ICONS: Record<ToolCategory, typeof FolderOpen> = {
  organize: FolderOpen,
  convert: FileType2,
  edit: PenLine,
  ai: Sparkles,
  image: ImageIcon,
  security: ShieldCheck,
  documents: FileText,
};

const MAX_RECENT = 12;
type FilterKey = ToolCategory | "all" | "recent" | "ai" | "popular" | "favorites";

export default function Tools() {
  const allTools = useMemo(getAllTools, []);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterKey>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setRecent(readStoredSlugs(RECENT_STORAGE_KEY));
    setFavorites(readStoredSlugs(FAV_STORAGE_KEY));
    const onStorage = () => {
      setRecent(readStoredSlugs(RECENT_STORAGE_KEY));
      setFavorites(readStoredSlugs(FAV_STORAGE_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const pushRecent = (slug: string) => {
    const next = [slug, ...readStoredSlugs(RECENT_STORAGE_KEY).filter(s => s !== slug)].slice(0, MAX_RECENT);
    writeStoredSlugs(RECENT_STORAGE_KEY, next);
    setRecent(next);
  };

  const toggleFavorite = (slug: string) => {
    const current = readStoredSlugs(FAV_STORAGE_KEY);
    const next = current.includes(slug) ? current.filter(s => s !== slug) : [slug, ...current];
    writeStoredSlugs(FAV_STORAGE_KEY, next);
    setFavorites(next);
  };

  const popularSet = useMemo(() => new Set(POPULAR_SLUGS), []);
  const aiCount = allTools.filter(t => t.category === "ai" || t.slug.startsWith("/ai")).length;
  const popularCount = allTools.filter(t => popularSet.has(t.slug)).length;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    let list = allTools;
    if (activeCategory === "recent") {
      const order = new Map(recent.map((s, i) => [s, i]));
      list = allTools.filter(t => order.has(t.slug))
        .sort((a, b) => (order.get(a.slug)! - order.get(b.slug)!));
    } else if (activeCategory === "favorites") {
      list = list.filter(t => favorites.includes(t.slug));
    } else if (activeCategory === "ai") {
      list = list.filter(t => t.category === "ai" || t.slug.startsWith("/ai"));
    } else if (activeCategory === "popular") {
      list = list.filter(t => popularSet.has(t.slug));
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
    return sortTools(list, sort, t => t.name);
  }, [allTools, activeCategory, q, recent, favorites, popularSet, sort]);

  const quickChips = [
    { key: "all", label: "All", icon: Filter, count: allTools.length },
    { key: "ai", label: "AI", icon: Sparkles, count: aiCount },
    { key: "popular", label: "Popular", icon: Flame, count: popularCount },
    { key: "recent", label: "Recent", icon: Clock, count: recent.length },
    { key: "favorites", label: "Favorites", icon: Star, count: favorites.length },
  ];

  const categoryChips = (Object.keys(CATEGORY_META) as ToolCategory[]).map(c => ({
    key: c,
    label: CATEGORY_META[c].title.replace(" Tools", "").replace(" PDF", ""),
    icon: CATEGORY_ICONS[c],
    count: allTools.filter(t => t.category === c).length,
  }));

  const isCategory = (key: FilterKey): key is ToolCategory =>
    key !== "all" && key !== "recent" && key !== "ai" && key !== "popular" && key !== "favorites";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>All Tools — Search 100+ PDF, AI & Image Tools | The Docunova AI Suite</title>
        <meta name="description" content="Browse and search every free tool — merge, split, compress, convert, OCR, AI summarize, translate, image edit and more. Instant search by name or category." />
        <link rel="canonical" href="https://docunova.online/tools" />
        <meta property="og:title" content="All Tools — Search 100+ PDF, AI & Image Tools" />
        <meta property="og:description" content="Find the right tool in seconds. Instant search across 100+ free PDF, AI and image tools." />
      </Helmet>

      <Header />

      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-5">
            <Badge variant="secondary" className="mb-2 gap-1.5 text-xs">
              <LayoutGrid className="h-3 w-3" />
              {allTools.length} tools
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
              Find the right tool, fast
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Search by name, filter by category, or pin the tools you use most.
            </p>
          </div>

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

          <ToolFilterBar
            quick={quickChips}
            categories={categoryChips}
            active={activeCategory}
            onChange={(key) => setActiveCategory(key as FilterKey)}
            sort={sort}
            onSortChange={setSort}
            canClear={activeCategory !== "all" || sort !== "default" || query.length > 0}
            onClear={() => { setActiveCategory("all"); setSort("default"); setQuery(""); }}
          />

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> tool{filtered.length === 1 ? "" : "s"}
              {isCategory(activeCategory) && (
                <> · {CATEGORY_META[activeCategory].title}</>
              )}
            </p>
            <div className="flex items-center rounded-lg border border-border/60 bg-card/40 backdrop-blur overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={[
                  "p-1.5 transition",
                  viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={[
                  "p-1.5 transition",
                  viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium mb-1">
                {activeCategory === "favorites" && !q
                  ? "No favorites yet — tap the star on any tool"
                  : `No tools match "${query}"`}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Try "pdf", "image", or "ai".
              </p>
              <Button size="sm" variant="outline" onClick={() => { setQuery(""); setActiveCategory("all"); setSort("default"); }}>
                Reset filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
              {filtered.map(tool => {
                const Icon = CATEGORY_ICONS[tool.category];
                const isFav = favorites.includes(tool.slug);
                return (
                  <Link
                    key={tool.slug}
                    to={tool.slug}
                    onClick={() => pushRecent(tool.slug)}
                    className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                    title={tool.short}
                  >
                    <Card className="relative h-full p-3 bg-card/50 backdrop-blur-xl border-border/60 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.slug); }}
                        aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/70 transition"
                      >
                        <Star className={`h-3 w-3 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/60"}`} />
                      </button>
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
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(tool => {
                const Icon = CATEGORY_ICONS[tool.category];
                const isFav = favorites.includes(tool.slug);
                return (
                  <Link
                    key={tool.slug}
                    to={tool.slug}
                    onClick={() => pushRecent(tool.slug)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-card/40 backdrop-blur border border-border/60 hover:border-primary/40 hover:bg-card/60 transition-all"
                    title={tool.short}
                  >
                    <div className="shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm leading-tight">{tool.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{tool.short}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.slug); }}
                        aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                        className="p-1 rounded-full hover:bg-muted/70 transition"
                      >
                        <Star className={`h-3.5 w-3.5 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/60"}`} />
                      </button>
                      <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5">
                        {tool.category}
                      </Badge>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

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
