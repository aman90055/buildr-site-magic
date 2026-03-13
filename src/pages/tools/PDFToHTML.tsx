import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Globe, Upload, Download, RotateCcw, Copy } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToHTML = () => {
  const [file, setFile] = useState<File | null>(null);
  const [htmlOutput, setHtmlOutput] = useState("");
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
      let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${file.name}</title>\n  <style>\n    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }\n    .page { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #eee; }\n    .page-header { color: #666; font-size: 12px; margin-bottom: 16px; }\n    p { margin: 8px 0; }\n  </style>\n</head>\n<body>\n`;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        html += `  <div class="page">\n    <div class="page-header">Page ${i}</div>\n`;

        // Group by Y position for paragraphs
        const rows: Map<number, string[]> = new Map();
        content.items.forEach((item: any) => {
          const y = Math.round(item.transform[5] / 5) * 5;
          if (!rows.has(y)) rows.set(y, []);
          rows.get(y)!.push(item.str);
        });

        Array.from(rows.entries())
          .sort((a, b) => b[0] - a[0])
          .forEach(([_, texts]) => {
            const line = texts.join(" ").trim();
            if (line) html += `    <p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>\n`;
          });

        html += `  </div>\n`;
        setProgress(10 + (i / pdf.numPages) * 80);
      }

      html += `</body>\n</html>`;
      setHtmlOutput(html);
      setProgress(100);
      toast({ title: "HTML Generated!", description: `${pdf.numPages} pages converted to HTML.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlOutput], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name?.replace(".pdf", "") || "document"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlOutput);
    toast({ title: "Copied!", description: "HTML copied to clipboard." });
  };

  const handleReset = () => {
    setFile(null);
    setHtmlOutput("");
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to HTML - Convert PDF to Web Pages Online</title>
        <meta name="description" content="Convert PDF documents to clean HTML pages. Free PDF to HTML converter." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to HTML</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Convert PDF documents to clean, structured HTML.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!htmlOutput ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-html" />
                    <label htmlFor="pdf-html" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop PDF here or click to upload</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name}</p>}
                  <div className="flex justify-center">
                    <Button onClick={handleExtract} disabled={!file || isProcessing} size="lg">
                      <Globe className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to HTML"}
                    </Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <Textarea value={htmlOutput} readOnly className="min-h-[300px] font-mono text-sm" />
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download HTML</Button>
                    <Button variant="outline" onClick={handleCopy}><Copy className="w-4 h-4 mr-2" />Copy</Button>
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

export default PDFToHTML;
