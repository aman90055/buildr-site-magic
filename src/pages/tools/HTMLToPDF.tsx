import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Globe, Download, RotateCcw } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const HTMLToPDF = () => {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head><title>My Page</title></head>
<body>
  <h1>Hello World</h1>
  <p>This is a sample HTML document that will be converted to PDF.</p>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
    <li>Feature 3</li>
  </ul>
</body>
</html>`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const stripHtml = (htmlStr: string): string[] => {
    const lines: string[] = [];
    const tmp = htmlStr
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<h[1-6][^>]*>/gi, "\n### ")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n  • ")
      .replace(/<\/li>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<p[^>]*>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');

    tmp.split("\n").forEach(l => {
      const trimmed = l.trim();
      if (trimmed) lines.push(trimmed);
    });
    return lines;
  };

  const handleConvert = async () => {
    if (!html.trim()) {
      toast({ title: "No HTML", description: "Please enter HTML content.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setProgress(20);
    try {
      const textLines = stripHtml(html);
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const margin = 50;
      const pageWidth = 595;
      const pageHeight = 842;
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      setProgress(50);
      for (const line of textLines) {
        const isHeading = line.startsWith("### ");
        const text = isHeading ? line.replace("### ", "") : line;
        const fontSize = isHeading ? 18 : 12;
        const lineFont = isHeading ? boldFont : font;
        const lineHeight = fontSize * 1.6;

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
        if (isHeading) y -= 6;
      }

      setProgress(90);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "PDF Created!", description: "HTML converted to PDF successfully." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert HTML.", variant: "destructive" });
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
        <title>HTML to PDF - Convert Web Pages to PDF Online</title>
        <meta name="description" content="Convert HTML content to professional PDF documents. Free online HTML to PDF." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">HTML to PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Paste HTML code and convert it to a clean PDF document.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <Textarea placeholder="Paste your HTML code here..." value={html} onChange={e => setHtml(e.target.value)} className="min-h-[300px] font-mono text-sm" />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleConvert} disabled={isProcessing || !html.trim()} size="lg">
                      <Globe className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to PDF"}
                    </Button>
                    <Button variant="outline" onClick={() => setHtml("")}><RotateCcw className="w-4 h-4 mr-2" />Clear</Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Globe className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">PDF Ready!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="html-document.pdf" className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
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

export default HTMLToPDF;
