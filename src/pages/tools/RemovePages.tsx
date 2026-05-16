import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, RotateCcw, Trash2 } from "lucide-react";
import { usePDFRemovePages } from "@/hooks/usePDFRemovePages";
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

const RemovePages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesInput, setPagesInput] = useState("1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { removePages, isProcessing, progress, downloadUrl, reset } = usePDFRemovePages();
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

  const handleRemove = async () => {
    if (!file) return;
    const pages = parsePages(pagesInput, pageCount);
    if (!pages.length || pages.length >= pageCount) {
      toast({ title: "Choose valid pages", description: "Enter pages like 2,4-6 and keep at least one page.", variant: "destructive" });
      return;
    }
    await removePages(file, pages);
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
        <title>Remove PDF Pages - Delete Pages from PDF Online</title>
        <meta name="description" content="Remove unwanted pages from your PDF documents. Free online PDF page remover tool." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"><Trash2 className="w-8 h-8 text-primary" /></div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Remove Pages</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Delete unwanted pages from your PDF documents.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {!downloadUrl ? (
                <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in-up space-y-6">
                  <div>
                    <Label htmlFor="remove-file">Select PDF File</Label>
                    <Input id="remove-file" ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} disabled={isProcessing} className="mt-2" />
                    {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name} • {pageCount} pages</p>}
                  </div>
                  <div>
                    <Label>Pages to remove</Label>
                    <Input value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} placeholder="e.g. 2,4-6" disabled={!file || isProcessing} className="mt-2" />
                  </div>
                  {isProcessing && <Progress value={progress} />}
                  <div className="flex gap-3">
                    <Button onClick={handleRemove} disabled={!file || isProcessing} className="flex-1"><Trash2 className="w-4 h-4 mr-2" />{isProcessing ? "Removing..." : "Remove Pages"}</Button>
                    <Button variant="outline" onClick={handleReset} disabled={isProcessing}><RotateCcw className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center"><Trash2 className="w-10 h-10 text-accent" /></div>
                  <h2 className="text-2xl font-semibold text-foreground">Pages Removed!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="pages_removed.pdf"><Button><Download className="w-4 h-4 mr-2" />Download PDF</Button></a>
                    <Button variant="outline" onClick={handleReset}>Remove More</Button>
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

export default RemovePages;