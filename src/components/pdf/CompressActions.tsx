import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Minimize2, RotateCcw } from "lucide-react";

interface CompressActionsProps {
  isProcessing: boolean;
  progress: number;
  onCompress: () => void;
  onReset: () => void;
}

const CompressActions = ({ isProcessing, progress, onCompress, onReset }: CompressActionsProps) => {
  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Compressing PDF...</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex gap-3">
        <Button
          onClick={onCompress}
          disabled={isProcessing}
          className="flex-1"
          size="lg"
        >
          <Minimize2 className="w-5 h-5 mr-2" />
          {isProcessing ? "Compressing..." : "Compress PDF"}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          disabled={isProcessing}
          size="lg"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CompressActions;