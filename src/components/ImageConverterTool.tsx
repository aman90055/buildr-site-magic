import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LucideIcon, Download, Upload } from "lucide-react";

interface ImageConverterProps {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  gradient: string;
  acceptTypes: string;
  outputFormat: string;
  outputMime: string;
  outputExt: string;
  showQuality?: boolean;
}

const ImageConverterTool = ({
  title, description, metaTitle, metaDescription, icon: Icon, gradient,
  acceptTypes, outputFormat, outputMime, outputExt, showQuality = false,
}: ImageConverterProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Conversion failed")), outputMime, quality / 100);
      });

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      toast({ title: "Success!", description: `Converted to ${outputFormat}.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to convert image.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setDownloadUrl(null);
  };

  const fmt = (b: number) => b < 1024 ? b + " B" : b < 1048576 ? (b/1024).toFixed(1) + " KB" : (b/1048576).toFixed(1) + " MB";

  return (
    <>
      <Helmet><title>{metaTitle}</title><meta name="description" content={metaDescription} /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}><Icon className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50">
                  {preview ? <img src={preview} alt="Preview" className="max-h-48 rounded-lg" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                  <span className="text-muted-foreground">{file ? `${file.name} (${fmt(file.size)})` : "Select an image"}</span>
                  <input type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" />
                </label>
                {showQuality && file && (
                  <div className="space-y-2"><Label>Quality: {quality}%</Label><Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={5} /></div>
                )}
                <Button onClick={handleConvert} disabled={!file || isProcessing} className="w-full" size="lg">{isProcessing ? "Converting..." : `Convert to ${outputFormat}`}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Converted!</h2>
                <p className="text-muted-foreground">Original: {fmt(file?.size || 0)} → Output: {fmt(outputSize)}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download={`converted.${outputExt}`} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download {outputFormat}</a>
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

export default ImageConverterTool;
