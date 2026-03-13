import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Presentation, Upload, Download, RotateCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToPowerPoint = () => {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
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

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageImages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        pageImages.push(canvas.toDataURL("image/png"));
        setProgress(10 + (i / pdf.numPages) * 80);
      }

      setImages(pageImages);
      setProgress(100);
      toast({ title: "Pages Extracted!", description: `${pdf.numPages} slides ready as images.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSlide = (dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `slide_${index + 1}.png`;
    a.click();
  };

  const downloadAll = () => images.forEach((img, i) => downloadSlide(img, i));

  const handleReset = () => {
    setFile(null);
    setImages([]);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to PowerPoint - Convert PDF Slides Online</title>
        <meta name="description" content="Convert PDF pages to presentation slides. Free PDF to slide converter." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Presentation className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to Slides</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Convert PDF pages to slide images for presentations.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {images.length === 0 ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-ppt" />
                    <label htmlFor="pdf-ppt" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop PDF here or click to upload</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name}</p>}
                  <div className="flex justify-center">
                    <Button onClick={handleConvert} disabled={!file || isProcessing} size="lg">
                      <Presentation className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to Slides"}
                    </Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-wrap gap-4 justify-center mb-4">
                    <Button onClick={downloadAll}><Download className="w-4 h-4 mr-2" />Download All Slides</Button>
                    <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Start Over</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative group border border-border rounded-lg overflow-hidden">
                        <img src={img} alt={`Slide ${i + 1}`} className="w-full" />
                        <button onClick={() => downloadSlide(img, i)} className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-3 h-3 inline mr-1" />Slide {i + 1}
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

export default PDFToPowerPoint;
