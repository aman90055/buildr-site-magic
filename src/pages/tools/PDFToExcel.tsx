import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, Upload, Download, RotateCcw, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";
import { extractPdfRows } from "@/lib/pdfToolOperations";
import { excelBlob, downloadBlob } from "@/lib/officeExport";

const PDFToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState("");
  const [rows, setRows] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isPremium } = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      if (!checkFileSizeLimit(f, isPremium)) return;
      setFile(f);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      if (!checkFileSizeLimit(f, isPremium)) return;
      setFile(f);
    }
  }, [isPremium]);

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const extracted = await extractPdfRows(file, setProgress);
      setRows(extracted);
      setCsvData(extracted.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n"));
      setProgress(100);
      toast({ title: "Data Extracted!", description: "Spreadsheet data is ready." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to extract data.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try { downloadBlob(await excelBlob(rows), `${file?.name.replace(/\.pdf$/i, "") || "data"}.xlsx`); }
    catch { toast({ title: "Export failed", variant: "destructive" }); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvData);
    toast({ title: "Copied!", description: "CSV data copied to clipboard." });
  };

  const handleReset = () => {
    setFile(null);
    setCsvData("");
    setRows([]);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to Excel/CSV - Extract Tables from PDF</title>
        <meta name="description" content="Extract tables and data from PDF to CSV/Excel format. Free online tool." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content="PDF to Excel/CSV - Extract Tables from PDF" />
        <meta property="og:description" content="Extract tables and data from PDF to CSV/Excel format. Free online tool." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF to Excel/CSV - Extract Tables from PDF" />
        <meta name="twitter:description" content="Extract tables and data from PDF to CSV/Excel format. Free online tool." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "HowTo",
          name: "PDF to Excel/CSV - Extract Tables from PDF", description: "Extract tables and data from PDF to CSV/Excel format. Free online tool.",
          totalTime: "PT1M",
          step: [
            { "@type": "HowToStep", position: 1, name: "Add your file", text: "Select or drag your file into the tool. Everything is processed in your browser, so nothing is uploaded." },
            { "@type": "HowToStep", position: 2, name: "Choose your options", text: "Adjust the available settings for your output, then start the conversion." },
            { "@type": "HowToStep", position: 3, name: "Download the result", text: "Save the finished file to your device. It is free with no file size limit." },
          ],
        })}</script>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
                <Table className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">PDF to Excel</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Extract tabular data from PDF and download as an Excel workbook.</p>
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
                    <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download Excel (.xlsx)</Button>
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
