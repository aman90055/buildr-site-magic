import { X, ArrowDownAZ } from "lucide-react";

export type SortKey = "default" | "az" | "za";

export interface FilterChipOption {
  key: string;
  label: string;
  icon?: any;
  count?: number;
}

export const FilterChip = ({
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
    aria-pressed={active}
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

const SORT_LABELS: Record<SortKey, string> = {
  default: "Recommended",
  az: "A → Z",
  za: "Z → A",
};

/**
 * Shared filter bar used by the home page tool browser and the /tools page.
 * Quick filters first, then a divider, then category chips.
 * Sticks under the header while scrolling and scrolls sideways on small screens.
 */
export default function ToolFilterBar({
  quick,
  categories,
  active,
  onChange,
  sort,
  onSortChange,
  canClear,
  onClear,
  sticky = true,
}: {
  quick: FilterChipOption[];
  categories: FilterChipOption[];
  active: string;
  onChange: (key: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  canClear: boolean;
  onClear: () => void;
  sticky?: boolean;
}) {
  return (
    <div
      className={`${sticky ? "sticky top-16 z-30" : ""} -mx-4 px-4 py-2 mb-8 bg-background/80 backdrop-blur-xl border-y border-border/40 sm:border-y-0 sm:bg-transparent sm:backdrop-blur-none`}
    >
      <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quick.map((o) => (
          <FilterChip
            key={o.key}
            active={active === o.key}
            onClick={() => onChange(o.key)}
            icon={o.icon}
            label={o.label}
            count={o.count}
          />
        ))}

        <div className="shrink-0 h-6 border-l border-border/60 mx-1" aria-hidden="true" />

        {categories.map((o) => (
          <FilterChip
            key={o.key}
            active={active === o.key}
            onClick={() => onChange(o.key)}
            icon={o.icon}
            label={o.label}
            count={o.count}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
        <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowDownAZ className="w-3.5 h-3.5" />
          <span className="sr-only sm:not-sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label="Sort tools"
            className="rounded-full border border-border/60 bg-card/60 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </label>

        {canClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 backdrop-blur px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

export function sortTools<T>(list: T[], sort: SortKey, nameOf: (item: T) => string): T[] {
  if (sort === "default") return list;
  const sorted = [...list].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
  return sort === "az" ? sorted : sorted.reverse();
}
