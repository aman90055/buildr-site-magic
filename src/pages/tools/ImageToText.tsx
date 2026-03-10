import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScanText, Upload, Loader2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AIBadge from "@/components/AIBadge";

const ImageToText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setText("");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleExtract = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-ocr", {
        body: { image: preview, fileName: file.name },
      });
      if (error) throw error;
      setText(data?.text || "No text found in image.");
      toast({ title: "Text extracted!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to extract text.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(text); toast({ title: "Copied!" }); };
  const handleReset = () => { setFile(null); setPreview(null); setText(""); };

  return (
    <>
      <Helmet><title>Image to Text (OCR) | PDF Tools</title><meta name="description" content="Extract text from images with AI OCR." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <AIBadge variant="default" glow />
              <div className="w-16 h-16 mx-auto my-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><ScanText className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Image to Text (OCR)</h1>
              <p className="text-muted-foreground">Extract text from images with AI-powered OCR.</p>
            </div>
            <div className="space-y-6">
              <label className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50">
                {preview ? <img src={preview} alt="Preview" className="max-h-48 rounded-lg" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                <span className="text-muted-foreground">{file ? file.name : "Select an image"}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <div className="flex gap-3">
                <Button onClick={handleExtract} disabled={!file || isProcessing} className="flex-1">
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</> : "Extract Text"}
                </Button>
                <Button variant="outline" onClick={handleReset}>Clear</Button>
              </div>
              {text && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><span className="font-medium text-foreground">Extracted Text</span><Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="w-4 h-4 mr-1" /> Copy</Button></div>
                  <div className="p-4 bg-muted/50 rounded-xl whitespace-pre-wrap text-sm text-foreground">{text}</div>
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
