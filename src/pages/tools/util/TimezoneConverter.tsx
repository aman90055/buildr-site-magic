import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ZONES = [
  "UTC","Asia/Kolkata","Asia/Dubai","Asia/Singapore","Asia/Tokyo","Asia/Shanghai","Asia/Karachi","Asia/Dhaka",
  "Europe/London","Europe/Paris","Europe/Berlin","Europe/Moscow","Europe/Istanbul",
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Toronto","America/Sao_Paulo",
  "Australia/Sydney","Australia/Perth","Africa/Cairo","Africa/Johannesburg","Pacific/Auckland",
];

export default function TimezoneConverter() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState("UTC");
  const targets = ["America/New_York","Europe/London","Asia/Kolkata","Asia/Dubai","Asia/Tokyo","Australia/Sydney"];

  // Parse "YYYY-MM-DDTHH:mm" as time in `from` zone via offset math
  const sourceDate = useMemo(() => {
    if (!date) return null;
    // treat input as local-zone-naive; build a real instant by computing the zone offset
    const naive = new Date(date + ":00Z"); // UTC interpretation
    // determine offset of `from` at this instant
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: from, timeZoneName: "shortOffset" });
    const parts = fmt.formatToParts(naive);
    const tzPart = parts.find(p => p.type === "timeZoneName")?.value || "GMT";
    const m = tzPart.match(/GMT([+-]\d+)(?::(\d+))?/);
    const offsetMin = m ? (parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) * Math.sign(parseInt(m[1], 10)) : 0)) : 0;
    return new Date(naive.getTime() - offsetMin * 60000);
  }, [date, from]);

  const format = (tz: string) => sourceDate ? new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, dateStyle: "medium", timeStyle: "long",
  }).format(sourceDate) : "—";

  return (
    <ToolShell
      title="Time Zone Converter — Compare Times Across Cities | DocuNova"
      description="Convert any date and time between world time zones. Plan meetings across IST, EST, GMT, PST and more."
      heading="Time Zone Converter"
      intro="Enter a date/time in a source time zone and see equivalents around the world."
      canonical="https://docunova-ai.lovable.app/tools/timezone-converter"
      faqs={[{ q: "Does this handle daylight saving?", a: "Yes — IANA time zone database is used via the browser's Intl API, so DST is applied automatically." }]}
      related={[{ name: "Age Calculator", href: "/tools/age-calculator" }, { name: "Timestamp Converter", href: "/tools/timestamp-converter" }]}
    >
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div><Label>Date & Time</Label><Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div>
          <Label>Source Time Zone</Label>
          <Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{ZONES.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {targets.map(z => (
          <div key={z} className="p-3 rounded-lg border bg-muted/40">
            <div className="text-xs text-muted-foreground">{z}</div>
            <div className="font-semibold">{format(z)}</div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
