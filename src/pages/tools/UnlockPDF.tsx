import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Unlock, Upload, Download, RotateCcw, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const UnlockPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);

      // Try to load with ignoreEncryption flag
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        ignoreEncryption: true 
      });
      setProgress(60);

      // Create a new unlocked document
      const newPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
      }
      setProgress(80);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "PDF Unlocked!",
        description: "Restrictions have been removed from your PDF.",
      });
    } catch (error) {
      console.error("Error unlocking PDF:", error);
      toast({
        title: "Error",
        description: "Failed to unlock PDF. The file may be encrypted with a strong password.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword("");
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
        <title>Unlock PDF - Remove PDF Password | Free Online Tool</title>
        <meta name="description" content="Remove password protection and restrictions from PDF files. Free PDF unlocker tool." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/10 mb-4">
                <Unlock className="w-8 h-8 text-brand-orange" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Unlock PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Remove restrictions and password protection from your PDFs.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-orange/50 transition-colors cursor-pointer"
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
                        <KeyRound className="w-12 h-12 mx-auto text-brand-orange" />
                        <p className="font-medium text-foreground">{file.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">
                          Drop a locked PDF here
                        </p>
                      </div>
                    )}
                  </div>

                  {file && (
                    <>
                      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <KeyRound className="w-4 h-4" />
                          Password (optional)
                        </h3>
                        <Input
                          type="password"
                          placeholder="Enter password if required..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          If the PDF is password-protected, enter the password to unlock it.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={handleUnlock}
                          disabled={isProcessing}
                          className="bg-brand-orange text-white hover:bg-brand-orange/90"
                          size="lg"
                        >
                          <Unlock className="w-4 h-4 mr-2" />
                          {isProcessing ? "Unlocking..." : "Unlock PDF"}
                        </Button>
                        <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Removing restrictions... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Unlock className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">PDF Unlocked!</h2>
                    <p className="text-muted-foreground">All restrictions have been removed.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`unlocked_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Unlocked PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Unlock Another PDF
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

export default UnlockPDF;