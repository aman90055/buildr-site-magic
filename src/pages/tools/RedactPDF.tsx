import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { EyeOff, Upload, Download, RotateCcw, Sparkles } from "lucide-react";
import { rasterPdf } from "@/lib/pdfToolOperations";
import { toast } from "@/hooks/use-toast";
import AIBadge from "@/components/AIBadge";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

const RedactPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [redactText, setRedactText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPremium } = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      if (!checkFileSizeLimit(selectedFile, isPremium)) return;
      setFile(selectedFile);
    }
  };

  const handleRedact = async () => {
    if (!file || !redactText.trim()) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      const pdfBytes = await rasterPdf(file, undefined, setProgress, redactText.trim());
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "PDF Redacted!",
        description: "Matching lines removed from an image-only PDF.",
      });
    } catch (error) {
      console.error("Error redacting PDF:", error);
      toast({
        title: "Error",
        description: "Text not found or PDF unreadable. Enter exact text on a single line.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRedactText("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Redact PDF - Black Out Sensitive Information | AI-Powered</title>
        <meta name="description" content="Redact sensitive information from PDF documents. AI-powered redaction tool. Free PDF redactor." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content="Redact PDF - Black Out Sensitive Information | AI-Powered" />
        <meta property="og:description" content="Redact sensitive information from PDF documents. AI-powered redaction tool. Free PDF redactor." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Redact PDF - Black Out Sensitive Information | AI-Powered" />
        <meta name="twitter:description" content="Redact sensitive information from PDF documents. AI-powered redaction tool. Free PDF redactor." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
                <EyeOff className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Redact PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Black out lines containing your text and rebuild the PDF without recoverable original text.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-destructive/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="space-y-2">
                        <EyeOff className="w-12 h-12 mx-auto text-destructive" />
                        <p className="font-medium text-foreground">{file.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">
                          Drop a PDF here or click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  {file && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">Redaction Options</h3>
                      <Input
                        placeholder="Exact text to find and redact..."
                        value={redactText}
                        onChange={(e) => setRedactText(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Matching lines are blacked out. Output pages become images, with no original text, links or metadata. Scanned text is not supported; inspect every page before sharing.
                      </p>
                    </div>
                  )}

                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleRedact}
                        disabled={isProcessing || !redactText.trim()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Redacting..." : "Redact PDF"}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Processing redaction... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <EyeOff className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">PDF Redacted!</h2>
                    <p className="text-muted-foreground">Sensitive information has been redacted.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`redacted_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Redacted PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Redact Another PDF
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

export default RedactPDF;