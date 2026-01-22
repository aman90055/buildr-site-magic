import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScanText, Upload, Copy, Download, RotateCcw, ImageIcon, Sparkles } from "lucide-react";
import { useAIOCR } from "@/hooks/useAIOCR";
import { toast } from "@/hooks/use-toast";
import AIBadge from "@/components/AIBadge";

const OCR = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processImage, isProcessing, progress, extractedText, reset } = useAIOCR();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleExtract = async () => {
    if (!preview) return;
    await processImage(preview);
  };

  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    }
  };

  const handleDownload = () => {
    if (extractedText) {
      const blob = new Blob([extractedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ocr_${file?.name?.replace(/\.[^/.]+$/, "") || "extracted"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>OCR - Extract Text from Images | AI-Powered OCR Tool</title>
        <meta
          name="description"
          content="Extract text from images using AI-powered OCR. 99.9% accuracy for scanned documents, photos, and screenshots. Free online OCR tool."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <AIBadge variant="default" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-ai/10 mb-4">
                <ScanText className="w-8 h-8 text-brand-ai" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Smart OCR
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Extract text from images with 99.9% accuracy using AI-powered recognition.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {!extractedText ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-ai/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {preview ? (
                      <div className="space-y-4">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <p className="text-sm text-muted-foreground">{file?.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-foreground">
                            Drop an image here or click to upload
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Supports JPG, PNG, GIF, WebP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {preview && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleExtract}
                        disabled={isProcessing}
                        className="bg-gradient-ai text-white"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Extracting..." : "Extract Text with AI"}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  )}

                  {/* Progress */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        AI is analyzing your image... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-brand-ai" />
                        Extracted Text
                      </h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={extractedText}
                      readOnly
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Extract from Another Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OCR;