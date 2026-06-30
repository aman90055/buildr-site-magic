import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    if (mode === "add") {
      const gst = (amount * rate) / 100;
      return { base: amount, gst, total: amount + gst };
    } else {
      const base = (amount * 100) / (100 + rate);
      return { base, gst: amount - base, total: amount };
    }
  }, [amount, rate, mode]);

  const fmt = (n: number) => "₹" + n.toFixed(2);

  return (
    <ToolShell
      title="GST Calculator — Add/Remove GST (5%, 12%, 18%, 28%) | DocuNova"
      description="Free GST calculator. Add or remove GST at 5%, 12%, 18%, 28% slabs. Get base price, GST and total instantly."
      heading="GST Calculator"
      intro="Calculate GST (CGST+SGST/IGST) on any amount — add or remove tax."
      canonical="https://docunova-ai.lovable.app/tools/gst-calculator"
      guide="Choose 'Add GST' to compute the gross amount after adding tax, or 'Remove GST' to extract base price from a tax-inclusive amount. Common slabs are 5%, 12%, 18%, and 28%."
      faqs={[
        { q: "What does CGST+SGST mean?", a: "For intra-state sales, GST splits equally — e.g., 18% = 9% CGST + 9% SGST. For inter-state, the full 18% is IGST." },
      ]}
      related={[{ name: "EMI Calculator", href: "/tools/emi-calculator" }, { name: "Percentage Calculator", href: "/tools/percentage-calculator" }]}
    >
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(+e.target.value)} /></div>
        <div><Label>GST Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(+e.target.value)} /></div>
        <div>
          <Label>Mode</Label>
          <Select value={mode} onValueChange={(v: any) => setMode(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add GST</SelectItem>
              <SelectItem value="remove">Remove GST (extract base)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-muted/40"><div className="text-sm text-muted-foreground">Base Price</div><div className="text-xl font-bold">{fmt(result.base)}</div></div>
        <div className="p-4 rounded-lg border bg-muted/40"><div className="text-sm text-muted-foreground">GST</div><div className="text-xl font-bold">{fmt(result.gst)}</div></div>
        <div className="p-4 rounded-lg border bg-muted/40"><div className="text-sm text-muted-foreground">Total</div><div className="text-xl font-bold">{fmt(result.total)}</div></div>
      </div>
    </ToolShell>
  );
}
