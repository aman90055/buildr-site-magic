import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, FileText, Image, Lock, Merge, Scissors, Minimize2, Star, Search, X, PenTool, Receipt, ArrowLeftRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllTools, type ToolCategory, type ToolMeta } from "@/lib/toolRegistry";

const categories: { value: ToolCategory | "all" | "favorites" | "recent"; label: string }[] = [
  { value: "all", label: "All tools" }, { value: "organize", label: "Organize PDF" },
  { value: "convert", label: "Convert" }, { value: "edit", label: "Edit PDF" },
  { value: "security", label: "Security" }, { value: "image", label: "Images" },
  { value: "ai", label: "AI & OCR" }, { value: "documents", label: "Documents" },
  { value: "favorites", label: "Favorites" }, { value: "recent", label: "Recent" },
];
const icons = { organize: LayoutGrid, convert: ArrowLeftRight, edit: PenTool, security: Lock, image: Image, ai: Brain, documents: Receipt };
const colors = { organize: "bg-brand-blue/10 text-brand-blue", convert: "bg-brand-green/10 text-brand-green", edit: "bg-brand-orange/10 text-brand-orange", security: "bg-brand-blue/10 text-brand-blue", image: "bg-brand-cyan/10 text-brand-cyan", ai: "bg-brand-purple/10 text-brand-purple", documents: "bg-brand-pink/10 text-brand-pink" };
const featured = ["/merge", "/split", "/compress", "/image-to-pdf", "/pdf-to-word", "/image-to-text", "/edit-pdf", "/sign-pdf"];
const summaries: Record<string, string> = {
  "/merge": "Combine PDF files in the order you choose.", "/split": "Separate a PDF or extract selected page ranges.",
  "/compress": "Reduce PDF size; results depend on the file.", "/image-to-pdf": "Turn photos and images into PDF pages.",
  "/pdf-to-word": "Export extracted text to a Word document.", "/image-to-text": "Recognise text in an image with online OCR.",
  "/edit-pdf": "Add text and annotations to PDF pages.", "/sign-pdf": "Add a typed or drawn signature to a PDF.",
};
const tools = [...getAllTools()].sort((a, b) => {
  const ai = featured.indexOf(a.slug), bi = featured.indexOf(b.slug);
  return (ai < 0 ? featured.length : ai) - (bi < 0 ? featured.length : bi);
});
function readList(key: string): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; } catch { return []; }
}
const PopularTools = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => { setFavorites(readList("depai_tool_favorites")); setRecent(readList("depai_tool_recent")); }, []);
  const save = (key: string, values: string[]) => { try { localStorage.setItem(key, JSON.stringify(values)); } catch {} };
  const toggleFavorite = (slug: string) => {
    const next = favorites.includes(slug) ? favorites.filter(value => value !== slug) : [...favorites, slug];
    setFavorites(next); save("depai_tool_favorites", next);
  };
  const open = (slug: string) => { const next = [slug, ...recent.filter(value => value !== slug)].slice(0, 12); setRecent(next); save("depai_tool_recent", next); };
  const filtered = useMemo(() => tools.filter(tool => {
    const matchesCategory = category === "all" || (category === "favorites" ? favorites.includes(tool.slug) : category === "recent" ? recent.includes(tool.slug) : tool.category === category);
    const query = search.trim().toLowerCase();
    return matchesCategory && `${tool.name} ${tool.short}`.toLowerCase().includes(query);
  }), [search, category, favorites, recent]);
  return (
    <section id="tools" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-10 sm:px-8 sm:py-12" aria-labelledby="tools-heading">
      <div className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div><h2 id="tools-heading" className="font-display text-2xl font-bold sm:text-3xl">What do you need to do?</h2><p className="mt-2 text-sm text-muted-foreground">PDFs, images and everyday documents.</p></div>
        <div className="relative w-full md:w-80"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search tools" placeholder="Search tools…" value={search} onChange={event => setSearch(event.target.value)} className="h-10 rounded-lg bg-card pl-10 pr-10" />{search && <Button variant="ghost" size="icon-xs" aria-label="Clear search" className="absolute right-2 top-2" onClick={() => setSearch("")}><X /></Button>}</div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Tool categories">{categories.map(item => <Button key={item.value} size="sm" variant={category === item.value ? "default" : "ghost"} aria-pressed={category === item.value} onClick={() => setCategory(item.value)} className="rounded-lg px-3">{item.label}</Button>)}</div>
      <p className="mb-4 text-xs text-muted-foreground" aria-live="polite">{filtered.length} tools{category === "all" && !search ? " · Popular choices first" : " found"}</p>
      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((tool: ToolMeta) => {
          const Icon = tool.slug === "/merge" ? Merge : tool.slug === "/split" ? Scissors : tool.slug === "/compress" ? Minimize2 : icons[tool.category] ?? FileText;
          const isFav = favorites.includes(tool.slug);
          return <article key={tool.slug} className="group relative rounded-lg border border-border bg-card/80 transition-colors hover:border-primary/50">
            <Link to={tool.slug} onClick={() => open(tool.slug)} className="block h-full rounded-lg p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${colors[tool.category]}`}><Icon className="h-5 w-5" /></div>
              <h3 className="pr-2 font-display text-base font-semibold group-hover:text-primary">{tool.name}</h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{summaries[tool.slug] ?? tool.short}</p>
              <span className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">Open tool<ArrowRight className="h-3 w-3" /></span>
            </Link>
            <Button variant="ghost" size="icon-sm" aria-label={`${isFav ? "Remove" : "Add"} ${tool.name} ${isFav ? "from" : "to"} favorites`} aria-pressed={isFav} title={isFav ? "Remove from favorites" : "Add to favorites"} onClick={() => toggleFavorite(tool.slug)} className="absolute right-3 top-3 rounded-lg"><Star className={isFav ? "fill-brand-orange text-brand-orange" : "text-muted-foreground"} /></Button>
          </article>;
        })}
      </div>
      {filtered.length === 0 && <div className="py-12 text-center"><Search className="mx-auto mb-4 h-6 w-6 text-muted-foreground" /><h3 className="font-display text-lg font-semibold">{category === "favorites" ? "No favorites yet" : category === "recent" ? "No recent tools" : "No matching tools"}</h3><Button variant="link" onClick={() => { setCategory("all"); setSearch(""); }}>View all tools</Button></div>}
    </section>
  );
};
export default PopularTools;
