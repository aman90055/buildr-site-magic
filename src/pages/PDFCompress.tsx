import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PDFCompressDropzone from "@/components/pdf/PDFCompressDropzone";
import CompressionOptions from "@/components/pdf/CompressionOptions";
import CompressActions from "@/components/pdf/CompressActions";
import AICompressionAnalysis from "@/components/pdf/AICompressionAnalysis";
import AIBadge from "@/components/AIBadge";
import { usePDFCompress } from "@/hooks/usePDFCompress";
import { useAICompressionAnalysis } from "@/hooks/useAICompressionAnalysis";
import { Brain, Sparkles } from "lucide-react";

export type CompressionLevel = number; // 1-100

const PDFCompress = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>(50);
  
  const { compressFile, isProcessing, progress, downloadUrl, originalSize, compressedSize, reset } = usePDFCompress();
  const { analyzeFile, isAnalyzing, analysis, reset: resetAnalysis } = useAICompressionAnalysis();

  const handleFileAdded = async (newFile: File) => {
    setFile(newFile);
    // Automatically trigger AI analysis when file is added
    await analyzeFile(newFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    reset();
    resetAnalysis();
  };

  const handleCompress = async () => {
    if (!file) return;
    await compressFile(file, compressionLevel);
  };

  const handleReset = () => {
    setFile(null);
    reset();
    resetAnalysis();
  };

  const handleApplyRecommendation = (level: number) => {
    setCompressionLevel(level);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressionPercentage = originalSize && compressedSize 
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>AI-Powered PDF Compression - Smart Size Reduction</title>
        <meta
          name="description"
          content="Compress PDFs with AI that automatically detects optimal settings. Reduce file size while maintaining quality. Fast, smart, and secure."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <AIBadge variant="default" glow />
                <span className="text-sm text-muted-foreground">Smart Compression</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                <span className="text-gradient-ai">AI-Powered</span> PDF Compression
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes your PDF content and automatically recommends the optimal compression settings for the best balance of quality and file size.
              </p>
            </div>

            {/* Main Tool Area */}
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  {!file ? (
                    <PDFCompressDropzone onFileAdded={handleFileAdded} disabled={isProcessing} />
                  ) : (
                    <>
                      <div className="glass-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveFile}
                            disabled={isProcessing || isAnalyzing}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* AI Analysis Section */}
                      <AICompressionAnalysis
                        analysis={analysis}
                        isAnalyzing={isAnalyzing}
                        onApplyRecommendation={handleApplyRecommendation}
                        disabled={isProcessing}
                      />

                      <CompressionOptions
                        compressionLevel={compressionLevel}
                        onLevelChange={setCompressionLevel}
                        disabled={isProcessing || isAnalyzing}
                      />

                      <CompressActions
                        isProcessing={isProcessing}
                        progress={progress}
                        onCompress={handleCompress}
                        onReset={handleReset}
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-gradient-ai rounded-full flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Compressed Successfully!
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Reduced file size by <span className="text-accent font-semibold">{compressionPercentage}%</span>
                    </p>
                    
                    <div className="flex items-center justify-center gap-8 text-sm">
                      <div>
                        <p className="text-muted-foreground">Original</p>
                        <p className="font-semibold text-foreground">{formatFileSize(originalSize || 0)}</p>
                      </div>
                      <div className="text-gradient-ai text-xl">→</div>
                      <div>
                        <p className="text-muted-foreground">Compressed</p>
                        <p className="font-semibold text-accent">{formatFileSize(compressedSize || 0)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download="compressed.pdf"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-ai text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Compressed PDF
                    </a>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Compress Another PDF
                    </button>
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

export default PDFCompress;
