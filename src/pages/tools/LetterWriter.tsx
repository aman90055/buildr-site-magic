import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Mail, Download } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const LetterWriter = () => {
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [letterType, setLetterType] = useState("formal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!senderName || !recipientName || !body) {
      toast({ title: "Error", description: "Please fill required fields.", variant: "destructive" }); return;
    }
    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.TimesRoman);
      const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
      const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
      const page = pdf.addPage([595, 842]);
      const m = 60;
      let y = 780;

      // Date
      const dateStr = new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
      page.drawText(dateStr, { x: m, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) });
      y -= 30;

      // Sender
      page.drawText(senderName, { x: m, y, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
      y -= 14;
      if (senderAddress) { for (const line of senderAddress.split("\n")) { page.drawText(line, { x: m, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) }); y -= 14; } }
      y -= 20;

      // Recipient
      page.drawText("To,", { x: m, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) });
      y -= 14;
      page.drawText(recipientName, { x: m, y, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
      y -= 14;
      if (recipientAddress) { for (const line of recipientAddress.split("\n")) { page.drawText(line, { x: m, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) }); y -= 14; } }
      y -= 20;

      // Subject
      if (subject) { page.drawText(`Subject: ${subject}`, { x: m, y, size: 11, font: bold, color: rgb(0.1, 0.1, 0.1) }); y -= 25; }

      // Salutation
      const salutation = letterType === "formal" ? `Dear ${recipientName},` : `Hi ${recipientName},`;
      page.drawText(salutation, { x: m, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
      y -= 25;

      // Body - word wrap
      const maxW = 595 - m * 2;
      for (const para of body.split("\n")) {
        const words = para.split(" ");
        let cur = "";
        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w;
          if (font.widthOfTextAtSize(test, 11) > maxW && cur) {
            page.drawText(cur, { x: m, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) });
            y -= 16;
            if (y < 80) { const np = pdf.addPage([595, 842]); y = 780; }
            cur = w;
          } else cur = test;
        }
        if (cur) { page.drawText(cur, { x: m, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) }); y -= 16; }
        y -= 8;
      }
      y -= 15;

      // Closing
      const closing = letterType === "formal" ? "Yours sincerely," : "Best regards,";
      page.drawText(closing, { x: m, y, size: 11, font: italic, color: rgb(0.2, 0.2, 0.2) });
      y -= 30;
      page.drawText(senderName, { x: m, y, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Letter Generated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate letter.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); };

  return (
    <>
      <Helmet><title>Letter Writer - Create PDF Letters | PDF Tools</title><meta name="description" content="Write and generate professional letters in PDF." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"><Mail className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Letter Writer</h1>
              <p className="text-muted-foreground">Write and generate professional letters in PDF format.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Letter Type</Label>
                  <Select value={letterType} onValueChange={setLetterType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="formal">Formal</SelectItem><SelectItem value="informal">Informal</SelectItem></SelectContent></Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3"><h3 className="font-semibold text-foreground">From</h3><Input placeholder="Your Name" value={senderName} onChange={(e) => setSenderName(e.target.value)} /><Textarea placeholder="Your Address" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} rows={2} /></div>
                  <div className="space-y-3"><h3 className="font-semibold text-foreground">To</h3><Input placeholder="Recipient Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} /><Textarea placeholder="Recipient Address" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} rows={2} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Letter subject" /></div>
                </div>
                <div className="space-y-2"><Label>Letter Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your letter content here..." rows={10} /></div>
                <Button onClick={handleGenerate} disabled={isProcessing} className="w-full" size="lg">{isProcessing ? "Generating..." : "Generate Letter"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Letter Ready!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="letter.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download Letter</a>
                  <Button variant="secondary" onClick={handleReset}>Write Another</Button>
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

export default LetterWriter;
