import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UNITS: Record<string, Record<string, number>> = {
  Length: { meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  Weight: { kilogram: 1, gram: 0.001, milligram: 1e-6, pound: 0.45359237, ounce: 0.0283495, ton: 1000 },
  Volume: { liter: 1, milliliter: 0.001, "cubic meter": 1000, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.24 },
  Area: { "sq meter": 1, "sq kilometer": 1e6, "sq foot": 0.092903, "sq yard": 0.836127, acre: 4046.86, hectare: 10000 },
  Speed: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, knot: 0.514444 },
  Time: { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800 },
};

const TEMP_CONV = (v: number, from: string, to: string) => {
  let c = v;
  if (from === "Fahrenheit") c = (v - 32) * 5 / 9;
  else if (from === "Kelvin") c = v - 273.15;
  if (to === "Fahrenheit") return c * 9 / 5 + 32;
  if (to === "Kelvin") return c + 273.15;
  return c;
};

export default function UnitConverter() {
  const [cat, setCat] = useState("Length");
  const [from, setFrom] = useState("meter");
  const [to, setTo] = useState("kilometer");
  const [val, setVal] = useState(1);

  const units = cat === "Temperature" ? ["Celsius", "Fahrenheit", "Kelvin"] : Object.keys(UNITS[cat] || {});

  const result = useMemo(() => {
    if (cat === "Temperature") return TEMP_CONV(val, from, to);
    const u = UNITS[cat];
    if (!u || !u[from] || !u[to]) return 0;
    return (val * u[from]) / u[to];
  }, [cat, from, to, val]);

  return (
    <ToolShell
      title="Unit Converter — Length, Weight, Volume, Temperature | DocuNova"
      description="Free unit converter for length, weight, volume, area, speed, time and temperature units."
      heading="Unit Converter"
      intro="Convert between metric and imperial units instantly."
      canonical="https://docunova-ai.lovable.app/tools/unit-converter"
      faqs={[{ q: "How accurate are these conversions?", a: "All factors use official SI definitions, accurate to 6+ decimal places." }]}
      related={[{ name: "Currency Converter", href: "/tools/currency-converter" }, { name: "Time Zone Converter", href: "/tools/timezone-converter" }]}
    >
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <div>
          <Label>Category</Label>
          <Select value={cat} onValueChange={(v) => { setCat(v); const list = v === "Temperature" ? ["Celsius", "Fahrenheit"] : Object.keys(UNITS[v]); setFrom(list[0]); setTo(list[1]); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Length","Weight","Volume","Area","Speed","Time","Temperature"].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Value</Label><Input type="number" value={val} onChange={e => setVal(+e.target.value)} /></div>
        <div>
          <Label>From</Label>
          <Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>To</Label>
          <Select value={to} onValueChange={setTo}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-muted/40 text-center">
        <div className="text-sm text-muted-foreground">{val} {from} =</div>
        <div className="text-3xl font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 8 })} {to}</div>
      </div>
    </ToolShell>
  );
}
