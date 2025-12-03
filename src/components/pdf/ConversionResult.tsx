import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { ConversionType } from "@/pages/PDFConvert";

interface ConversionResultProps {
  conversionType: ConversionType;
  imageUrls: string[];
  extractedText: string | null;
  onReset: () => void;
}

const ConversionResult = ({ conversionType, imageUrls, extractedText, onReset }: ConversionResultProps) => {
  const [copied, setCopied] = useState(false);

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `page_${index + 1}.png`;
    link.click();
  };

  const downloadAllImages = () => {
    imageUrls.forEach((url, index) => {
      setTimeout(() => downloadImage(url, index), index * 100);
    });
  };

  const downloadText = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted_text.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyText = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    toast({ title: "Copied!", description: "Text copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (conversionType === "images" && imageUrls.length > 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Conversion Complete!
          </h2>
          <p className="text-muted-foreground">
            {imageUrls.length} page{imageUrls.length !== 1 ? "s" : ""} converted to images
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={downloadAllImages} size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download All ({imageUrls.length})
          </Button>
          <Button onClick={onReset} variant="secondary" size="lg">
            Convert Another
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {imageUrls.map((url, index) => (
            <div 
              key={index} 
              className="group relative bg-card border border-border rounded-lg overflow-hidden"
            >
              <img 
                src={url} 
                alt={`Page ${index + 1}`} 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  size="sm" 
                  onClick={() => downloadImage(url, index)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Page {index + 1}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversionType === "text" && extractedText) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Text Extracted!
          </h2>
          <p className="text-muted-foreground">
            {extractedText.length.toLocaleString()} characters extracted
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={downloadText} size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download Text
          </Button>
          <Button onClick={copyText} variant="outline" size="lg">
            {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
            {copied ? "Copied!" : "Copy Text"}
          </Button>
          <Button onClick={onReset} variant="secondary" size="lg">
            Convert Another
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 max-h-96 overflow-auto">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
            {extractedText}
          </pre>
        </div>
      </div>
    );
  }

  return null;
};

export default ConversionResult;