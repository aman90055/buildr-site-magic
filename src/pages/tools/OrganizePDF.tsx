import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LayoutGrid, Upload, Download, RotateCcw, GripVertical, Sparkles } from "lucide-react";
import { usePDFOrganize } from "@/hooks/usePDFOrganize";
import AIBadge from "@/components/AIBadge";

const OrganizePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ index: number; id: string }[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadPDF, reorganizePages, isProcessing, progress, downloadUrl, pageCount, reset } = usePDFOrganize();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      const count = await loadPDF(selectedFile);
      setPages(Array.from({ length: count }, (_, i) => ({ index: i, id: `page-${i}` })));
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];
    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);
    setPages(newPages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleOrganize = async () => {
    if (!file) return;
    const newOrder = pages.map(p => p.index);
    await reorganizePages(file, newOrder);
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Organize PDF - Rearrange PDF Pages Online | Free Tool</title>
        <meta name="description" content="Drag and drop to reorder pages in your PDF. AI-powered page arrangement. Free online PDF organizer." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <AIBadge variant="inline" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-purple/10 mb-4">
                <LayoutGrid className="w-8 h-8 text-brand-purple" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Organize PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Drag and drop to rearrange pages in your PDF document.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* File Upload */}
                  {!file && (
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
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">
                        Drop a PDF here or click to upload
                      </p>
                    </div>
                  )}

                  {/* Page Grid */}
                  {file && pages.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">
                          {file.name} - {pageCount} pages
                        </h3>
                        <p className="text-sm text-muted-foreground">Drag to reorder</p>
                      </div>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {pages.map((page, index) => (
                          <div
                            key={page.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`aspect-[3/4] bg-muted rounded-lg flex flex-col items-center justify-center cursor-move border-2 transition-all ${
                              draggedIndex === index ? "border-brand-purple scale-105 shadow-lg" : "border-transparent hover:border-brand-purple/50"
                            }`}
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground mb-1" />
                            <span className="text-sm font-medium text-foreground">{page.index + 1}</span>
                            <span className="text-xs text-muted-foreground">→ {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleOrganize}
                        disabled={isProcessing}
                        className="bg-brand-purple text-white hover:bg-brand-purple/90"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Processing..." : "Apply New Order"}
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
                        Reorganizing pages... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <LayoutGrid className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Reorganized!
                    </h2>
                    <p className="text-muted-foreground">
                      Your pages have been reordered successfully.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`organized_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Organize Another PDF
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

export default OrganizePDF;