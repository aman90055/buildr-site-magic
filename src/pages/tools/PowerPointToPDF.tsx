import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Presentation, Upload, Download, RotateCcw, Plus, Trash2 } from "lucide-react";
import { readPresentation, textPagesPdf } from "@/lib/officeImport";
import { toast } from "@/hooks/use-toast";

interface Slide {
  title: string;
  content: string;
}

const PowerPointToPDF = () => {
  const [slides, setSlides] = useState<Slide[]>([{ title: "Slide 1", content: "" }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const addSlide = () => setSlides([...slides, { title: `Slide ${slides.length + 1}`, content: "" }]);
  const removeSlide = (i: number) => setSlides(slides.filter((_, idx) => idx !== i));
  const updateSlide = (i: number, field: keyof Slide, val: string) => {
    const updated = [...slides];
    updated[i] = { ...updated[i], [field]: val };
    setSlides(updated);
  };

  const handleConvert = async () => {
    if (slides.every(s => !s.title.trim() && !s.content.trim())) {
      toast({ title: "Empty slides", description: "Add content to at least one slide.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setProgress(20);
    try {
      const pdfBytes = await textPagesPdf(slides.map(slide => `${slide.title}\n\n${slide.content}`), setProgress);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "Presentation PDF Ready!", description: `${slides.length} slides converted.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to create presentation PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSlides([{ title: "Slide 1", content: "" }]);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>Presentation to PDF - Create Slide PDFs Online</title>
        <meta name="description" content="Create presentation slides and convert to PDF. Free slide to PDF tool." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content="Presentation to PDF - Create Slide PDFs Online" />
        <meta property="og:description" content="Create presentation slides and convert to PDF. Free slide to PDF tool." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Presentation to PDF - Create Slide PDFs Online" />
        <meta name="twitter:description" content="Create presentation slides and convert to PDF. Free slide to PDF tool." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "HowTo",
          name: "Presentation to PDF - Create Slide PDFs Online", description: "Create presentation slides and convert to PDF. Free slide to PDF tool.",
          totalTime: "PT1M",
          step: [
            { "@type": "HowToStep", position: 1, name: "Add your file", text: "Select or drag your file into the tool. Everything is processed in your browser, so nothing is uploaded." },
            { "@type": "HowToStep", position: 2, name: "Choose your options", text: "Adjust the available settings for your output, then start the conversion." },
            { "@type": "HowToStep", position: 3, name: "Download the result", text: "Save the finished file to your device. It is free with no file size limit." },
          ],
        })}</script>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Presentation className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Presentation to PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Import PPTX slide text or create slides. Output is text rendered on PDF pages; original design, images and animations are not retained.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-4 animate-fade-in-up">
                  <label className="block border border-border p-4 rounded-lg cursor-pointer">
                    <Upload className="inline w-4 h-4 mr-2" />Upload PPTX
                    <input type="file" accept=".pptx" className="block mt-3 text-sm max-w-full" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try { setSlides(await readPresentation(file)); }
                      catch (error) { toast({ title: "Import failed", description: error instanceof Error ? error.message : "Invalid presentation", variant: "destructive" }); }
                    }} />
                  </label>
                  {slides.map((slide, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <input value={slide.title} onChange={e => updateSlide(i, "title", e.target.value)} className="text-lg font-semibold bg-transparent border-none outline-none text-foreground flex-1" placeholder="Slide Title" />
                        {slides.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeSlide(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                      </div>
                      <Textarea placeholder="Slide content... Use - for bullet points" value={slide.content} onChange={e => updateSlide(i, "content", e.target.value)} className="min-h-[100px]" />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addSlide} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Slide</Button>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button onClick={handleConvert} disabled={isProcessing} size="lg">
                      <Presentation className="w-4 h-4 mr-2" />
                      {isProcessing ? "Creating..." : "Create PDF Presentation"}
                    </Button>
                    <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                  </div>
                  {isProcessing && <Progress value={progress} className="h-2" />}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Presentation className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Presentation PDF Ready!</h2>
                  <p className="text-muted-foreground">{slides.length} slides created</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="presentation.pdf" className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                      <Download className="w-5 h-5" /> Download PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">Create Another</Button>
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

export default PowerPointToPDF;
