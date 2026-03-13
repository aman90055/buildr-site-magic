import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { ArrowDownUp, Download, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

const ReversePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isPremium } = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      if (!checkFileSizeLimit(f, isPremium)) return;
      setFile(f);
    }
  };

  const handleReverse = async () => {
    if (!file) return;
    setIsProcessing(true); setProgress(10);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      setProgress(30);
      const dst = await PDFDocument.create();
      const count = src.getPageCount();
      const indices = Array.from({ length: count }, (_, i) => count - 1 - i);
      const pages = await dst.copyPages(src, indices);
      pages.forEach((p) => dst.addPage(p));
      setProgress(80);
      const out = await dst.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "Success!", description: `Reversed ${count} pages.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to reverse PDF.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setProgress(0); };

  return (
    <>
      <Helmet><title>Reverse PDF Page Order | PDF Tools</title><meta name="description" content="Reverse the page order of your PDF document." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><ArrowDownUp className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Reverse PDF</h1>
              <p className="text-muted-foreground">Reverse the page order of your PDF document.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50"><Upload className="w-10 h-10 text-muted-foreground" /><span className="text-muted-foreground">{file ? file.name : "Select a PDF"}</span><input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" /></label>
                {isProcessing && <Progress value={progress} />}
                <div className="flex gap-3"><Button onClick={handleReverse} disabled={!file || isProcessing} className="flex-1">{isProcessing ? "Reversing..." : "Reverse Pages"}</Button><Button variant="outline" onClick={handleReset}>Clear</Button></div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Pages Reversed!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="reversed.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Reverse Another</Button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ReversePDF;
