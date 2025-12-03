import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, RotateCcw } from "lucide-react";
import type { ConversionType } from "@/pages/PDFConvert";

interface ConvertActionsProps {
  isProcessing: boolean;
  progress: number;
  conversionType: ConversionType;
  onConvert: () => void;
  onReset: () => void;
}

const ConvertActions = ({ isProcessing, progress, conversionType, onConvert, onReset }: ConvertActionsProps) => {
  const buttonText = conversionType === "images" ? "Convert to Images" : "Extract Text";
  const processingText = conversionType === "images" ? "Converting..." : "Extracting...";

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{processingText}</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex gap-3">
        <Button
          onClick={onConvert}
          disabled={isProcessing}
          className="flex-1"
          size="lg"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
          {isProcessing ? processingText : buttonText}
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

export default ConvertActions;