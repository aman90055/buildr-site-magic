import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, Sparkles } from "lucide-react";
import { TOOL_REGISTRY } from "@/lib/toolRegistry";

const POPULAR = ["Merge PDF", "Compress", "PDF to Word", "AI Chat", "OCR", "Sign"];

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const all = useMemo(() => Object.values(TOOL_REGISTRY), []);
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return all
      .filter(
        (t) =>
          t.name.toLowerCase().includes(needle) ||
          t.short.toLowerCase().includes(needle) ||
          t.category.toLowerCase().includes(needle),
      )
      .slice(0, 6);
  }, [q, all]);

  return (
    <section
      aria-label="Find a tool"
      className="relative z-10 -mt-10 sm:-mt-14 pb-8"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl glass-card rounded-3xl p-2 sm:p-3 border border-border/60 shadow-[0_24px_80px_-30px_hsl(var(--primary)/0.4)]">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              aria-label="Search 100+ tools"
              placeholder="Search 100+ tools — merge, compress, sign, chat with PDF…"
              className="flex-1 bg-transparent py-3 sm:py-4 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none"
            />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-1 rounded-md border border-border/70">
              <Sparkles className="w-3 h-3 text-brand-ai" /> AI ready
            </span>
          </div>

          {results.length > 0 && (
            <ul className="mt-2 max-h-80 overflow-auto rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl divide-y divide-border/50">
              {results.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={t.slug}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.short}</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!q && (
            <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 pb-3 pt-1">
              <span className="text-xs text-muted-foreground mr-1">Popular:</span>
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => setQ(p)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border/70 bg-background/60 hover:bg-muted transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
