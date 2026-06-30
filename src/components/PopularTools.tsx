import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ImageIcon, FileImage, FileDown, Merge, Scissors, Pencil, Lock, ScanText,
  Trash2, FileOutput, LayoutGrid, Scan, Wrench, FileText, Presentation, Table,
  Globe, FileArchive, RotateCw, Hash, Droplets, Crop, Unlock, PenTool, EyeOff,
  GitCompare, Star, Lightbulb, ArrowDownUp, Layers, Contrast, Info, BookOpen,
  FileCode, Type, Minimize2, Maximize, Eraser, RefreshCw, Languages, SpellCheck,
  Database, Receipt, Award, Mail, FileUser, Search, X, Flame, Clock, Sparkles,
  Filter,
} from "lucide-react";
import AIBadge from "./AIBadge";
import { useToolIcon } from "@/lib/toolIcons";

type Tool = {
  title: string;
  description: string;
  href: string;
  icon: any;
  ai?: boolean;
  popular?: boolean;
  category: string;
  categoryIcon: any;
  catIndex: number;
  idx: number;
};

const toolCategories = [
  {
    title: "Organize PDF",
    icon: LayoutGrid,
    tools: [
      { title: "Merge PDF", description: "AI-optimized combining", href: "/merge", icon: Merge, ai: true, popular: true },
      { title: "Split PDF", description: "Smart page detection", href: "/split", icon: Scissors, ai: true, popular: true },
      { title: "Remove Pages", description: "AI-suggested removal", href: "/remove-pages", icon: Trash2, ai: true },
      { title: "Extract Pages", description: "Smart extraction", href: "/extract-pages", icon: FileOutput, ai: true },
      { title: "Organize PDF", description: "AI page arrangement", href: "/organize-pdf", icon: LayoutGrid, ai: true },
      { title: "Scan to PDF", description: "Enhanced scanning", href: "/scan-to-pdf", icon: Scan },
      { title: "Reverse PDF", description: "Reverse page order", href: "/reverse-pdf", icon: ArrowDownUp },
    ],
  },
  {
    title: "Smart Tools",
    icon: Lightbulb,
    tools: [
      { title: "Smart OCR", description: "99.9% accuracy AI OCR", href: "/ocr", icon: ScanText, ai: true, popular: true },
      { title: "Smart Analysis", description: "Summarize & extract", href: "/ocr", icon: Lightbulb, ai: true },
      { title: "Compress PDF", description: "AI compression engine", href: "/compress", icon: FileDown, ai: true, popular: true },
      { title: "Repair PDF", description: "Smart PDF repair", href: "/repair-pdf", icon: Wrench, ai: true },
      { title: "Smart Summarizer", description: "Instant PDF summaries", href: "/ai-summarizer", icon: Lightbulb, ai: true },
      { title: "AI Translator", description: "Translate documents", href: "/ai-translator", icon: Languages, ai: true },
      { title: "AI Grammar Check", description: "Fix errors instantly", href: "/ai-grammar-check", icon: SpellCheck, ai: true },
      { title: "AI Rewriter", description: "Paraphrase content", href: "/ai-rewriter", icon: RefreshCw, ai: true },
      { title: "AI Data Extractor", description: "Extract tables & data", href: "/ai-data-extractor", icon: Database, ai: true },
      { title: "Image Enhance", description: "Upscale & sharpen", href: "/ai-image-enhance", icon: Star, ai: true },
      { title: "Remove Background", description: "AI background removal", href: "/remove-background", icon: Eraser, ai: true },
      { title: "Image to Text", description: "OCR from images", href: "/image-to-text", icon: ScanText, ai: true },
    ],
  },
  {
    title: "Convert to PDF",
    icon: FileText,
    tools: [
      { title: "JPG to PDF", description: "AI image optimization", href: "/image-to-pdf", icon: ImageIcon, ai: true, popular: true },
      { title: "Word to PDF", description: "Perfect formatting", href: "/word-to-pdf", icon: FileText, popular: true },
      { title: "PowerPoint to PDF", description: "Preserve animations", href: "/powerpoint-to-pdf", icon: Presentation },
      { title: "Excel to PDF", description: "Keep formulas", href: "/excel-to-pdf", icon: Table },
      { title: "HTML to PDF", description: "Web to document", href: "/html-to-pdf", icon: Globe },
      { title: "SVG to PDF", description: "Vector to PDF", href: "/svg-to-pdf", icon: PenTool },
      { title: "Markdown to PDF", description: "MD to formatted PDF", href: "/markdown-to-pdf", icon: FileCode },
      { title: "Text to PDF", description: "Plain text to PDF", href: "/text-to-pdf", icon: Type },
    ],
  },
  {
    title: "Convert from PDF",
    icon: FileImage,
    tools: [
      { title: "PDF to JPG", description: "AI-enhanced export", href: "/pdf-to-image", icon: FileImage, ai: true, popular: true },
      { title: "PDF to Word", description: "Smart conversion", href: "/pdf-to-word", icon: FileText, ai: true, popular: true },
      { title: "PDF to PowerPoint", description: "Editable slides", href: "/pdf-to-powerpoint", icon: Presentation },
      { title: "PDF to Excel", description: "Extract tables", href: "/pdf-to-excel", icon: Table, ai: true },
      { title: "PDF to PDF/A", description: "Archive format", href: "/pdf-to-pdfa", icon: FileArchive },
      { title: "PDF to Text", description: "AI text extraction", href: "/pdf-to-text", icon: FileText, ai: true },
      { title: "PDF to HTML", description: "Web-ready output", href: "/pdf-to-html", icon: Globe, ai: true },
      { title: "PDF to PNG", description: "High-res images", href: "/pdf-to-png", icon: ImageIcon, ai: true },
      { title: "PDF to SVG", description: "Vector graphics", href: "/pdf-to-svg", icon: PenTool },
      { title: "PDF to eBook", description: "EPUB conversion", href: "/pdf-to-epub", icon: BookOpen, ai: true },
    ],
  },
  {
    title: "Edit PDF",
    icon: Pencil,
    tools: [
      { title: "Edit PDF", description: "AI-assisted editing", href: "/edit-pdf", icon: Pencil, ai: true, popular: true },
      { title: "Rotate PDF", description: "Smart rotation", href: "/rotate-pdf", icon: RotateCw },
      { title: "Add Page Numbers", description: "Auto-numbering", href: "/add-page-numbers", icon: Hash },
      { title: "Add Watermark", description: "Custom branding", href: "/add-watermark", icon: Droplets },
      { title: "Crop PDF", description: "Precision cropping", href: "/crop-pdf", icon: Crop },
      { title: "Flatten PDF", description: "Lock form fields", href: "/flatten-pdf", icon: Layers },
      { title: "Grayscale PDF", description: "Convert to B&W", href: "/grayscale-pdf", icon: Contrast },
      { title: "Edit Metadata", description: "PDF properties", href: "/pdf-metadata", icon: Info },
    ],
  },
  {
    title: "PDF Security",
    icon: Lock,
    tools: [
      { title: "Unlock PDF", description: "Remove restrictions", href: "/unlock-pdf", icon: Unlock },
      { title: "Protect PDF", description: "Bank-grade encryption", href: "/protect-pdf", icon: Lock, popular: true },
      { title: "Sign PDF", description: "Digital signatures", href: "/sign-pdf", icon: PenTool, popular: true },
      { title: "Redact PDF", description: "AI-powered redaction", href: "/redact-pdf", icon: EyeOff, ai: true },
      { title: "Compare PDF", description: "AI difference detection", href: "/compare-pdf", icon: GitCompare, ai: true },
    ],
  },
  {
    title: "Image Tools",
    icon: ImageIcon,
    tools: [
      { title: "Compress Image", description: "AI smart compression", href: "/compress-image", icon: Minimize2, ai: true, popular: true },
      { title: "Resize Image", description: "Custom dimensions", href: "/resize-image", icon: Maximize },
      { title: "Crop Image", description: "Precision cropping", href: "/crop-image", icon: Crop },
      { title: "Rotate Image", description: "Rotate & flip", href: "/rotate-image", icon: RotateCw },
      { title: "PNG to JPG", description: "Format conversion", href: "/png-to-jpg", icon: FileImage },
      { title: "JPG to PNG", description: "Lossless conversion", href: "/jpg-to-png", icon: FileImage },
      { title: "WebP to JPG", description: "Universal format", href: "/webp-to-jpg", icon: FileImage },
      { title: "JPG to WebP", description: "Modern format", href: "/jpg-to-webp", icon: FileImage },
    ],
  },
  {
    title: "Document Tools",
    icon: FileText,
    tools: [
      { title: "AI Resume Builder", description: "ATS-friendly resumes", href: "/resume-builder", icon: FileUser, ai: true, popular: true },
      { title: "Invoice Generator", description: "Professional invoices", href: "/invoice-generator", icon: Receipt },
      { title: "Certificate Maker", description: "Beautiful certificates", href: "/certificate-maker", icon: Award },
      { title: "AI Letter Writer", description: "Smart correspondence", href: "/letter-writer", icon: Mail, ai: true },
    ],
  },
];

