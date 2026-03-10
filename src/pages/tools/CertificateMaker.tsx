import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Award, Download, Plus, Trash2, FileText } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type CertificateTemplate = "achievement" | "completion" | "appreciation" | "participation";

const TEMPLATES: Record<CertificateTemplate, { title: string; subtitle: string; borderColor: [number, number, number] }> = {
  achievement: { title: "Certificate of Achievement", subtitle: "This certificate is proudly presented to", borderColor: [0.85, 0.65, 0.13] },
  completion: { title: "Certificate of Completion", subtitle: "This is to certify that", borderColor: [0.18, 0.55, 0.34] },
  appreciation: { title: "Certificate of Appreciation", subtitle: "In recognition and appreciation of", borderColor: [0.2, 0.4, 0.8] },
  participation: { title: "Certificate of Participation", subtitle: "This certificate is awarded to", borderColor: [0.6, 0.2, 0.6] },
};

const CertificateMaker = () => {
  const [template, setTemplate] = useState<CertificateTemplate>("achievement");
  const [recipientNames, setRecipientNames] = useState<string[]>([""]);
  const [organization, setOrganization] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [signatory, setSignatory] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const addRecipient = () => setRecipientNames([...recipientNames, ""]);
  const removeRecipient = (i: number) => setRecipientNames(recipientNames.filter((_, idx) => idx !== i));
  const updateRecipient = (i: number, val: string) => {
    const updated = [...recipientNames];
    updated[i] = val;
    setRecipientNames(updated);
  };

  const generateCertificate = async () => {
    const names = recipientNames.filter((n) => n.trim());
    if (names.length === 0) {
      toast({ title: "Error", description: "Please enter at least one recipient name.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const tpl = TEMPLATES[template];
      const pdfDoc = await PDFDocument.create();
      const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

      for (const name of names) {
        const page = pdfDoc.addPage([842, 595]); // A4 landscape
        const { width, height } = page.getSize();
        const [br, bg, bb] = tpl.borderColor;

        // Background
        page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 0.98, 0.95) });

        // Outer border
        const borderWidth = 4;
        page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: rgb(br, bg, bb), borderWidth, color: rgb(1, 1, 1, 0) });
        // Inner border
        page.drawRectangle({ x: 35, y: 35, width: width - 70, height: height - 70, borderColor: rgb(br, bg, bb), borderWidth: 1.5, color: rgb(1, 1, 1, 0) });

        // Corner decorations
        const cornerSize = 30;
        [[45, height - 55], [width - 45 - cornerSize, height - 55], [45, 45], [width - 45 - cornerSize, 45]].forEach(([x, y]) => {
          page.drawRectangle({ x, y, width: cornerSize, height: cornerSize / 3, color: rgb(br, bg, bb) });
          page.drawRectangle({ x, y, width: cornerSize / 3, height: cornerSize, color: rgb(br, bg, bb) });
        });

        // Star/award icon (simple diamond)
        const cx = width / 2, cy = height - 100;
        page.drawCircle({ x: cx, y: cy, size: 20, color: rgb(br, bg, bb) });

        // Title
        const titleWidth = fontBold.widthOfTextAtSize(tpl.title, 32);
        page.drawText(tpl.title, { x: (width - titleWidth) / 2, y: height - 160, size: 32, font: fontBold, color: rgb(br, bg, bb) });

        // Decorative line
        page.drawLine({ start: { x: width / 2 - 120, y: height - 175 }, end: { x: width / 2 + 120, y: height - 175 }, thickness: 1.5, color: rgb(br, bg, bb) });

        // Subtitle
        const subWidth = fontItalic.widthOfTextAtSize(tpl.subtitle, 14);
        page.drawText(tpl.subtitle, { x: (width - subWidth) / 2, y: height - 210, size: 14, font: fontItalic, color: rgb(0.4, 0.4, 0.4) });

        // Recipient name
        const nameSize = Math.min(40, 600 / Math.max(name.length, 1) * 2);
        const nameWidth = fontBold.widthOfTextAtSize(name, nameSize);
        page.drawText(name, { x: (width - nameWidth) / 2, y: height - 270, size: nameSize, font: fontBold, color: rgb(0.15, 0.15, 0.15) });

        // Underline under name
        page.drawLine({ start: { x: width / 2 - 150, y: height - 280 }, end: { x: width / 2 + 150, y: height - 280 }, thickness: 1, color: rgb(br, bg, bb) });

        // Reason
        if (reason.trim()) {
          const reasonText = `For: ${reason}`;
          const reasonWidth = fontRegular.widthOfTextAtSize(reasonText, 14);
          page.drawText(reasonText, { x: (width - reasonWidth) / 2, y: height - 320, size: 14, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        }

        // Date
        const dateText = `Date: ${new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`;
        const dateWidth = fontRegular.widthOfTextAtSize(dateText, 12);
        page.drawText(dateText, { x: (width - dateWidth) / 2, y: 120, size: 12, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

        // Signatory
        if (signatory.trim()) {
          const sigWidth = fontBold.widthOfTextAtSize(signatory, 14);
          page.drawLine({ start: { x: width / 2 - 80, y: 85 }, end: { x: width / 2 + 80, y: 85 }, thickness: 1, color: rgb(0.3, 0.3, 0.3) });
          page.drawText(signatory, { x: (width - sigWidth) / 2, y: 68, size: 14, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
          const authLabel = "Authorized Signatory";
          const authWidth = fontItalic.widthOfTextAtSize(authLabel, 10);
          page.drawText(authLabel, { x: (width - authWidth) / 2, y: 54, size: 10, font: fontItalic, color: rgb(0.5, 0.5, 0.5) });
        }

        // Organization
        if (organization.trim()) {
          const orgWidth = fontRegular.widthOfTextAtSize(organization, 12);
          page.drawText(organization, { x: (width - orgWidth) / 2, y: height - 350, size: 12, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));

      toast({ title: "Success!", description: `${names.length} certificate(s) generated successfully.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate certificates.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setRecipientNames([""]);
    setOrganization("");
    setReason("");
    setSignatory("");
  };

  return (
    <>
      <Helmet>
        <title>Certificate Maker - Create PDF Certificates | PDF Tools</title>
        <meta name="description" content="Create professional certificates with customizable templates. Generate beautiful achievement, completion, appreciation, and participation certificates in PDF format." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Certificate Maker</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Design and generate beautiful certificates for any occasion. Supports batch generation with multiple names.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {!downloadUrl ? (
                <>
                  {/* Template */}
                  <div className="space-y-2">
                    <Label>Certificate Template</Label>
                    <Select value={template} onValueChange={(v) => setTemplate(v as CertificateTemplate)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="achievement">🏆 Certificate of Achievement</SelectItem>
                        <SelectItem value="completion">✅ Certificate of Completion</SelectItem>
                        <SelectItem value="appreciation">🙏 Certificate of Appreciation</SelectItem>
                        <SelectItem value="participation">🎯 Certificate of Participation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipients */}
                  <div className="space-y-2">
                    <Label>Recipient Name(s)</Label>
                    {recipientNames.map((name, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={name}
                          onChange={(e) => updateRecipient(i, e.target.value)}
                          placeholder={`Recipient ${i + 1}`}
                        />
                        {recipientNames.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeRecipient(i)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addRecipient} className="mt-1">
                      <Plus className="w-4 h-4 mr-1" /> Add Recipient
                    </Button>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label>Reason / Achievement</Label>
                    <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Outstanding performance in web development" />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. PDF Tools Academy" />
                  </div>

                  {/* Signatory */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Signatory Name</Label>
                      <Input value={signatory} onChange={(e) => setSignatory(e.target.value)} placeholder="e.g. Aman Vishwakarma" />
                    </div>
                  </div>

                  <Button onClick={generateCertificate} disabled={isProcessing} className="w-full" size="lg">
                    {isProcessing ? "Generating..." : "Generate Certificate(s)"}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Certificates Generated!</h2>
                  <p className="text-muted-foreground">{recipientNames.filter(n => n.trim()).length} certificate(s) ready to download.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={downloadUrl} download="certificates.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                      <Download className="w-5 h-5" /> Download PDF
                    </a>
                    <Button variant="secondary" onClick={handleReset}>Create More Certificates</Button>
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

export default CertificateMaker;
