import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RotateCw, Upload, Download, RotateCcw } from "lucide-react";
import { usePDFRotate, RotationDegrees } from "@/hooks/usePDFRotate";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const RotatePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<RotationDegrees>(90);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { rotateFile, isProcessing, progress, downloadUrl, reset } = usePDFRotate();

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

  const handleRotate = async () => {
    if (!file) return;
    await rotateFile(file, rotation);
  };

  const handleReset = () => {
    setFile(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Helmet>
        <title>Rotate PDF - Rotate PDF Pages Online Free</title>
        <meta name="description" content="Rotate PDF pages online. Turn pages 90, 180, or 270 degrees. Free PDF rotation tool." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-pink/10 mb-4">
                <RotateCw className="w-8 h-8 text-brand-pink" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Rotate PDF</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Rotate PDF pages to the correct orientation.
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
                      {file && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Rotation Angle</Label>
                      <Select
                        value={rotation.toString()}
                        onValueChange={(v) => setRotation(Number(v) as RotationDegrees)}
                        disabled={isProcessing}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90">90° Clockwise</SelectItem>
                          <SelectItem value="180">180°</SelectItem>
                          <SelectItem value="270">90° Counter-clockwise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rotating...</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={handleRotate}
                        disabled={!file || isProcessing}
                        className="flex-1"
                      >
                        <RotateCw className="w-4 h-4 mr-2" />
                        {isProcessing ? "Rotating..." : "Rotate PDF"}
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
                    <RotateCw className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">PDF Rotated!</h2>
                    <p className="text-muted-foreground">Your PDF has been rotated {rotation}°.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="rotated.pdf">
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </a>
                    <Button variant="outline" onClick={handleReset}>
                      Rotate Another
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

export default RotatePDF;
