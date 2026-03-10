import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Minimize2, Download, Upload } from "lucide-react";

const ImageCompress = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setDownloadUrl(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => b ? res(b) : rej(new Error("Failed")), "image/jpeg", quality / 100);
      });

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      const saved = Math.round((1 - blob.size / file.size) * 100);
      toast({ title: "Compressed!", description: `Reduced by ${saved}%.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to compress.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setPreview(null); };
  const fmt = (b: number) => b < 1024 ? b + " B" : b < 1048576 ? (b/1024).toFixed(1) + " KB" : (b/1048576).toFixed(1) + " MB";

  return (
    <>
      <Helmet><title>Compress Image Online | PDF Tools</title><meta name="description" content="Reduce image file size while maintaining quality." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Minimize2 className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Compress Image</h1>
              <p className="text-muted-foreground">Reduce image file size while maintaining visual quality.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50">
                  {preview ? <img src={preview} alt="Preview" className="max-h-48 rounded-lg" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                  <span className="text-muted-foreground">{file ? `${file.name} (${fmt(file.size)})` : "Select an image"}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {file && <div className="space-y-2"><Label>Quality: {quality}%</Label><Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={5} /></div>}
                <Button onClick={handleCompress} disabled={!file || isProcessing} className="w-full" size="lg">{isProcessing ? "Compressing..." : "Compress Image"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Compressed!</h2>
                <p className="text-muted-foreground">Original: {fmt(file?.size || 0)} → Compressed: {fmt(outputSize)} ({Math.round((1 - outputSize / (file?.size || 1)) * 100)}% smaller)</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="compressed.jpg" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Compress Another</Button>
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

export default ImageCompress;
