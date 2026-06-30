import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const n = years * 12;
    const r = rate / 12 / 100;
    if (!principal || !rate || !years) return { emi: 0, total: 0, interest: 0 };
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return { emi, total, interest: total - principal };
  }, [principal, rate, years]);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <ToolShell
      title="EMI Calculator — Loan EMI, Interest & Schedule | DocuNova"
      description="Calculate your monthly EMI for home, car or personal loans. Free EMI calculator with total interest and payable amount."
      heading="EMI Calculator"
      intro="Estimate monthly installments for any loan amount, interest rate and tenure."
      canonical="https://docunova-ai.lovable.app/tools/emi-calculator"
      guide="Enter the loan principal, annual interest rate (in %) and tenure (years). The calculator uses the standard reducing-balance EMI formula: EMI = P×r×(1+r)^n / ((1+r)^n - 1), where r is monthly rate and n is months."
      faqs={[
        { q: "Is this calculator accurate for Indian banks?", a: "Yes, it uses the reducing-balance method which is the standard for Indian home, car and personal loans." },
        { q: "Does it include processing fees?", a: "No, this is the pure EMI for principal + interest. Add processing fees separately if your bank charges them." },
      ]}
      related={[
        { name: "GST Calculator", href: "/tools/gst-calculator" },
        { name: "Percentage Calculator", href: "/tools/percentage-calculator" },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div><Label>Loan Amount (₹)</Label><Input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} /></div>
        <div><Label>Interest Rate (% p.a.)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} /></div>
        <div><Label>Tenure (years)</Label><Input type="number" value={years} onChange={e => setYears(+e.target.value)} /></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-muted/40"><div className="text-sm text-muted-foreground">Monthly EMI</div><div className="text-2xl font-bold">{fmt(result.emi)}</div></div>
        <div className="p-4 rounded-lg border bg-muted/40"><div className="text-sm text-muted-foreground">Total Interest</div><div className="text-2xl font-bold">{fmt(result.interest)}</div></div>
        <div className="p-4 rounded-lg border bg-muted/40"><div className="text-sm text-muted-foreground">Total Payable</div><div className="text-2xl font-bold">{fmt(result.total)}</div></div>
      </div>
    </ToolShell>
  );
}
