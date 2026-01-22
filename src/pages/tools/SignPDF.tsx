import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PenTool, Upload, Download, RotateCcw, Pen, Type } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

const SignPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureText, setSignatureText] = useState("");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleSignatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSignatureImage(ev.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureImage(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureImage(null);
  };

  const handleSign = async () => {
    if (!file || (!signatureText && !signatureImage)) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();
      setProgress(60);

      if (signatureText) {
        const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
        firstPage.drawText(signatureText, {
          x: xPos,
          y: height - yPos,
          size: 24,
          font,
          color: rgb(0, 0, 0.5),
        });
      }

      if (signatureImage) {
        try {
          const imageBytes = await fetch(signatureImage).then(res => res.arrayBuffer());
          let image;
          if (signatureImage.includes("png")) {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }
          const dims = image.scale(0.3);
          firstPage.drawImage(image, {
            x: xPos,
            y: height - yPos - dims.height,
            width: dims.width,
            height: dims.height,
          });
        } catch {
          // If image embedding fails, use text fallback
          const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
          firstPage.drawText("Signed", {
            x: xPos,
            y: height - yPos,
            size: 24,
            font,
            color: rgb(0, 0, 0.5),
          });
        }
      }

      setProgress(80);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "PDF Signed!",
        description: "Your signature has been added to the document.",
      });
    } catch (error) {
      console.error("Error signing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to sign PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setSignatureText("");
    setSignatureImage(null);
    clearCanvas();
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
        <title>Sign PDF - Add Digital Signature | Free Online Tool</title>
        <meta name="description" content="Add your signature to PDF documents. Draw or type your signature. Free PDF signing tool." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-purple/10 mb-4">
                <PenTool className="w-8 h-8 text-brand-purple" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sign PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Add your digital signature to PDF documents.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-purple/50 transition-colors cursor-pointer"
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
                        <PenTool className="w-12 h-12 mx-auto text-brand-purple" />
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
                      <h3 className="font-semibold text-foreground">Create Your Signature</h3>
                      
                      {/* Type Signature */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <Type className="w-4 h-4" /> Type your signature
                        </label>
                        <Input
                          placeholder="Your name..."
                          value={signatureText}
                          onChange={(e) => setSignatureText(e.target.value)}
                          className="font-serif italic"
                        />
                      </div>

                      {/* Draw Signature */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <Pen className="w-4 h-4" /> Draw your signature
                        </label>
                        <canvas
                          ref={canvasRef}
                          width={300}
                          height={100}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="w-full border border-border rounded-lg bg-white cursor-crosshair"
                        />
                        <Button variant="ghost" size="sm" onClick={clearCanvas}>
                          Clear drawing
                        </Button>
                      </div>

                      {/* Position */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">X Position</label>
                          <Input
                            type="number"
                            value={xPos}
                            onChange={(e) => setXPos(Number(e.target.value))}
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Y Position</label>
                          <Input
                            type="number"
                            value={yPos}
                            onChange={(e) => setYPos(Number(e.target.value))}
                            min={0}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleSign}
                        disabled={isProcessing || (!signatureText && !signatureImage)}
                        className="bg-brand-purple text-white hover:bg-brand-purple/90"
                        size="lg"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        {isProcessing ? "Signing..." : "Sign PDF"}
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
                        Adding signature... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <PenTool className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">PDF Signed!</h2>
                    <p className="text-muted-foreground">Your signature has been added successfully.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`signed_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Signed PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Sign Another PDF
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

export default SignPDF;