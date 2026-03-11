import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileCode, Download, RotateCcw } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const MarkdownToPDF = () => {
  const [md, setMd] = useState(`# My Document

## Introduction
This is a **sample** markdown document that will be converted to PDF.

## Features
- Easy to use
- Fast conversion
- Professional output

## Conclusion
Thank you for using our tool!`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!md.trim()) {
      toast({ title: "No content", description: "Please enter Markdown content.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setProgress(20);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);
      const margin = 50;
      const pageWidth = 595;
      const pageHeight = 842;
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      const lines = md.split("\n");
      setProgress(40);

      for (const line of lines) {
        let fontSize = 12;
        let lineFont = font;
        let text = line;
        let lineHeight = 20;
        let extraSpace = 0;

        if (line.startsWith("### ")) { fontSize = 16; lineFont = boldFont; text = line.slice(4); extraSpace = 8; }
        else if (line.startsWith("## ")) { fontSize = 20; lineFont = boldFont; text = line.slice(3); extraSpace = 12; }
        else if (line.startsWith("# ")) { fontSize = 26; lineFont = boldFont; text = line.slice(2); extraSpace = 16; }
        else if (line.startsWith("- ") || line.startsWith("* ")) { text = `  • ${line.slice(2)}`; }
        else if (line.startsWith("```")) { continue; }
        else if (line.startsWith("    ") || line.startsWith("\t")) { lineFont = monoFont; fontSize = 10; }
        else { text = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1"); }

        lineHeight = fontSize * 1.6;
        if (!text.trim()) { y -= 10; continue; }

        // Word wrap
        const words = text.split(" ");
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (lineFont.widthOfTextAtSize(testLine, fontSize) > pageWidth - margin * 2 && currentLine) {
            if (y < margin + lineHeight) { page = pdfDoc.addPage([pageWidth, pageHeight]); y = pageHeight - margin; }
            page.drawText(currentLine, { x: margin, y, size: fontSize, font: lineFont, color: rgb(0.1, 0.1, 0.1) });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          if (y < margin + lineHeight) { page = pdfDoc.addPage([pageWidth, pageHeight]); y = pageHeight - margin; }
          page.drawText(currentLine, { x: margin, y, size: fontSize, font: lineFont, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
        }
        y -= extraSpace;
      }

      setProgress(90);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "PDF Created!", description: "Markdown converted to PDF." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>Markdown to PDF - Convert MD to PDF Online</title>
        <meta name="description" content="Convert Markdown documents to professionally formatted PDFs. Free online converter." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <FileCode className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Markdown to PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Write or paste Markdown and convert it to a beautifully formatted PDF.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <Textarea placeholder="# Your Markdown here..." value={md} onChange={e => setMd(e.target.value)} className="min-h-[300px] font-mono text-sm" />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleConvert} disabled={isProcessing || !md.trim()} size="lg">
                      <FileCode className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to PDF"}
                    </Button>
                    <Button variant="outline" onClick={() => setMd("")}><RotateCcw className="w-4 h-4 mr-2" />Clear</Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <FileCode className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">PDF Ready!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="markdown-document.pdf" className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                      <Download className="w-5 h-5" /> Download PDF
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

export default MarkdownToPDF;
