import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, FileOutput, RotateCcw } from "lucide-react";
import { usePDFExtractPages } from "@/hooks/usePDFExtractPages";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";
import { toast } from "@/hooks/use-toast";

const parsePages = (value: string, totalPages: number) => {
  const pages = new Set<number>();
  value.split(",").map((part) => part.trim()).filter(Boolean).forEach((part) => {
    const [startRaw, endRaw] = part.split("-").map((n) => Number(n.trim()));
    const start = Math.max(1, startRaw || 0);
    const end = Math.min(totalPages, endRaw || start);
    for (let i = start; i <= end; i += 1) pages.add(i);
  });
  return [...pages].sort((a, b) => a - b);
};

const ExtractPages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesInput, setPagesInput] = useState("1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { extractPages, isProcessing, progress, downloadUrl, reset } = usePDFExtractPages();
  const { isPremium } = usePremium();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !selectedFile.name.toLowerCase().endsWith(".pdf") || !checkFileSizeLimit(selectedFile, isPremium)) return;
    try {
      const pdf = await PDFDocument.load(await selectedFile.arrayBuffer(), { ignoreEncryption: true });
      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
    } catch {
      toast({ title: "Invalid PDF", description: "This PDF could not be loaded.", variant: "destructive" });
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    const pages = parsePages(pagesInput, pageCount);
    if (!pages.length) {
      toast({ title: "Choose valid pages", description: "Enter pages like 1,3-5.", variant: "destructive" });
      return;
    }
    await extractPages(file, pages);
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPagesInput("1");
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Helmet>
        <title>Extract PDF Pages - Extract Pages from PDF Online</title>
        <meta name="description" content="Extract specific pages from your PDF documents. Free online PDF page extractor." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green/10 mb-4"><FileOutput className="w-8 h-8 text-brand-green" /></div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Extract Pages</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Create a new PDF from selected pages.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {!downloadUrl ? (
                <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in-up space-y-6">
                  <div>
                    <Label htmlFor="extract-file">Select PDF File</Label>
                    <Input id="extract-file" ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} disabled={isProcessing} className="mt-2" />
                    {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name} • {pageCount} pages</p>}
                  </div>
                  <div>
                    <Label>Pages to extract</Label>
                    <Input value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} placeholder="e.g. 1,3-5" disabled={!file || isProcessing} className="mt-2" />
                  </div>
                  {isProcessing && <Progress value={progress} />}
                  <div className="flex gap-3">
                    <Button onClick={handleExtract} disabled={!file || isProcessing} className="flex-1"><FileOutput className="w-4 h-4 mr-2" />{isProcessing ? "Extracting..." : "Extract Pages"}</Button>
                    <Button variant="outline" onClick={handleReset} disabled={isProcessing}><RotateCcw className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center"><FileOutput className="w-10 h-10 text-accent" /></div>
                  <h2 className="text-2xl font-semibold text-foreground">Pages Extracted!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="extracted_pages.pdf"><Button><Download className="w-4 h-4 mr-2" />Download PDF</Button></a>
                    <Button variant="outline" onClick={handleReset}>Extract More</Button>
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

export default ExtractPages;