import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { FileImage, Upload, Download, RotateCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToImage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdf = acceptedFiles.find((f) => f.type === "application/pdf");
    if (pdf) {
      if (pdf.size > MAX_FILE_SIZE) {
        toast.error("File exceeds the 50MB limit. Please choose a smaller file.");
        return;
      }
      setPdfFile(pdf);
      setImages([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const convertToImages = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageImages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        pageImages.push(canvas.toDataURL("image/png"));
      }

      setImages(pageImages);
      toast.success(`Converted ${pageImages.length} pages to images!`);
    } catch (error) {
      toast.error("Failed to convert PDF");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `page-${index + 1}.png`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => downloadImage(img, i));
  };

  const reset = () => {
    setPdfFile(null);
    setImages([]);
  };

  return (
    <>
      <Helmet>
        <title>PDF to Image - Convert PDF Pages to JPG/PNG Online</title>
        <meta
          name="description"
          content="Convert PDF pages to high-quality images. Export each page as JPG or PNG format. Free online PDF to image converter."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-purple/10 mb-4">
                <FileImage className="w-8 h-8 text-brand-purple" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                PDF to Image
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert PDF pages to high-quality PNG images. Each page becomes a separate image.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {images.length === 0 ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? "border-brand-purple bg-brand-purple/5"
                        : "border-border hover:border-brand-purple/50 hover:bg-muted/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      {isDragActive ? "Drop PDF here" : "Drag & drop a PDF file"}
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>

                  {pdfFile && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <p className="font-medium text-foreground mb-4">{pdfFile.name}</p>
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={reset}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                        <Button onClick={convertToImages} disabled={isProcessing}>
                          {isProcessing ? "Converting..." : "Convert to Images"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-foreground">
                      {images.length} Pages Converted
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={reset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Start Over
                      </Button>
                      <Button onClick={downloadAll}>
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Page ${index + 1}`}
                          className="w-full rounded-lg border border-border"
                        />
                        <button
                          onClick={() => downloadImage(img, index)}
                          className="absolute inset-0 flex items-center justify-center bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <Download className="w-8 h-8 text-background" />
                        </button>
                        <span className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                          Page {index + 1}
                        </span>
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

export default PDFToImage;
