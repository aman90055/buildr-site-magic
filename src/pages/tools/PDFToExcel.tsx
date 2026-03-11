import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, Upload, Download, RotateCcw, Copy } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "@/hooks/use-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") setFile(f);
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let allCsv = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Group items by Y position to detect rows
        const rows: Map<number, { x: number; text: string }[]> = new Map();
        content.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          if (!rows.has(y)) rows.set(y, []);
          rows.get(y)!.push({ x: item.transform[4], text: item.str });
        });

        // Sort rows by Y (top to bottom) and columns by X
        const sortedRows = Array.from(rows.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([_, items]) => items.sort((a, b) => a.x - b.x).map(i => `"${i.text.replace(/"/g, '""')}"`).join(","));

        allCsv += sortedRows.join("\n") + "\n\n";
        setProgress(10 + (i / pdf.numPages) * 80);
      }

      setCsvData(allCsv.trim());
      setProgress(100);
      toast({ title: "Data Extracted!", description: `${pdf.numPages} pages converted to CSV.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to extract data.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name?.replace(".pdf", "") || "data"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvData);
    toast({ title: "Copied!", description: "CSV data copied to clipboard." });
  };

  const handleReset = () => {
    setFile(null);
    setCsvData("");
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to Excel/CSV - Extract Tables from PDF</title>
        <meta name="description" content="Extract tables and data from PDF to CSV/Excel format. Free online tool." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
                <Table className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to Excel / CSV</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Extract tabular data from PDF and download as CSV for Excel.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!csvData ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-accent/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-excel" />
                    <label htmlFor="pdf-excel" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop PDF here or click to upload</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name}</p>}
                  <div className="flex justify-center">
                    <Button onClick={handleExtract} disabled={!file || isProcessing} size="lg">
                      <Table className="w-4 h-4 mr-2" />
                      {isProcessing ? "Extracting..." : "Extract Data"}
                    </Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <Textarea value={csvData} readOnly className="min-h-[300px] font-mono text-sm" />
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download CSV</Button>
                    <Button variant="outline" onClick={handleCopy}><Copy className="w-4 h-4 mr-2" />Copy</Button>
                    <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Convert Another</Button>
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

export default PDFToExcel;
