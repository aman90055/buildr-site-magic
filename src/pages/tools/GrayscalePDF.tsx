import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Contrast, Download, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";

const GrayscalePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true); setProgress(20);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdfDoc = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
      setProgress(30);

      const newPdf = await PDFDocument.create();
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let j = 0; j < d.length; j += 4) {
          const gray = d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114;
          d[j] = d[j + 1] = d[j + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);

        const imgBytes = await new Promise<Uint8Array>((resolve) => {
          canvas.toBlob((b) => b!.arrayBuffer().then((ab) => resolve(new Uint8Array(ab))), "image/jpeg", 0.9);
        });
        const img = await newPdf.embedJpg(imgBytes);
        const w = viewport.width / 2, h = viewport.height / 2;
        const newPage = newPdf.addPage([w, h]);
        newPage.drawImage(img, { x: 0, y: 0, width: w, height: h });
        setProgress(30 + (i / pdfDoc.numPages) * 60);
      }

      const out = await newPdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "Success!", description: "Converted to grayscale." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to convert.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setProgress(0); };

  return (
    <>
      <Helmet><title>Convert PDF to Grayscale | PDF Tools</title><meta name="description" content="Convert color PDF to grayscale." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center"><Contrast className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Grayscale PDF</h1>
              <p className="text-muted-foreground">Convert your color PDF to grayscale.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50"><Upload className="w-10 h-10 text-muted-foreground" /><span className="text-muted-foreground">{file ? file.name : "Select a PDF"}</span><input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" /></label>
                {isProcessing && <Progress value={progress} />}
                <div className="flex gap-3"><Button onClick={handleConvert} disabled={!file || isProcessing} className="flex-1">{isProcessing ? "Converting..." : "Convert to Grayscale"}</Button><Button variant="outline" onClick={handleReset}>Clear</Button></div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Converted to Grayscale!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="grayscale.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Convert Another</Button>
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

export default GrayscalePDF;
