import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, Upload, Download, RotateCcw } from "lucide-react";
import { readSpreadsheet, parseDelimited, textPagesPdf } from "@/lib/officeImport";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

const ExcelToPDF = () => {
  const [csvText, setCsvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isPremium } = usePremium();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!checkFileSizeLimit(f, isPremium)) return;
    setFile(f);
    try {
      const rows = await readSpreadsheet(f);
      setCsvText(rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n"));
    } catch (error) { setCsvText(""); toast({ title: "Cannot read workbook", description: error instanceof Error ? error.message : "Invalid file", variant: "destructive" }); }
  };

  const handleConvert = async () => {
    if (!csvText.trim()) {
      toast({ title: "No data", description: "Please upload a CSV file or paste data.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setProgress(20);
    try {
      const rows = parseDelimited(csvText);
      const pdfBytes = await textPagesPdf([rows.map(row => row.join("    |    ")).join("\n")], setProgress);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "PDF Created!", description: `${rows.length} rows converted to PDF table.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCsvText("");
    setFile(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>Excel/CSV to PDF - Convert Spreadsheets to PDF Online</title>
        <meta name="description" content="Convert CSV and Excel data to formatted PDF tables. Free online converter." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content="Excel/CSV to PDF - Convert Spreadsheets to PDF Online" />
        <meta property="og:description" content="Convert CSV and Excel data to formatted PDF tables. Free online converter." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Excel/CSV to PDF - Convert Spreadsheets to PDF Online" />
        <meta name="twitter:description" content="Convert CSV and Excel data to formatted PDF tables. Free online converter." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "HowTo",
          name: "Excel/CSV to PDF - Convert Spreadsheets to PDF Online", description: "Convert CSV and Excel data to formatted PDF tables. Free online converter.",
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
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Excel / CSV to PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Convert worksheet values or CSV data to an image-based PDF. Charts, formulas and original formatting are not reproduced.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-accent/50 transition-colors">
                    <input type="file" accept=".xlsx,.csv,.tsv,.txt" onChange={handleFileChange} className="hidden" id="csv-upload" />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">Upload an XLSX/CSV/TSV file</p>
                      <p className="text-sm text-muted-foreground">or paste comma/tab-separated data below</p>
                    </label>
                  </div>
                  {file && <p className="text-sm text-muted-foreground text-center">File: {file.name}</p>}
                  <Textarea placeholder="Name, Age, City&#10;John, 28, Mumbai&#10;Priya, 24, Delhi" value={csvText} onChange={e => setCsvText(e.target.value)} className="min-h-[200px] font-mono text-sm" />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleConvert} disabled={isProcessing || !csvText.trim()} size="lg">
                      <Table className="w-4 h-4 mr-2" />
                      {isProcessing ? "Converting..." : "Convert to PDF"}
                    </Button>
                    <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Clear</Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Table className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">PDF Table Ready!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download={`${file?.name || "table"}.pdf`} className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                      <Download className="w-5 h-5" /> Download PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">Convert Another</Button>
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

export default ExcelToPDF;
