import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileSignature, Upload, Download, RotateCcw, Plus, Trash2, Info } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "@/hooks/use-toast";
import { usePremium } from "@/hooks/usePremium";
import { checkFileSizeLimit } from "@/lib/fileSizeLimit";

type FieldKind = "text" | "checkbox" | "dropdown" | "radio";

interface FormFieldInfo {
  name: string;
  kind: FieldKind;
  options?: string[];
}

interface FreeTextBox {
  id: string;
  page: number;
  x: number;
  y: number;
  size: number;
  text: string;
}

const TITLE = "PDF Filler — Fill Out PDF Forms Online Free | Docunova";
const DESCRIPTION =
  "Free online PDF filler. Fill out any PDF form in your browser — interactive fields or flat scans — then download. No signup, no watermark, no file-size limit.";

const PDFFiller = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<FormFieldInfo[]>([]);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [boxes, setBoxes] = useState<FreeTextBox[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPremium } = usePremium();

  const loadPdf = useCallback(async (selected: File) => {
    setIsProcessing(true);
    setProgress(30);
    try {
      const bytes = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());

      const detected: FormFieldInfo[] = [];
      try {
        const form = pdfDoc.getForm();
        for (const field of form.getFields()) {
          const name = field.getName();
          const ctor = field.constructor.name;
          if (ctor.includes("CheckBox")) {
            detected.push({ name, kind: "checkbox" });
          } else if (ctor.includes("Dropdown")) {
            detected.push({ name, kind: "dropdown", options: (field as any).getOptions?.() ?? [] });
          } else if (ctor.includes("OptionList")) {
            detected.push({ name, kind: "dropdown", options: (field as any).getOptions?.() ?? [] });
          } else if (ctor.includes("RadioGroup")) {
            detected.push({ name, kind: "radio", options: (field as any).getOptions?.() ?? [] });
          } else {
            detected.push({ name, kind: "text" });
          }
        }
      } catch {
        // No AcroForm in this PDF — fall back to free text placement.
      }

      setFields(detected);
      setValues({});
      setBoxes(
        detected.length === 0
          ? [{ id: crypto.randomUUID(), page: 1, x: 60, y: 700, size: 12, text: "" }]
          : [],
      );
      setProgress(100);

      toast({
        title: detected.length ? `${detected.length} form fields found` : "No interactive fields",
        description: detected.length
          ? "Fill in the fields below and download your completed PDF."
          : "This looks like a flat or scanned form. Place text boxes anywhere on the page instead.",
      });
    } catch (error) {
      console.error("PDF Filler load error:", error);
      toast({
        title: "Could not read this PDF",
        description: "The file may be corrupted or password-protected. Try Repair PDF or Unlock PDF first.",
        variant: "destructive",
      });
      setFile(null);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      toast({ title: "PDF required", description: "Please choose a .pdf file.", variant: "destructive" });
      return;
    }
    if (!checkFileSizeLimit(selected, isPremium)) return;
    setFile(selected);
    void loadPdf(selected);
  };

  const updateBox = (id: string, patch: Partial<FreeTextBox>) =>
    setBoxes(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));

  const handleFill = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(25);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setProgress(50);

      if (fields.length > 0) {
        const form = pdfDoc.getForm();
        for (const field of fields) {
          const value = values[field.name];
          if (value === undefined || value === "") continue;
          try {
            if (field.kind === "checkbox") {
              const cb = form.getCheckBox(field.name);
              value ? cb.check() : cb.uncheck();
            } else if (field.kind === "dropdown") {
              form.getDropdown(field.name).select(String(value));
            } else if (field.kind === "radio") {
              form.getRadioGroup(field.name).select(String(value));
            } else {
              form.getTextField(field.name).setText(String(value));
            }
          } catch (err) {
            console.warn(`Could not set field "${field.name}":`, err);
          }
        }
        try {
          form.updateFieldAppearances();
        } catch {
          /* appearance streams are optional */
        }
      }

      const filled = boxes.filter(b => b.text.trim().length > 0);
      if (filled.length > 0) {
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        for (const box of filled) {
          const page = pages[Math.min(Math.max(box.page, 1), pages.length) - 1];
          page.drawText(box.text, {
            x: box.x,
            y: box.y,
            size: box.size,
            font,
            color: rgb(0, 0, 0),
          });
        }
      }

      setProgress(85);
      const out = await pdfDoc.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast({ title: "PDF filled!", description: "Your completed form is ready to download." });
    } catch (error) {
      console.error("PDF Filler error:", error);
      toast({
        title: "Error filling PDF",
        description: "Something went wrong while writing the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setFile(null);
    setFields([]);
    setValues({});
    setBoxes([]);
    setPageCount(0);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canonical = `https://docunova.online${typeof window !== "undefined" ? window.location.pathname : "/pdf-filler"}`;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to fill out a PDF form online free",
    description: DESCRIPTION,
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Upload your PDF form", text: "Select or drop the PDF form you need to complete. It stays in your browser." },
      { "@type": "HowToStep", name: "Fill the fields", text: "Type into the detected form fields, or place text boxes anywhere for flat and scanned forms." },
      { "@type": "HowToStep", name: "Download the filled PDF", text: "Click Fill PDF and download the completed document — no watermark, no signup." },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <FileSignature className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">PDF Filler</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out any PDF form online — free, unlimited and completely private. Interactive
                fields are detected automatically; flat or scanned forms can be filled with
                placeable text boxes.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="Upload a PDF form to fill"
                    />
                    {file ? (
                      <div className="space-y-2">
                        <FileSignature className="w-12 h-12 mx-auto text-primary" />
                        <p className="font-medium text-foreground">{file.name}</p>
                        {pageCount > 0 && (
                          <p className="text-sm text-muted-foreground">{pageCount} page(s)</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">
                          Drop a PDF form here or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Works with W-9, I-9, tax, insurance, rental and application forms
                        </p>
                      </div>
                    )}
                  </div>

                  {file && fields.length > 0 && (
                    <Card>
                      <CardContent className="p-6 space-y-5">
                        <h2 className="font-semibold text-foreground">
                          Form fields ({fields.length})
                        </h2>
                        {fields.map(field => (
                          <div key={field.name} className="space-y-2">
                            {field.kind === "checkbox" ? (
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`f-${field.name}`}
                                  checked={Boolean(values[field.name])}
                                  onCheckedChange={checked =>
                                    setValues(prev => ({ ...prev, [field.name]: Boolean(checked) }))
                                  }
                                />
                                <Label htmlFor={`f-${field.name}`}>{field.name}</Label>
                              </div>
                            ) : field.kind === "dropdown" || field.kind === "radio" ? (
                              <>
                                <Label htmlFor={`f-${field.name}`}>{field.name}</Label>
                                <Select
                                  value={String(values[field.name] ?? "")}
                                  onValueChange={v => setValues(prev => ({ ...prev, [field.name]: v }))}
                                >
                                  <SelectTrigger id={`f-${field.name}`}>
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(field.options ?? []).map(opt => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </>
                            ) : (
                              <>
                                <Label htmlFor={`f-${field.name}`}>{field.name}</Label>
                                <Input
                                  id={`f-${field.name}`}
                                  value={String(values[field.name] ?? "")}
                                  onChange={e =>
                                    setValues(prev => ({ ...prev, [field.name]: e.target.value }))
                                  }
                                  placeholder="Type your answer..."
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {file && (
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          <h2 className="font-semibold text-foreground">
                            {fields.length ? "Extra text (optional)" : "Place text on the page"}
                          </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Coordinates start at the bottom-left corner of the page, in points (72 pt = 1 inch).
                        </p>
                        {boxes.map(box => (
                          <div key={box.id} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                            <div className="col-span-2">
                              <Label htmlFor={`t-${box.id}`}>Text</Label>
                              <Input
                                id={`t-${box.id}`}
                                value={box.text}
                                onChange={e => updateBox(box.id, { text: e.target.value })}
                                placeholder="e.g. John Doe"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`p-${box.id}`}>Page</Label>
                              <Input
                                id={`p-${box.id}`}
                                type="number"
                                min={1}
                                max={pageCount || 1}
                                value={box.page}
                                onChange={e => updateBox(box.id, { page: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`x-${box.id}`}>X</Label>
                              <Input
                                id={`x-${box.id}`}
                                type="number"
                                value={box.x}
                                onChange={e => updateBox(box.id, { x: Number(e.target.value) })}
                              />
                            </div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <Label htmlFor={`y-${box.id}`}>Y</Label>
                                <Input
                                  id={`y-${box.id}`}
                                  type="number"
                                  value={box.y}
                                  onChange={e => updateBox(box.id, { y: Number(e.target.value) })}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Remove text box"
                                onClick={() => setBoxes(prev => prev.filter(b => b.id !== box.id))}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setBoxes(prev => [
                              ...prev,
                              { id: crypto.randomUUID(), page: 1, x: 60, y: 700, size: 12, text: "" },
                            ])
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add text box
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleFill} disabled={isProcessing} size="lg">
                        <FileSignature className="w-4 h-4 mr-2" />
                        {isProcessing ? "Filling..." : "Fill PDF"}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Clear
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Working... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <FileSignature className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Form filled!</h2>
                    <p className="text-muted-foreground">
                      Your completed PDF is ready — no watermark, no signup.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`filled_${file?.name ?? "form.pdf"}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" /> Download filled PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Fill another form
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Need a signature too? Use the{" "}
                    <Link to="/sign-pdf" className="underline underline-offset-2 hover:text-primary">
                      Sign PDF
                    </Link>{" "}
                    tool, or make the result read-only with{" "}
                    <Link to="/flatten-pdf" className="underline underline-offset-2 hover:text-primary">
                      Flatten PDF
                    </Link>
                    .
                  </p>
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

export default PDFFiller;
