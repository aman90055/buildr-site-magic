import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

interface SmartProgressProps {
  progress: number;
  eta?: string;
  label?: string;
  onCancel?: () => void;
  showCancel?: boolean;
}

/**
 * SmartProgress - reusable progress UI with %, ETA, and cancel button.
 * Used across all heavy PDF / image tools for consistent UX.
 */
export const SmartProgress = ({
  progress,
  eta,
  label = "Processing",
  onCancel,
  showCancel = true,
}: SmartProgressProps) => {
  return (
    <div className="w-full space-y-2 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>{label}…</span>
          {eta && <span className="text-xs text-muted-foreground">{eta}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary tabular-nums">
            {Math.round(progress)}%
          </span>
          {showCancel && onCancel && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onCancel}
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
