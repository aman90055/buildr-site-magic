import { Slider } from "@/components/ui/slider";
import type { CompressionLevel } from "@/pages/PDFCompress";

interface CompressionOptionsProps {
  compressionLevel: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
  disabled?: boolean;
}

const CompressionOptions = ({ compressionLevel, onLevelChange, disabled }: CompressionOptionsProps) => {
  const getLabel = (level: number) => {
    if (level <= 33) return "Low compression - Best quality";
    if (level <= 66) return "Medium compression - Balanced";
    return "High compression - Smallest size";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Compression Level</h3>
        <span className="text-sm font-medium text-primary">{compressionLevel}%</span>
      </div>
      
      <Slider
        value={[compressionLevel]}
        onValueChange={(value) => onLevelChange(value[0])}
        min={1}
        max={100}
        step={1}
        disabled={disabled}
        className="mb-3"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>1</span>
        <span>50</span>
        <span>100</span>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        {getLabel(compressionLevel)}
      </p>
    </div>
  );
};

export default CompressionOptions;
