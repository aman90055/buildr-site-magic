import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Hash, Download, RotateCcw } from "lucide-react";
import { usePDFPageNumbers, PageNumberPosition } from "@/hooks/usePDFPageNumbers";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const AddPageNumbers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPageNumbers, isProcessing, progress, downloadUrl, reset } = usePDFPageNumbers();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({ title: "Error", description: "File exceeds 50MB limit.", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleAddNumbers = async () => {
    if (!file) return;
    await addPageNumbers(file, position, startNumber, fontSize);
  };

  const handleReset = () => {
    setFile(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Helmet>
        <title>Add Page Numbers to PDF - Number PDF Pages Online</title>
        <meta name="description" content="Add page numbers to your PDF documents online. Free PDF page numbering tool." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 mb-4">
                <Hash className="w-8 h-8 text-brand-blue" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Add Page Numbers</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Add page numbers to your PDF documents.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {!downloadUrl ? (
                <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in-up">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="file">Select PDF File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isProcessing}
                        className="mt-2"
                      />
                      {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
                    </div>

                    <div>
                      <Label>Position</Label>
                      <Select value={position} onValueChange={(v) => setPosition(v as PageNumberPosition)} disabled={isProcessing}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-center">Bottom Center</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="top-center">Top Center</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Number</Label>
                        <Input
                          type="number"
                          min={1}
                          value={startNumber}
                          onChange={(e) => setStartNumber(Number(e.target.value))}
                          disabled={isProcessing}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Font Size: {fontSize}pt</Label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={([v]) => setFontSize(v)}
                          min={8}
                          max={24}
                          step={1}
                          disabled={isProcessing}
                          className="mt-4"
                        />
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Adding numbers...</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button onClick={handleAddNumbers} disabled={!file || isProcessing} className="flex-1">
                        <Hash className="w-4 h-4 mr-2" />
                        {isProcessing ? "Adding..." : "Add Page Numbers"}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Hash className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Page Numbers Added!</h2>
                    <p className="text-muted-foreground">Your PDF now has page numbers.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="numbered.pdf">
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </a>
                    <Button variant="outline" onClick={handleReset}>
                      Add More
                    </Button>
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

export default AddPageNumbers;
