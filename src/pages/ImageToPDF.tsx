import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Upload, Download, Trash2, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const ImageToPDF = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages: ImageFile[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
  });

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const arrayBuffer = await img.file.arrayBuffer();
        let image;

        if (img.file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success("PDF created successfully!");
    } catch (error) {
      toast.error("Failed to create PDF");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <>
      <Helmet>
        <title>Image to PDF - Convert Images to PDF Online Free</title>
        <meta
          name="description"
          content="Convert JPG, PNG images to PDF online. Combine multiple images into a single PDF document. Free, fast, and secure."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 mb-4">
                <ImageIcon className="w-8 h-8 text-brand-blue" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Image to PDF
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert your images to PDF format. Combine multiple JPG, PNG files into a single document.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-border hover:border-brand-blue/50 hover:bg-muted/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      {isDragActive ? "Drop images here" : "Drag & drop images here"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (JPG, PNG, GIF, WebP)
                    </p>
                  </div>

                  {images.length > 0 && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={img.preview}
                              alt="Preview"
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(img.id)}
                              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={reset}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                        <Button onClick={convertToPDF} disabled={isProcessing}>
                          {isProcessing ? "Converting..." : "Convert to PDF"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-brand-green/10 rounded-full flex items-center justify-center">
                    <Download className="w-10 h-10 text-brand-green" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Created Successfully!
                    </h2>
                    <p className="text-muted-foreground">
                      Your {images.length} images have been converted to PDF.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download="images.pdf"
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                    <Button variant="secondary" onClick={reset}>
                      Convert More Images
                    </Button>
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

export default ImageToPDF;
