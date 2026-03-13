import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, Download, RotateCcw, Copy } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
  }, [isPremium]);

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        text += `--- Page ${i} ---\n${pageText}\n\n`;
        setProgress(10 + (i / pdf.numPages) * 80);
      }
      setExtractedText(text);
      setProgress(100);
      toast({ title: "Text Extracted!", description: `${pdf.numPages} pages processed.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to extract text.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name?.replace(".pdf", "") || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast({ title: "Copied!", description: "Text copied to clipboard." });
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText("");
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to Word/Text - Extract Text from PDF Online</title>
        <meta name="description" content="Extract text from PDF documents. Free PDF to text converter." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to Word / Text</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Extract all text content from your PDF for editing in any word processor.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!extractedText ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-word" />
                    <label htmlFor="pdf-word" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop PDF here or click to upload</p>
                      <p className="text-sm text-muted-foreground">Supports PDF files</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleExtract} disabled={!file || isProcessing} size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      {isProcessing ? "Extracting..." : "Extract Text"}
                    </Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <Textarea value={extractedText} readOnly className="min-h-[300px] font-mono text-sm" />
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download as TXT</Button>
                    <Button variant="outline" onClick={handleCopy}><Copy className="w-4 h-4 mr-2" />Copy Text</Button>
                    <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Convert Another</Button>
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

export default PDFToWord;
