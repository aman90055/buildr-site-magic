import type { CompressionLevel } from "@/pages/PDFCompress";

interface CompressionOptionsProps {
  compressionLevel: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
  disabled?: boolean;
}

const CompressionOptions = ({ compressionLevel, onLevelChange, disabled }: CompressionOptionsProps) => {
  const options: { level: CompressionLevel; label: string; description: string }[] = [
    {
      level: "low",
      label: "Low Compression",
      description: "Best quality, minimal size reduction",
    },
    {
      level: "medium",
      label: "Medium Compression",
      description: "Balanced quality and size",
    },
    {
      level: "high",
      label: "High Compression",
      description: "Maximum size reduction",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold text-foreground mb-4">Compression Level</h3>
      
      <div className="grid gap-3">
        {options.map((option) => (
          <label
            key={option.level}
            className={`
              flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
              ${compressionLevel === option.level
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input
              type="radio"
              name="compression"
              value={option.level}
              checked={compressionLevel === option.level}
              onChange={() => onLevelChange(option.level)}
              disabled={disabled}
              className="sr-only"
            />
            
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${compressionLevel === option.level
                ? "border-primary"
                : "border-muted-foreground"
              }
            `}>
              {compressionLevel === option.level && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-foreground">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CompressionOptions;