const gradientPalette = [
  "from-blue-500 via-blue-600 to-indigo-600",
  "from-purple-500 via-fuchsia-500 to-pink-500",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-orange-400 via-amber-500 to-rose-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-indigo-500 via-violet-500 to-purple-600",
  "from-teal-400 via-emerald-500 to-green-600",
];
const pickGradient = (catIndex: number, idx: number) =>
  gradientPalette[(catIndex * 3 + idx) % gradientPalette.length];

// Build a flat list with category metadata
const allTools: Tool[] = toolCategories.flatMap((cat, catIndex) =>
  cat.tools.map((t, idx) => ({
    ...t,
    category: cat.title,
    categoryIcon: cat.icon,
    catIndex,
    idx,
  }))
);

const FAV_KEY = "depai_tool_favorites";
const RECENT_KEY = "depai_tool_recent";

function readSet(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

type FilterKey = "all" | "ai" | "popular" | "recent" | "favorites" | string;

const ToolCard = ({
  tool,
  isFav,
  onToggleFav,
  onOpen,
}: {
  tool: Tool;
  isFav: boolean;
  onToggleFav: (href: string) => void;
  onOpen: (href: string) => void;
}) => {
  const grad = pickGradient(tool.catIndex, tool.idx);
  const customIcon = useToolIcon(tool.href);
  return (
    <Link
      to={tool.href}
      onClick={() => onOpen(tool.href)}
      className="group relative block rounded-[22px] p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-blue-400/60 hover:via-purple-400/40 hover:to-cyan-400/60 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div className="relative h-full rounded-[20px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 p-5 overflow-hidden border border-white/40 dark:border-white/5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7)] group-hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.45)] dark:group-hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.55)] transition-all duration-300">
        <div className={`pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-30 dark:group-hover:opacity-40 blur-3xl transition-opacity duration-300`} />
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_50%)]" />

        {/* Favorite star */}
        <button
          type="button"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFav(tool.href);
          }}
          className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-white/40 dark:border-white/10 opacity-0 group-hover:opacity-100 data-[active=true]:opacity-100 hover:scale-110 transition-all duration-300"
          data-active={isFav}
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors ${isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            strokeWidth={2.2}
          />
        </button>

        {tool.ai && (
          <div className="absolute top-3 right-3 z-10">
            <AIBadge variant="inline" glow={false} />
          </div>
        )}

        <div className="relative flex flex-col h-full">
          <div className={`w-12 h-12 rounded-2xl ${customIcon ? "bg-white dark:bg-slate-800" : `bg-gradient-to-br ${grad}`} flex items-center justify-center shadow-lg shadow-black/10 group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 mb-4 ring-1 ring-white/40 dark:ring-white/10 overflow-hidden`}>
            {customIcon ? (
              <img src={customIcon} alt="" className="w-full h-full object-cover" />
            ) : (
              <tool.icon className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            )}
          </div>

          <h4 className="font-display font-semibold text-[15px] leading-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5">
            {tool.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {tool.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
              Open Tool
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${grad} opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const FilterChip = ({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon?: any;
  label: string;
  count?: number;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-300 backdrop-blur whitespace-nowrap ${
      active
        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/30"
        : "bg-white/60 dark:bg-slate-900/50 text-foreground border-white/40 dark:border-white/10 hover:border-primary/40 hover:bg-white/80 dark:hover:bg-slate-800/60"
    }`}
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {label}
    {typeof count === "number" && (
      <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20" : "bg-muted/70"}`}>
        {count}
      </span>
    )}
  </button>
);

const PopularTools = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readSet(FAV_KEY));
    setRecent(readSet(RECENT_KEY));
  }, []);

  const toggleFav = (href: string) => {
    setFavorites((prev) => {
      const next = prev.includes(href) ? prev.filter((h) => h !== href) : [href, ...prev];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const onOpen = (href: string) => {
    setRecent((prev) => {
      const next = [href, ...prev.filter((h) => h !== href)].slice(0, 12);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const totalTools = allTools.length;
  const aiCount = allTools.filter((t) => t.ai).length;
  const popularCount = allTools.filter((t) => t.popular).length;

  const normalizedQuery = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = allTools;

    if (filter === "ai") list = list.filter((t) => t.ai);
    else if (filter === "popular") list = list.filter((t) => t.popular);
    else if (filter === "favorites") list = list.filter((t) => favorites.includes(t.href));
    else if (filter === "recent") {
      const order = new Map(recent.map((h, i) => [h, i]));
      list = list
        .filter((t) => order.has(t.href))
        .sort((a, b) => (order.get(a.href)! - order.get(b.href)!));
    } else if (filter !== "all") {
      list = list.filter((t) => t.category === filter);
    }

    if (normalizedQuery) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(normalizedQuery) ||
          t.description.toLowerCase().includes(normalizedQuery) ||
          t.category.toLowerCase().includes(normalizedQuery)
      );
    }

    return list;
  }, [filter, normalizedQuery, favorites, recent]);

  const isFlatView = filter !== "all" || normalizedQuery.length > 0;

  return (
    <section id="tools" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-brand-ai" />
          <span className="text-brand-ai font-display font-medium text-sm uppercase tracking-wider">
            Complete Toolkit
          </span>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
          All {totalTools}+ Tools You Need
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search, filter and pin favorites across PDF, Image, Document & Smart categories.
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300" />
          <div className="relative flex items-center rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 focus-within:border-primary/40">
            <Search className="ml-4 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 70+ tools — try 'compress', 'word', 'ocr'…"
              aria-label="Search tools"
              className="flex-1 bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="mr-2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted/70 transition-colors duration-300"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} icon={Filter} label="All" count={totalTools} />
        <FilterChip active={filter === "ai"} onClick={() => setFilter("ai")} icon={Sparkles} label="AI" count={aiCount} />
        <FilterChip active={filter === "popular"} onClick={() => setFilter("popular")} icon={Flame} label="Popular" count={popularCount} />
        <FilterChip active={filter === "recent"} onClick={() => setFilter("recent")} icon={Clock} label="Recent" count={recent.length} />
        <FilterChip active={filter === "favorites"} onClick={() => setFilter("favorites")} icon={Star} label="Favorites" count={favorites.length} />
        <div className="w-full sm:w-auto sm:ml-2 h-px sm:h-6 sm:border-l border-border/60 my-1 sm:my-0" />
        {toolCategories.map((cat) => (
          <FilterChip
            key={cat.title}
            active={filter === cat.title}
            onClick={() => setFilter(cat.title)}
            icon={cat.icon}
            label={cat.title}
            count={cat.tools.length}
          />
        ))}
      </div>

      {/* Flat results view */}
      {isFlatView ? (
        filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-muted/60 backdrop-blur items-center justify-center mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">No tools found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try a different keyword or clear the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 animate-fade-in-up">
            {filtered.map((tool) => (
              <ToolCard
                key={tool.href + tool.title}
                tool={tool}
                isFav={favorites.includes(tool.href)}
                onToggleFav={toggleFav}
                onOpen={onOpen}
              />
            ))}
          </div>
        )
      ) : (
        // Grouped by category view (default)
        <div className="space-y-14">
          {toolCategories.map((category, catIndex) => (
            <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 0.06}s` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl md:text-2xl text-foreground tracking-tight">
                  {category.title}
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted/60 backdrop-blur px-2.5 py-1 rounded-full border border-border/50">
                  {category.tools.length} tools
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {category.tools.map((tool, index) => {
                  const flat = allTools.find(
                    (t) => t.href === tool.href && t.title === tool.title
                  )!;
                  return (
                    <ToolCard
                      key={index}
                      tool={flat}
                      isFav={favorites.includes(tool.href)}
                      onToggleFav={toggleFav}
                      onOpen={onOpen}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularTools;
