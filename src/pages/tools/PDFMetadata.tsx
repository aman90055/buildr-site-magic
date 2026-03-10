import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Info, Download, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";

const PDFMetadata = () => {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState({ title: "", author: "", subject: "", keywords: "", creator: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setMeta({ title: pdf.getTitle() || "", author: pdf.getAuthor() || "", subject: pdf.getSubject() || "", keywords: pdf.getKeywords() || "", creator: pdf.getCreator() || "" });
    } catch { /* ignore */ }
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      if (meta.title) pdf.setTitle(meta.title);
      if (meta.author) pdf.setAuthor(meta.author);
      if (meta.subject) pdf.setSubject(meta.subject);
      if (meta.keywords) pdf.setKeywords([meta.keywords]);
      if (meta.creator) pdf.setCreator(meta.creator);
      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "Metadata updated." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update metadata.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); setFile(null); setMeta({ title: "", author: "", subject: "", keywords: "", creator: "" }); };

  return (
    <>
      <Helmet><title>Edit PDF Metadata | PDF Tools</title><meta name="description" content="View and edit PDF metadata." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center"><Info className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Edit PDF Metadata</h1>
              <p className="text-muted-foreground">View and edit PDF title, author, subject, and keywords.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-4">
                <label className="flex flex-col items-center gap-4 p-10 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50"><Upload className="w-10 h-10 text-muted-foreground" /><span className="text-muted-foreground">{file ? file.name : "Select a PDF"}</span><input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" /></label>
                {file && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Title</Label><Input value={meta.title} onChange={(e) => setMeta({...meta, title: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Author</Label><Input value={meta.author} onChange={(e) => setMeta({...meta, author: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Subject</Label><Input value={meta.subject} onChange={(e) => setMeta({...meta, subject: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Keywords</Label><Input value={meta.keywords} onChange={(e) => setMeta({...meta, keywords: e.target.value})} /></div>
                    </div>
                    <div className="space-y-2"><Label>Creator</Label><Input value={meta.creator} onChange={(e) => setMeta({...meta, creator: e.target.value})} /></div>
                    <Button onClick={handleSave} disabled={isProcessing} className="w-full" size="lg">{isProcessing ? "Saving..." : "Save Metadata"}</Button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Metadata Updated!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="metadata-updated.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download</a>
                  <Button variant="secondary" onClick={handleReset}>Edit Another</Button>
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

export default PDFMetadata;
