import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Pencil, Upload, Download, RotateCcw, Type, Sparkles } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { toast } from "@/hooks/use-toast";
import AIBadge from "@/components/AIBadge";

const EditPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);
  const [fontSize, setFontSize] = useState(16);
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

  const handleAddText = async () => {
    if (!file || !text.trim()) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      setProgress(60);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();

      firstPage.drawText(text, {
        x: xPos,
        y: height - yPos,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      setProgress(80);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "Text Added!",
        description: "Your text has been added to the PDF.",
      });
    } catch (error) {
      console.error("Error editing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to edit PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setText("");
    setXPos(50);
    setYPos(50);
    setFontSize(16);
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
        <title>Edit PDF - Add Text to PDF Online | Free PDF Editor</title>
        <meta
          name="description"
          content="Add text to your PDF files online. Free PDF editor with AI-assisted features."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <AIBadge variant="inline" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-cyan/10 mb-4">
                <Pencil className="w-8 h-8 text-brand-cyan" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Edit PDF
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Add text and annotations to your PDF documents.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* File Upload */}
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-cyan/50 transition-colors cursor-pointer"
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
                        <Pencil className="w-12 h-12 mx-auto text-brand-cyan" />
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
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

                  {/* Text Options */}
                  {file && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Add Text to First Page
                      </h3>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter text to add..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground">X Position</label>
                            <Input
                              type="number"
                              value={xPos}
                              onChange={(e) => setXPos(Number(e.target.value))}
                              min={0}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Y Position</label>
                            <Input
                              type="number"
                              value={yPos}
                              onChange={(e) => setYPos(Number(e.target.value))}
                              min={0}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Font Size</label>
                            <Input
                              type="number"
                              value={fontSize}
                              onChange={(e) => setFontSize(Number(e.target.value))}
                              min={8}
                              max={72}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleAddText}
                        disabled={isProcessing || !text.trim()}
                        className="bg-brand-cyan text-white hover:bg-brand-cyan/90"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Adding Text..." : "Add Text to PDF"}
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
                    <Pencil className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Edited!
                    </h2>
                    <p className="text-muted-foreground">
                      Your text has been added to the document.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`edited_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Edited PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Edit Another PDF
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

export default EditPDF;