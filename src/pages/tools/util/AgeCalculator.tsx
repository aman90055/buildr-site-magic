import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [target, setTarget] = useState(new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    const a = new Date(dob);
    const b = new Date(target);
    if (isNaN(+a) || isNaN(+b) || b < a) return null;
    let y = b.getFullYear() - a.getFullYear();
    let m = b.getMonth() - a.getMonth();
    let d = b.getDate() - a.getDate();
    if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((+b - +a) / 86400000);
    return { y, m, d, days, weeks: Math.floor(days / 7), months: y * 12 + m, hours: days * 24 };
  }, [dob, target]);

  return (
    <ToolShell
      title="Age Calculator — Years, Months, Days | DocuNova"
      description="Calculate exact age from your date of birth — years, months, days, weeks and total days lived."
      heading="Age Calculator"
      intro="Enter your date of birth and a target date to compute your exact age."
      canonical="https://docunova-ai.lovable.app/tools/age-calculator"
      guide="Age is computed by subtracting calendar components and borrowing days/months as needed — the same method used for legal age and pension eligibility."
      faqs={[{ q: "Does it account for leap years?", a: "Yes — exact day differences are computed from millisecond timestamps, so leap years and DST are handled correctly." }]}
      related={[{ name: "Time Zone Converter", href: "/tools/timezone-converter" }, { name: "Timestamp Converter", href: "/tools/timestamp-converter" }]}
    >
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div><Label>Date of Birth</Label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
        <div><Label>Age At</Label><Input type="date" value={target} onChange={e => setTarget(e.target.value)} /></div>
      </div>
      {result && (
        <div className="grid md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Age</div><div className="text-xl font-bold">{result.y}y {result.m}m {result.d}d</div></div>
          <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Total Months</div><div className="text-xl font-bold">{result.months}</div></div>
          <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Total Days</div><div className="text-xl font-bold">{result.days.toLocaleString()}</div></div>
          <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Total Weeks</div><div className="text-xl font-bold">{result.weeks.toLocaleString()}</div></div>
          <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Total Hours</div><div className="text-xl font-bold">{result.hours.toLocaleString()}</div></div>
        </div>
      )}
    </ToolShell>
  );
}
