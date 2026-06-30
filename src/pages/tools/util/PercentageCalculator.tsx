import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PercentageCalculator() {
  const [a, setA] = useState(20);
  const [b, setB] = useState(150);
  const [c, setC] = useState(80);
  const [d, setD] = useState(100);
  const [e, setE] = useState(100);
  const [f, setF] = useState(125);

  return (
    <ToolShell
      title="Percentage Calculator — % of, % Change, % Difference | DocuNova"
      description="Free percentage calculator for X% of Y, percentage change, increase/decrease and reverse percentage problems."
      heading="Percentage Calculator"
      intro="Solve all common percentage problems instantly."
      canonical="https://docunova-ai.lovable.app/tools/percentage-calculator"
      guide="Use these three blocks for: (1) finding X% of Y, (2) what percentage one number is of another, and (3) percentage change between two values."
      faqs={[{ q: "How is percentage change calculated?", a: "((new − old) / old) × 100. Positive values indicate increase, negative indicate decrease." }]}
      related={[{ name: "GST Calculator", href: "/tools/gst-calculator" }, { name: "EMI Calculator", href: "/tools/emi-calculator" }]}
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4 items-end p-4 rounded-lg border">
          <div className="flex items-end gap-2">
            <div className="flex-1"><Label>What is</Label><Input type="number" value={a} onChange={ev => setA(+ev.target.value)} /></div>
            <span className="pb-2">% of</span>
            <div className="flex-1"><Input type="number" value={b} onChange={ev => setB(+ev.target.value)} /></div>
          </div>
          <div className="text-2xl font-bold">= {((a * b) / 100).toFixed(2)}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 items-end p-4 rounded-lg border">
          <div className="flex items-end gap-2">
            <div className="flex-1"><Label>What % is</Label><Input type="number" value={c} onChange={ev => setC(+ev.target.value)} /></div>
            <span className="pb-2">of</span>
            <div className="flex-1"><Input type="number" value={d} onChange={ev => setD(+ev.target.value)} /></div>
          </div>
          <div className="text-2xl font-bold">= {d ? ((c / d) * 100).toFixed(2) : 0}%</div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 items-end p-4 rounded-lg border">
          <div className="flex items-end gap-2">
            <div className="flex-1"><Label>% change from</Label><Input type="number" value={e} onChange={ev => setE(+ev.target.value)} /></div>
            <span className="pb-2">to</span>
            <div className="flex-1"><Input type="number" value={f} onChange={ev => setF(+ev.target.value)} /></div>
          </div>
          <div className="text-2xl font-bold">= {e ? (((f - e) / e) * 100).toFixed(2) : 0}%</div>
        </div>
      </div>
    </ToolShell>
  );
}
