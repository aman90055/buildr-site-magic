import { Button } from "@/components/ui/button";
import { Loader2, Merge, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MergeActionsProps {
  filesCount: number;
  isProcessing: boolean;
  progress: number;
  onMerge: () => void;
  onReset: () => void;
}

const MergeActions = ({
  filesCount,
  isProcessing,
  progress,
  onMerge,
  onReset,
}: MergeActionsProps) => {
  const canMerge = filesCount >= 2;

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Merging PDFs...</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onMerge}
          disabled={!canMerge || isProcessing}
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
              <Merge className="w-5 h-5" />
              Merge {filesCount} PDFs
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
          Clear All
        </Button>
      </div>

      {!canMerge && filesCount > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Add at least 2 PDF files to merge
        </p>
      )}
    </div>
  );
};

export default MergeActions;
