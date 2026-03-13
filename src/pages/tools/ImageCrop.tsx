import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Crop, Download, Upload } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

const ImageCrop = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [cropW, setCropW] = useState(400);
  const [cropH, setCropH] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isPremium } = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!checkFileSizeLimit(f, isPremium)) return;
    setFile(f); setDownloadUrl(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      const img = new Image();
      img.onload = () => { setOrigW(img.naturalWidth); setOrigH(img.naturalHeight); setCropW(img.naturalWidth); setCropH(img.naturalHeight); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleCrop = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;
      canvas.getContext("2d")!.drawImage(img, x, y, cropW, cropH, 0, 0, cropW, cropH);

      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => b ? res(b) : rej(new Error("Failed")), file.type || "image/png", 0.95);
      });

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Cropped!", description: `Image cropped to ${cropW}×${cropH}.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to crop.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setPreview(null); };

  return (
    <>
      <Helmet><title>Crop Image Online | PDF Tools</title><meta name="description" content="Crop images to exact dimensions." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center"><Crop className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Crop Image</h1>
              <p className="text-muted-foreground">Crop images by specifying coordinates and dimensions.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50">
                  {preview ? <img src={preview} alt="Preview" className="max-h-48 rounded-lg" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                  <span className="text-muted-foreground">{file ? `${file.name} (${origW}×${origH})` : "Select an image"}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {file && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>X Offset</Label><Input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} min={0} max={origW} /></div>
                    <div className="space-y-2"><Label>Y Offset</Label><Input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} min={0} max={origH} /></div>
                    <div className="space-y-2"><Label>Width</Label><Input type="number" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} min={1} max={origW} /></div>
                    <div className="space-y-2"><Label>Height</Label><Input type="number" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} min={1} max={origH} /></div>
                  </div>
                )}
                <Button onClick={handleCrop} disabled={!file || isProcessing} className="w-full" size="lg">{isProcessing ? "Cropping..." : "Crop Image"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Image Cropped!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="cropped.png" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Crop Another</Button>
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

export default ImageCrop;
