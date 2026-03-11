import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, Download, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const SVGToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(f => f.type === "image/svg+xml" || f.name.endsWith(".svg"));
    if (selected.length === 0) return;
    setFiles(prev => [...prev, ...selected]);
    for (const f of selected) {
      const text = await f.text();
      const blob = new Blob([text], { type: "image/svg+xml" });
      setPreviews(prev => [...prev, URL.createObjectURL(blob)]);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const svgText = await files[i].text();
        // Render SVG to canvas then embed as PNG
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const img = new Image();
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        await new Promise<void>((resolve, reject) => {
          img.onload = async () => {
            canvas.width = Math.max(img.width || 800, 400);
            canvas.height = Math.max(img.height || 600, 300);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);

            const pngDataUrl = canvas.toDataURL("image/png");
            const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), c => c.charCodeAt(0));
            const pngImage = await pdfDoc.embedPng(pngBytes);
            const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
            page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });

        setProgress(10 + ((i + 1) / files.length) * 80);
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(pdfBlob));
      setProgress(100);
      toast({ title: "PDF Created!", description: `${files.length} SVG files converted.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert SVG to PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    previews.forEach(URL.revokeObjectURL);
    setPreviews([]);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>SVG to PDF - Convert Vector Graphics to PDF</title>
        <meta name="description" content="Convert SVG vector files to high-quality PDF documents. Free online converter." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">SVG to PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Convert SVG vector graphics to PDF documents.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input type="file" accept=".svg" multiple onChange={handleFileChange} className="hidden" id="svg-upload" />
                    <label htmlFor="svg-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Upload SVG files</p>
                      <p className="text-sm text-muted-foreground">Supports .svg files, multiple allowed</p>
                    </label>
                  </div>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {previews.map((p, i) => (
                        <img key={i} src={p} alt={`SVG ${i + 1}`} className="w-full aspect-square object-contain bg-card border border-border rounded-lg p-2" />
                      ))}
                    </div>
                  )}
                  {files.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleConvert} disabled={isProcessing} size="lg">
                        {isProcessing ? "Converting..." : `Convert ${files.length} SVG to PDF`}
                      </Button>
                      <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Clear</Button>
                    </div>
                  )}
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">PDF Ready!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="svg-to-pdf.pdf" className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                      <Download className="w-5 h-5" /> Download PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">Convert More</Button>
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

export default SVGToPDF;
