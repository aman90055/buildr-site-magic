import { Image, FileText } from "lucide-react";
import type { ConversionType } from "@/pages/PDFConvert";

interface ConversionOptionsProps {
  conversionType: ConversionType;
  onTypeChange: (type: ConversionType) => void;
  disabled?: boolean;
}

const ConversionOptions = ({ conversionType, onTypeChange, disabled }: ConversionOptionsProps) => {
  const options: { type: ConversionType; label: string; description: string; icon: typeof Image }[] = [
    {
      type: "images",
      label: "PDF to Images",
      description: "Convert each page to a PNG image",
      icon: Image,
    },
    {
      type: "text",
      label: "PDF to Text",
      description: "Extract all text content from the PDF",
      icon: FileText,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold text-foreground mb-4">Output Format</h3>
      
      <div className="grid gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={option.type}
              className={`
                flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
                ${conversionType === option.type
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input
                type="radio"
                name="conversion"
                value={option.type}
                checked={conversionType === option.type}
                onChange={() => onTypeChange(option.type)}
                disabled={disabled}
                className="sr-only"
              />
              
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${conversionType === option.type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>

              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${conversionType === option.type
                  ? "border-primary"
                  : "border-muted-foreground"
                }
              `}>
                {conversionType === option.type && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionOptions;