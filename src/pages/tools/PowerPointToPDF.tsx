import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Presentation, Upload, Download, RotateCcw, Plus, Trash2 } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
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
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pageWidth = 842;
      const pageHeight = 595;

      slides.forEach((slide, si) => {
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        // Background gradient effect
        page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: pageHeight, color: rgb(0.95, 0.95, 1) });
        page.drawRectangle({ x: 0, y: pageHeight - 80, width: pageWidth, height: 80, color: rgb(0.2, 0.3, 0.7) });

        // Title
        const title = slide.title.substring(0, 60);
        page.drawText(title, { x: 40, y: pageHeight - 55, size: 28, font: boldFont, color: rgb(1, 1, 1) });

        // Slide number
        page.drawText(`${si + 1} / ${slides.length}`, { x: pageWidth - 80, y: 20, size: 10, font, color: rgb(0.5, 0.5, 0.5) });

        // Content with word wrap
        const lines = slide.content.split("\n");
        let y = pageHeight - 130;
        for (const line of lines) {
          if (y < 40) break;
          const trimmed = line.substring(0, 100);
          const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("• ");
          page.drawText(isBullet ? `  ${trimmed}` : trimmed, { x: 50, y, size: 16, font, color: rgb(0.15, 0.15, 0.15) });
          y -= 28;
        }
        setProgress(20 + ((si + 1) / slides.length) * 60);
      });

      setProgress(90);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
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
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Create slides and export as a professional PDF presentation.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-4 animate-fade-in-up">
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
