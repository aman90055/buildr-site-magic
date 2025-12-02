import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PageSelectorProps {
  totalPages: number;
  selectedPages: number[];
  onSelectionChange: (pages: number[]) => void;
  disabled?: boolean;
}

const PageSelector = ({
  totalPages,
  selectedPages,
  onSelectionChange,
  disabled,
}: PageSelectorProps) => {
  const [rangeInput, setRangeInput] = useState("");

  const togglePage = (page: number) => {
    if (disabled) return;
    if (selectedPages.includes(page)) {
      onSelectionChange(selectedPages.filter((p) => p !== page));
    } else {
      onSelectionChange([...selectedPages, page].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onSelectionChange(Array.from({ length: totalPages }, (_, i) => i + 1));
  };

  const selectNone = () => {
    if (disabled) return;
    onSelectionChange([]);
  };

  const selectOdd = () => {
    if (disabled) return;
    onSelectionChange(
      Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 1)
    );
  };

  const selectEven = () => {
    if (disabled) return;
    onSelectionChange(
      Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 0)
    );
  };

  const applyRange = () => {
    if (disabled || !rangeInput.trim()) return;
    
    const pages = new Set<number>();
    const parts = rangeInput.split(",");
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            pages.add(i);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          pages.add(num);
        }
      }
    }
    
    onSelectionChange(Array.from(pages).sort((a, b) => a - b));
    setRangeInput("");
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-secondary/50 border-b border-border">
        <h3 className="font-medium text-foreground">Select Pages to Extract</h3>
        <p className="text-sm text-muted-foreground">
          {selectedPages.length} of {totalPages} pages selected
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={selectAll} disabled={disabled}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={selectNone} disabled={disabled}>
            Select None
          </Button>
          <Button variant="outline" size="sm" onClick={selectOdd} disabled={disabled}>
            Odd Pages
          </Button>
          <Button variant="outline" size="sm" onClick={selectEven} disabled={disabled}>
            Even Pages
          </Button>
        </div>

        {/* Range Input */}
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 1-5, 8, 10-12"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyRange()}
            disabled={disabled}
            className="flex-1"
          />
          <Button onClick={applyRange} disabled={disabled || !rangeInput.trim()}>
            Apply
          </Button>
        </div>
      </div>

      {/* Page Grid */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => togglePage(page)}
              disabled={disabled}
              className={`
                w-full aspect-square rounded-lg text-sm font-medium transition-all
                ${selectedPages.includes(page)
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSelector;
