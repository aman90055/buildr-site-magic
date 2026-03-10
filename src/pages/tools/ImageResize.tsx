import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Maximize, Download, Upload } from "lucide-react";

const ImageResize = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setDownloadUrl(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      const img = new Image();
      img.onload = () => { setOrigW(img.naturalWidth); setOrigH(img.naturalHeight); setWidth(img.naturalWidth); setHeight(img.naturalHeight); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (keepRatio && origW) setHeight(Math.round((w / origW) * origH));
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (keepRatio && origH) setWidth(Math.round((h / origH) * origW));
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => b ? res(b) : rej(new Error("Failed")), file.type || "image/png", 0.92);
      });

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Resized!", description: `Image resized to ${width}×${height}.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to resize.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setPreview(null); };

  return (
    <>
      <Helmet><title>Resize Image Online | PDF Tools</title><meta name="description" content="Resize images to exact dimensions." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><Maximize className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Resize Image</h1>
              <p className="text-muted-foreground">Resize images to exact pixel dimensions.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50">
                  {preview ? <img src={preview} alt="Preview" className="max-h-48 rounded-lg" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                  <span className="text-muted-foreground">{file ? file.name : "Select an image"}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {file && (
                  <>
                    <p className="text-sm text-muted-foreground">Original: {origW} × {origH}px</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Width (px)</Label><Input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} /></div>
                      <div className="space-y-2"><Label>Height (px)</Label><Input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} /></div>
                    </div>
                    <div className="flex items-center gap-2"><Checkbox checked={keepRatio} onCheckedChange={(v) => setKeepRatio(!!v)} /><Label>Keep aspect ratio</Label></div>
                  </>
                )}
                <Button onClick={handleResize} disabled={!file || isProcessing} className="w-full" size="lg">{isProcessing ? "Resizing..." : "Resize Image"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Image Resized!</h2>
                <p className="text-muted-foreground">{width} × {height}px</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="resized.png" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Resize Another</Button>
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

export default ImageResize;
