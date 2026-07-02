import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { ScanText, Loader2, Copy, Download, FileJson, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AIBadge from "@/components/AIBadge";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";
import SmartFileInput from "@/components/SmartFileInput";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ImageToText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = usePremium();

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("Unsupported file. Please upload a JPG, PNG or WEBP image.");
      toast({ title: "Invalid image", description: "Only JPG, PNG, WEBP are supported.", variant: "destructive" });
      return;
    }
    if (!checkFileSizeLimit(f, isPremium)) return;
    setError(null);
    setFile(f);
    setText("");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.onerror = () => setError("Could not read the image file. Try another one.");
    reader.readAsDataURL(f);
  };

  const handleExtract = async () => {
    if (!file || !preview || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    setText("");
    setProgress(15);

    // Simulated progress while awaiting the edge function
    const timer = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 5 : p));
    }, 400);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-ocr", {
        body: { imageData: preview },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const extracted = (data?.text || "").trim();
      setProgress(100);

      if (!extracted) {
        setError("No readable text found in this image. Try a clearer, higher-resolution image.");
        toast({ title: "No text detected", description: "Try a sharper image with visible text." });
        return;
      }

      setText(extracted);
      toast({ title: "Text extracted!", description: `${extracted.length} characters found.` });
    } catch (err: any) {
      console.error("OCR error:", err);
      const msg = err?.message || "";
      let friendly = "Failed to extract text. Please try again.";
      if (msg.includes("Rate limit") || msg.includes("429")) friendly = "Too many requests. Please wait a moment and try again.";
      else if (msg.includes("Usage limit") || msg.includes("402")) friendly = "AI usage limit reached. Please try again later.";
      else if (msg.includes("Validation")) friendly = "Invalid image data. Please upload a different image.";
      else if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("failed to fetch")) friendly = "Network error. Check your connection and retry.";
      setError(friendly);
      toast({ title: "Extraction failed", description: friendly, variant: "destructive" });
    } finally {
      clearInterval(timer);
      setTimeout(() => setProgress(0), 600);
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Text copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  };

  const download = (blob: Blob, ext: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(file?.name || "extracted").replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => download(new Blob([text], { type: "text/plain" }), "txt");
  const handleDownloadJson = () =>
    download(
      new Blob(
        [JSON.stringify({ fileName: file?.name, extractedAt: new Date().toISOString(), characters: text.length, text }, null, 2)],
        { type: "application/json" }
      ),
      "json"
    );

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setText("");
    setError(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>Image to Text (OCR) | PDF Tools</title>
        <meta name="description" content="Extract text from images with AI OCR. Copy or download as TXT/JSON." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <AIBadge variant="default" glow />
              <div className="w-16 h-16 mx-auto my-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ScanText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Image to Text (OCR)</h1>
              <p className="text-muted-foreground">Extract text from images with AI-powered OCR.</p>
            </div>
            <div className="space-y-6">
              {preview && (
                <div className="flex justify-center">
                  <img src={preview} alt="Preview" className="max-h-48 rounded-xl border border-border" />
                </div>
              )}
              <SmartFileInput
                onFilesAdded={handleFiles}
                accept="image/*"
                title={file ? file.name : "Drop image or use camera"}
                subtitle="Click to browse, drop here, or capture live"
                formats={["JPG", "PNG", "WEBP"]}
              />

              {isProcessing && (
                <div className="space-y-2 rounded-xl border border-border/50 bg-card/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Reading text with AI OCR…</span>
                    <span className="ml-auto text-primary tabular-nums">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {error && !isProcessing && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={handleExtract} disabled={!file || isProcessing} className="flex-1">
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</>
                  ) : (
                    "Extract Text"
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isProcessing}>Clear</Button>
              </div>

              {text && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-medium text-foreground">Extracted Text ({text.length} chars)</span>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-1" /> Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownloadTxt}>
                        <Download className="w-4 h-4 mr-1" /> .txt
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownloadJson}>
                        <FileJson className="w-4 h-4 mr-1" /> .json
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl whitespace-pre-wrap text-sm text-foreground max-h-96 overflow-y-auto">
                    {text}
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

export default ImageToText;
