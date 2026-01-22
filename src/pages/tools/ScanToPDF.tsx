import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scan, Upload, Download, RotateCcw, ImageIcon } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const ScanToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(f => 
      f.type.startsWith("image/")
    );
    
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Generate previews
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreviews(prev => [...prev, ev.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const imageBytes = new Uint8Array(arrayBuffer);
        
        let image;
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === "image/png") {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          continue; // Skip unsupported formats
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
        
        setProgress(10 + ((i + 1) / files.length) * 80);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "PDF Created!",
        description: `${files.length} images converted to PDF.`,
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to create PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPreviews([]);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Scan to PDF - Convert Scanned Images to PDF | Free Tool</title>
        <meta name="description" content="Convert scanned documents and images to PDF. Free online scan to PDF converter." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-cyan/10 mb-4">
                <Scan className="w-8 h-8 text-brand-cyan" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Scan to PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert scanned documents and photos to PDF format.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-cyan/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground">
                      Drop scanned images here or click to upload
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG. You can add multiple images.
                    </p>
                  </div>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Scan ${index + 1}`}
                            className="w-full aspect-[3/4] object-cover rounded-lg border border-border"
                          />
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleConvert}
                        disabled={isProcessing}
                        className="bg-brand-cyan text-white hover:bg-brand-cyan/90"
                        size="lg"
                      >
                        <Scan className="w-4 h-4 mr-2" />
                        {isProcessing ? "Converting..." : `Convert ${files.length} Images to PDF`}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Creating PDF... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Scan className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">PDF Created!</h2>
                    <p className="text-muted-foreground">
                      {files.length} scanned images converted to PDF.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download="scanned_document.pdf"
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Scan More Documents
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

export default ScanToPDF;