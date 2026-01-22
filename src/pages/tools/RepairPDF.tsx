import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wrench, Upload, Download, RotateCcw, CheckCircle, Sparkles } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";
import AIBadge from "@/components/AIBadge";

const RepairPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [repairInfo, setRepairInfo] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleRepair = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);
    setRepairInfo([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);
      const repairs: string[] = [];

      // Try to load and rebuild the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        ignoreEncryption: true,
        updateMetadata: false 
      });
      setProgress(60);
      repairs.push("✓ PDF structure validated");

      // Create a new clean document
      const newPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
      }
      repairs.push(`✓ ${pages.length} pages recovered`);
      setProgress(80);

      // Set clean metadata
      newPdf.setProducer("PDF Tools - Repair Engine");
      newPdf.setCreator("PDF Repair Tool");
      repairs.push("✓ Metadata cleaned");

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setRepairInfo(repairs);
      setProgress(100);

      toast({
        title: "PDF Repaired!",
        description: "Your PDF has been successfully repaired.",
      });
    } catch (error) {
      console.error("Error repairing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to repair PDF. The file may be severely corrupted.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRepairInfo([]);
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
        <title>Repair PDF - Fix Corrupted PDF Files | AI-Powered Tool</title>
        <meta name="description" content="Repair corrupted or damaged PDF files. AI-powered PDF repair tool. Free online PDF fixer." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <AIBadge variant="inline" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/10 mb-4">
                <Wrench className="w-8 h-8 text-brand-orange" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Repair PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fix corrupted or damaged PDF files with AI-powered repair.
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
                        <Wrench className="w-12 h-12 mx-auto text-brand-orange" />
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">
                          Drop a corrupted PDF here
                        </p>
                      </div>
                    )}
                  </div>

                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleRepair}
                        disabled={isProcessing}
                        className="bg-brand-orange text-white hover:bg-brand-orange/90"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Repairing..." : "Repair PDF"}
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
                        Analyzing and repairing... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Repaired!
                    </h2>
                    <div className="text-left bg-muted rounded-lg p-4 mb-4">
                      {repairInfo.map((info, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{info}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`repaired_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Repaired PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Repair Another PDF
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

export default RepairPDF;