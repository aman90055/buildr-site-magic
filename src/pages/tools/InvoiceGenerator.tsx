import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Receipt, Download, Plus, Trash2 } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface InvoiceItem { description: string; qty: number; price: number; }

const InvoiceGenerator = () => {
  const [from, setFrom] = useState({ name: "", address: "", email: "" });
  const [to, setTo] = useState({ name: "", address: "", email: "" });
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", qty: 1, price: 0 }]);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const addItem = () => setItems([...items, { description: "", qty: 1, price: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof InvoiceItem, val: string | number) => {
    const updated = [...items]; updated[i] = { ...updated[i], [field]: val }; setItems(updated);
  };
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const handleGenerate = async () => {
    if (!from.name || !to.name) { toast({ title: "Error", description: "Please fill in sender and recipient names.", variant: "destructive" }); return; }
    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const page = pdf.addPage([595, 842]);
      const { width } = page.getSize();
      let y = 790;
      const m = 50;

      // Header
      page.drawText("INVOICE", { x: m, y, size: 28, font: bold, color: rgb(0.2, 0.2, 0.8) });
      page.drawText(invoiceNo, { x: width - m - bold.widthOfTextAtSize(invoiceNo, 12), y, size: 12, font: bold, color: rgb(0.3, 0.3, 0.3) });
      y -= 15;
      page.drawText(`Date: ${new Date(date).toLocaleDateString("en-IN")}`, { x: width - m - 120, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
      y -= 30;

      // From / To
      page.drawText("From:", { x: m, y, size: 10, font: bold, color: rgb(0.3, 0.3, 0.3) });
      page.drawText("To:", { x: 320, y, size: 10, font: bold, color: rgb(0.3, 0.3, 0.3) });
      y -= 14;
      page.drawText(from.name, { x: m, y, size: 11, font: bold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(to.name, { x: 320, y, size: 11, font: bold, color: rgb(0.1, 0.1, 0.1) });
      y -= 14;
      if (from.address) { page.drawText(from.address, { x: m, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) }); }
      if (to.address) { page.drawText(to.address, { x: 320, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) }); }
      y -= 14;
      if (from.email) { page.drawText(from.email, { x: m, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) }); }
      if (to.email) { page.drawText(to.email, { x: 320, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) }); }
      y -= 30;

      // Table header
      page.drawRectangle({ x: m, y: y - 5, width: width - m * 2, height: 20, color: rgb(0.9, 0.9, 0.95) });
      page.drawText("Description", { x: m + 5, y: y, size: 9, font: bold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText("Qty", { x: 350, y: y, size: 9, font: bold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText("Price", { x: 400, y: y, size: 9, font: bold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText("Total", { x: 470, y: y, size: 9, font: bold, color: rgb(0.2, 0.2, 0.2) });
      y -= 20;

      // Items
      for (const item of items) {
        if (item.description) {
          page.drawText(item.description, { x: m + 5, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
          page.drawText(String(item.qty), { x: 350, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
          page.drawText(`₹${item.price.toFixed(2)}`, { x: 400, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
          page.drawText(`₹${(item.qty * item.price).toFixed(2)}`, { x: 470, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
          y -= 18;
        }
      }

      // Total
      y -= 10;
      page.drawLine({ start: { x: 400, y: y + 5 }, end: { x: width - m, y: y + 5 }, thickness: 1, color: rgb(0.3, 0.3, 0.3) });
      page.drawText("Total:", { x: 400, y: y - 10, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(`₹${total.toFixed(2)}`, { x: 470, y: y - 10, size: 12, font: bold, color: rgb(0.2, 0.2, 0.8) });

      // Notes
      if (notes) {
        y -= 50;
        page.drawText("Notes:", { x: m, y, size: 10, font: bold, color: rgb(0.3, 0.3, 0.3) });
        y -= 14;
        page.drawText(notes, { x: m, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
      }

      // Footer
      page.drawText("Generated by PDF Tools - Made in India 🇮🇳", { x: m, y: 30, size: 8, font, color: rgb(0.6, 0.6, 0.6) });

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Invoice Generated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate invoice.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); };

  return (
    <>
      <Helmet><title>Invoice Generator - Create PDF Invoices | PDF Tools</title><meta name="description" content="Create professional invoices in PDF format." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><Receipt className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Invoice Generator</h1>
              <p className="text-muted-foreground">Create professional invoices in PDF format.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">From</h3>
                    <Input placeholder="Your Name/Company" value={from.name} onChange={(e) => setFrom({...from, name: e.target.value})} />
                    <Input placeholder="Address" value={from.address} onChange={(e) => setFrom({...from, address: e.target.value})} />
                    <Input placeholder="Email" value={from.email} onChange={(e) => setFrom({...from, email: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">To</h3>
                    <Input placeholder="Client Name/Company" value={to.name} onChange={(e) => setTo({...to, name: e.target.value})} />
                    <Input placeholder="Address" value={to.address} onChange={(e) => setTo({...to, address: e.target.value})} />
                    <Input placeholder="Email" value={to.email} onChange={(e) => setTo({...to, email: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Invoice No.</Label><Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Items</h3>
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1"><Input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} /></div>
                      <div className="w-20"><Input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} min={1} /></div>
                      <div className="w-24"><Input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(i, "price", Number(e.target.value))} min={0} /></div>
                      {items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(i)}><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
                  <div className="text-right text-lg font-bold text-foreground">Total: ₹{total.toFixed(2)}</div>
                </div>
                <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, bank details, etc." rows={3} /></div>
                <Button onClick={handleGenerate} disabled={isProcessing} className="w-full" size="lg">{isProcessing ? "Generating..." : "Generate Invoice"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Invoice Ready!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download={`${invoiceNo}.pdf`} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download Invoice</a>
                  <Button variant="secondary" onClick={handleReset}>Create Another</Button>
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

export default InvoiceGenerator;
