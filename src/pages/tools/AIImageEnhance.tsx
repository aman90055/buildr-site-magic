import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Download, Upload } from "lucide-react";

const AIImageEnhance = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setDownloadUrl(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleEnhance = async () => {
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
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);

      // Simple sharpening via unsharp mask
      if (sharpness > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        const factor = sharpness / 100;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = Math.min(255, Math.max(0, d[i] + (d[i] - 128) * factor));
          d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + (d[i + 1] - 128) * factor));
          d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + (d[i + 2] - 128) * factor));
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => b ? res(b) : rej(new Error("Failed")), "image/png", 0.95);
      });

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Enhanced!", description: "Image enhanced successfully." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to enhance image.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setPreview(null); setBrightness(100); setContrast(100); setSaturation(100); setSharpness(0); };

  return (
    <>
      <Helmet><title>AI Image Enhance | PDF Tools</title><meta name="description" content="Enhance image quality with AI-powered adjustments." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center"><Sparkles className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">AI Image Enhance</h1>
              <p className="text-muted-foreground">Enhance image quality with smart adjustments.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50">
                  {preview ? <img src={preview} alt="Preview" className="max-h-48 rounded-lg" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                  <span className="text-muted-foreground">{file ? file.name : "Select an image"}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {file && (
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Brightness: {brightness}%</Label><Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={50} max={200} /></div>
                    <div className="space-y-2"><Label>Contrast: {contrast}%</Label><Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={50} max={200} /></div>
                    <div className="space-y-2"><Label>Saturation: {saturation}%</Label><Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} /></div>
                    <div className="space-y-2"><Label>Sharpness: {sharpness}%</Label><Slider value={[sharpness]} onValueChange={(v) => setSharpness(v[0])} min={0} max={100} /></div>
                  </div>
                )}
                <Button onClick={handleEnhance} disabled={!file || isProcessing} className="w-full" size="lg">{isProcessing ? "Enhancing..." : "Enhance Image"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Image Enhanced!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="enhanced.png" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Enhance Another</Button>
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

export default AIImageEnhance;
