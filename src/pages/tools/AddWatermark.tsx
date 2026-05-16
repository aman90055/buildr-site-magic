import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Droplets, RotateCcw } from "lucide-react";
import { usePDFWatermark, WatermarkPosition } from "@/hooks/usePDFWatermark";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

const AddWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState<WatermarkPosition>("diagonal");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addWatermark, isProcessing, progress, downloadUrl, reset } = usePDFWatermark();
  const { isPremium } = usePremium();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.toLowerCase().endsWith(".pdf") && checkFileSizeLimit(selectedFile, isPremium)) {
      setFile(selectedFile);
    }
  };

  const handleReset = () => {
    setFile(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Helmet>
        <title>Add Watermark to PDF - Watermark PDF Online Free</title>
        <meta name="description" content="Add text watermarks to your PDF documents online. Free PDF watermarking tool." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-cyan/10 mb-4">
                <Droplets className="w-8 h-8 text-brand-cyan" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Add Watermark</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Add a text watermark to every page of your PDF.</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {!downloadUrl ? (
                <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in-up space-y-6">
                  <div>
                    <Label htmlFor="watermark-file">Select PDF File</Label>
                    <Input id="watermark-file" ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} disabled={isProcessing} className="mt-2" />
                    {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
                  </div>

                  <div>
                    <Label>Watermark Text</Label>
                    <Input value={text} onChange={(e) => setText(e.target.value)} disabled={isProcessing} className="mt-2" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Position</Label>
                      <Select value={position} onValueChange={(v) => setPosition(v as WatermarkPosition)} disabled={isProcessing}>
                        <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diagonal">Diagonal</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Font Size: {fontSize}pt</Label>
                      <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={16} max={96} step={1} disabled={isProcessing} className="mt-4" />
                    </div>
                  </div>

                  <div>
                    <Label>Opacity: {Math.round(opacity * 100)}%</Label>
                    <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0.1} max={0.8} step={0.05} disabled={isProcessing} className="mt-4" />
                  </div>

                  {isProcessing && <Progress value={progress} />}

                  <div className="flex gap-3">
                    <Button onClick={() => file && addWatermark(file, text, position, opacity, fontSize)} disabled={!file || !text.trim() || isProcessing} className="flex-1">
                      <Droplets className="w-4 h-4 mr-2" /> {isProcessing ? "Adding..." : "Add Watermark"}
                    </Button>
                    <Button variant="outline" onClick={handleReset} disabled={isProcessing}><RotateCcw className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center"><Droplets className="w-10 h-10 text-accent" /></div>
                  <h2 className="text-2xl font-semibold text-foreground">Watermark Added!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="watermarked.pdf"><Button><Download className="w-4 h-4 mr-2" />Download PDF</Button></a>
                    <Button variant="outline" onClick={handleReset}>Add Another</Button>
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

export default AddWatermark;