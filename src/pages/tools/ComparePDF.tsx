import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GitCompare, Upload, RotateCcw, FileText, Sparkles, ArrowLeftRight } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";
import AIBadge from "@/components/AIBadge";

const ComparePDF = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [comparisonResult, setComparisonResult] = useState<{
    pdf1Pages: number;
    pdf2Pages: number;
    pdf1Size: number;
    pdf2Size: number;
    differences: string[];
  } | null>(null);
  const file1InputRef = useRef<HTMLInputElement>(null);
  const file2InputRef = useRef<HTMLInputElement>(null);

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile1(selectedFile);
    }
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile2(selectedFile);
    }
  };

  const handleCompare = async () => {
    if (!file1 || !file2) return;

    setIsProcessing(true);
    setProgress(20);

    try {
      const [arrayBuffer1, arrayBuffer2] = await Promise.all([
        file1.arrayBuffer(),
        file2.arrayBuffer()
      ]);
      setProgress(40);

      const [pdf1, pdf2] = await Promise.all([
        PDFDocument.load(arrayBuffer1),
        PDFDocument.load(arrayBuffer2)
      ]);
      setProgress(60);

      const pdf1Pages = pdf1.getPageCount();
      const pdf2Pages = pdf2.getPageCount();
      const differences: string[] = [];

      if (pdf1Pages !== pdf2Pages) {
        differences.push(`Page count differs: ${pdf1Pages} vs ${pdf2Pages} pages`);
      }

      if (file1.size !== file2.size) {
        differences.push(`File size differs: ${(file1.size / 1024).toFixed(1)}KB vs ${(file2.size / 1024).toFixed(1)}KB`);
      }

      // Compare page dimensions
      for (let i = 0; i < Math.min(pdf1Pages, pdf2Pages); i++) {
        const page1 = pdf1.getPage(i);
        const page2 = pdf2.getPage(i);
        const size1 = page1.getSize();
        const size2 = page2.getSize();

        if (size1.width !== size2.width || size1.height !== size2.height) {
          differences.push(`Page ${i + 1} dimensions differ: ${size1.width}x${size1.height} vs ${size2.width}x${size2.height}`);
        }
      }

      setProgress(80);

      if (differences.length === 0) {
        differences.push("No structural differences found between the PDFs");
      }

      setComparisonResult({
        pdf1Pages,
        pdf2Pages,
        pdf1Size: file1.size,
        pdf2Size: file2.size,
        differences
      });
      setProgress(100);

      toast({
        title: "Comparison Complete!",
        description: `Found ${differences.length} difference(s)`,
      });
    } catch (error) {
      console.error("Error comparing PDFs:", error);
      toast({
        title: "Error",
        description: "Failed to compare PDFs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setComparisonResult(null);
    setProgress(0);
    if (file1InputRef.current) file1InputRef.current.value = "";
    if (file2InputRef.current) file2InputRef.current.value = "";
  };

  return (
    <>
      <Helmet>
        <title>Compare PDF - Find Differences Between PDFs | AI-Powered</title>
        <meta name="description" content="Compare two PDF documents side by side. AI-powered difference detection. Free PDF comparison tool." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <AIBadge variant="inline" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-ai/10 mb-4">
                <GitCompare className="w-8 h-8 text-brand-ai" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Compare PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find differences between two PDF documents with AI.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {!comparisonResult ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* File Upload Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-brand-ai/50 transition-colors cursor-pointer"
                      onClick={() => file1InputRef.current?.click()}
                    >
                      <input
                        ref={file1InputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFile1Change}
                        className="hidden"
                      />
                      
                      {file1 ? (
                        <div className="space-y-2">
                          <FileText className="w-10 h-10 mx-auto text-brand-ai" />
                          <p className="font-medium text-foreground text-sm">{file1.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file1.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                          <p className="font-medium text-foreground">First PDF</p>
                        </div>
                      )}
                    </div>

                    <div
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-brand-ai/50 transition-colors cursor-pointer"
                      onClick={() => file2InputRef.current?.click()}
                    >
                      <input
                        ref={file2InputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFile2Change}
                        className="hidden"
                      />
                      
                      {file2 ? (
                        <div className="space-y-2">
                          <FileText className="w-10 h-10 mx-auto text-brand-ai" />
                          <p className="font-medium text-foreground text-sm">{file2.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file2.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                          <p className="font-medium text-foreground">Second PDF</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {file1 && file2 && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleCompare}
                        disabled={isProcessing}
                        className="bg-gradient-ai text-white"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isProcessing ? "Comparing..." : "Compare PDFs"}
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
                        Analyzing differences... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <ArrowLeftRight className="w-5 h-5 text-brand-ai" />
                      Comparison Results
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">First PDF</p>
                        <p className="font-medium">{file1?.name}</p>
                        <p className="text-sm">{comparisonResult.pdf1Pages} pages</p>
                        <p className="text-sm">{(comparisonResult.pdf1Size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Second PDF</p>
                        <p className="font-medium">{file2?.name}</p>
                        <p className="text-sm">{comparisonResult.pdf2Pages} pages</p>
                        <p className="text-sm">{(comparisonResult.pdf2Size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Differences Found:</h4>
                      <ul className="space-y-1">
                        {comparisonResult.differences.map((diff, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-brand-ai">•</span>
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Compare Other PDFs
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

export default ComparePDF;