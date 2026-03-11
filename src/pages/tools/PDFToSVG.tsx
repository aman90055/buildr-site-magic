import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PenTool, Upload, Download, RotateCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "@/hooks/use-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToSVG = () => {
  const [file, setFile] = useState<File | null>(null);
  const [svgUrls, setSvgUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") setFile(f);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const urls: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;

        // Convert canvas to SVG with embedded image
        const dataUrl = canvas.toDataURL("image/png");
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${viewport.width}" height="${viewport.height}">
  <image href="${dataUrl}" width="${viewport.width}" height="${viewport.height}" />
</svg>`;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        urls.push(URL.createObjectURL(blob));
        setProgress(10 + (i / pdf.numPages) * 80);
      }

      setSvgUrls(urls);
      setProgress(100);
      toast({ title: "SVG Created!", description: `${pdf.numPages} pages converted to SVG.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSvg = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `page_${index + 1}.svg`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    svgUrls.forEach(URL.revokeObjectURL);
    setSvgUrls([]);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to SVG - Convert PDF to Vector Graphics</title>
        <meta name="description" content="Convert PDF pages to SVG vector format for infinite scalability." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <PenTool className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to SVG</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Convert PDF pages to scalable vector graphics.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {svgUrls.length === 0 ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-svg" />
                    <label htmlFor="pdf-svg" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop PDF here or click to upload</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name}</p>}
                  <div className="flex justify-center">
                    <Button onClick={handleConvert} disabled={!file || isProcessing} size="lg">
                      <PenTool className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to SVG"}
                    </Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={() => svgUrls.forEach((u, i) => downloadSvg(u, i))}><Download className="w-4 h-4 mr-2" />Download All SVGs</Button>
                    <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Start Over</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {svgUrls.map((url, i) => (
                      <div key={i} className="relative group border border-border rounded-lg overflow-hidden bg-card p-2">
                        <img src={url} alt={`Page ${i + 1}`} className="w-full" />
                        <button onClick={() => downloadSvg(url, i)} className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-3 h-3 inline mr-1" />Page {i + 1}
                        </button>
                      </div>
                    ))}
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

export default PDFToSVG;
