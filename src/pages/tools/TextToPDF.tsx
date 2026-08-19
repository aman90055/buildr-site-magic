import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Type, Download } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const TextToPDF = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) { toast({ title: "Error", description: "Please enter some text.", variant: "destructive" }); return; }
    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const margin = 50, pageW = 595, pageH = 842, maxW = pageW - margin * 2;

      let page = pdf.addPage([pageW, pageH]);
      let y = pageH - margin;

      if (title.trim()) {
        const ts = Math.min(fontSize * 2, 28);
        page.drawText(title, { x: margin, y, size: ts, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        y -= ts + 20;
      }

      for (const line of text.split("\n")) {
        const words = line.split(" ");
        let cur = "";
        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w;
          if (font.widthOfTextAtSize(test, fontSize) > maxW && cur) {
            if (y < margin + fontSize) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
            page.drawText(cur, { x: margin, y, size: fontSize, font, color: rgb(0.15, 0.15, 0.15) });
            y -= fontSize + 4;
            cur = w;
          } else cur = test;
        }
        if (cur) {
          if (y < margin + fontSize) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
          page.drawText(cur, { x: margin, y, size: fontSize, font, color: rgb(0.15, 0.15, 0.15) });
          y -= fontSize + 4;
        }
        y -= fontSize * 0.5;
      }

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "PDF generated." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); };

  return (
    <>
      <Helmet><title>Text to PDF Converter | PDF Tools</title><meta name="description" content="Convert plain text to formatted PDF documents." />
        <link rel="canonical" href={`https://avwebservices.online${typeof window !== "undefined" ? window.location.pathname : "/"}`} />
        <meta property="og:url" content={`https://avwebservices.online${typeof window !== "undefined" ? window.location.pathname : "/"}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content="Text to PDF Converter | PDF Tools" />
        <meta property="og:description" content="Convert plain text to formatted PDF documents." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Text to PDF Converter | PDF Tools" />
        <meta name="twitter:description" content="Convert plain text to formatted PDF documents." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "HowTo",
          name: "Text to PDF Converter | PDF Tools", description: "Convert plain text to formatted PDF documents.",
          totalTime: "PT1M",
          step: [
            { "@type": "HowToStep", position: 1, name: "Add your file", text: "Select or drag your file into the tool. Everything is processed in your browser, so nothing is uploaded." },
            { "@type": "HowToStep", position: 2, name: "Choose your options", text: "Adjust the available settings for your output, then start the conversion." },
            { "@type": "HowToStep", position: 3, name: "Download the result", text: "Save the finished file to your device. It is free with no file size limit." },
          ],
        })}</script></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center"><Type className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Text to PDF</h1>
              <p className="text-muted-foreground">Convert plain text to professional PDF documents.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title (optional)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document Title" /></div>
                <div className="space-y-2"><Label>Font Size</Label><Input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min={8} max={36} /></div>
                <div className="space-y-2"><Label>Text Content</Label><Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here..." rows={12} /></div>
                <Button onClick={handleGenerate} disabled={isProcessing} className="w-full" size="lg">{isProcessing ? "Generating..." : "Generate PDF"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">PDF Generated!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="text-document.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download PDF</a>
                  <Button variant="secondary" onClick={handleReset}>Create Another</Button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TextToPDF;
