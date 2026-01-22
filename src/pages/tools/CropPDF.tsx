import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crop, Upload, Download, RotateCcw, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const CropPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleCrop = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      setProgress(60);

      // Apply crop to all pages
      for (const page of pages) {
        const { width, height } = page.getSize();
        page.setCropBox(
          margins.left,
          margins.bottom,
          width - margins.left - margins.right,
          height - margins.top - margins.bottom
        );
      }
      setProgress(80);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "PDF Cropped!",
        description: `Cropped ${pages.length} pages successfully.`,
      });
    } catch (error) {
      console.error("Error cropping PDF:", error);
      toast({
        title: "Error",
        description: "Failed to crop PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setMargins({ top: 0, right: 0, bottom: 0, left: 0 });
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
        <title>Crop PDF - Trim PDF Pages Online Free</title>
        <meta name="description" content="Crop and trim PDF pages online. Remove margins and adjust page size. Free PDF cropping tool." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green/10 mb-4">
                <Crop className="w-8 h-8 text-brand-green" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Crop PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trim margins from your PDF pages with precision cropping.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-green/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="space-y-2">
                        <Crop className="w-12 h-12 mx-auto text-brand-green" />
                        <p className="font-medium text-foreground">{file.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">
                          Drop a PDF here or click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  {file && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">Crop Margins (points)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Top</label>
                          <Input
                            type="number"
                            value={margins.top}
                            onChange={(e) => setMargins(m => ({ ...m, top: Number(e.target.value) }))}
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Right</label>
                          <Input
                            type="number"
                            value={margins.right}
                            onChange={(e) => setMargins(m => ({ ...m, right: Number(e.target.value) }))}
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Bottom</label>
                          <Input
                            type="number"
                            value={margins.bottom}
                            onChange={(e) => setMargins(m => ({ ...m, bottom: Number(e.target.value) }))}
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Left</label>
                          <Input
                            type="number"
                            value={margins.left}
                            onChange={(e) => setMargins(m => ({ ...m, left: Number(e.target.value) }))}
                            min={0}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleCrop}
                        disabled={isProcessing}
                        className="bg-brand-green text-white hover:bg-brand-green/90"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Cropping..." : "Crop PDF"}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Processing... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Crop className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">PDF Cropped!</h2>
                    <p className="text-muted-foreground">Your PDF has been cropped successfully.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`cropped_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Cropped PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Crop Another PDF
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

export default CropPDF;