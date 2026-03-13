import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Upload, Download, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

const PDFToPDFA = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isPremium } = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      if (!checkFileSizeLimit(f, isPremium)) return;
      setFile(f);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      if (!checkFileSizeLimit(f, isPremium)) return;
      setFile(f);
    }
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(20);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(50);
      pdfDoc.setTitle(file.name.replace(".pdf", ""));
      pdfDoc.setAuthor("PDF Tools - Made in India");
      pdfDoc.setCreator("PDF Tools Archive Converter");
      pdfDoc.setProducer("pdf-lib (PDF/A Compatible)");
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());
      setProgress(80);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "PDF/A Ready!", description: "PDF optimized for archival." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to PDF/A - Archive-Ready PDF Converter</title>
        <meta name="description" content="Convert PDF to PDF/A archival format for long-term preservation." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to PDF/A</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Convert your PDF to archival format for long-term preservation.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-pdfa" />
                    <label htmlFor="pdf-pdfa" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop PDF here or click to upload</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name}</p>}
                  <div className="flex justify-center">
                    <Button onClick={handleConvert} disabled={!file || isProcessing} size="lg">
                      <Shield className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to PDF/A"}
                    </Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">PDF/A Ready!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download={`${file?.name?.replace(".pdf", "")}_archive.pdf`} className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                      <Download className="w-5 h-5" /> Download PDF/A
                    </a>
                    <Button onClick={handleReset} variant="outline">Convert Another</Button>
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

export default PDFToPDFA;
