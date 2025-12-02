import { Button } from "@/components/ui/button";
import { Loader2, Scissors, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SplitActionsProps {
  selectedCount: number;
  totalPages: number;
  isProcessing: boolean;
  progress: number;
  onSplit: () => void;
  onReset: () => void;
}

const SplitActions = ({
  selectedCount,
  totalPages,
  isProcessing,
  progress,
  onSplit,
  onReset,
}: SplitActionsProps) => {
  const canSplit = selectedCount > 0;

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Extracting pages...</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onSplit}
          disabled={!canSplit || isProcessing}
          size="lg"
          className="flex-1 gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Scissors className="w-5 h-5" />
              Extract {selectedCount} {selectedCount === 1 ? "Page" : "Pages"}
            </>
          )}
        </Button>

        <Button
          onClick={onReset}
          disabled={isProcessing}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
      </div>

      {!canSplit && (
        <p className="text-sm text-muted-foreground text-center">
          Select at least 1 page to extract
        </p>
      )}
    </div>
  );
};

export default SplitActions;
