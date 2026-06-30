import { useMemo, useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TZS = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Asia/Tokyo", "Asia/Singapore", "Australia/Sydney"];

export default function TimestampConverter() {
  const [ts, setTs] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [dt, setDt] = useState<string>(new Date().toISOString().slice(0, 19));

  const fromTs = useMemo(() => {
    const n = Number(ts);
    if (!Number.isFinite(n)) return null;
    // Auto-detect ms vs s
    const ms = n > 1e12 ? n : n * 1000;
    return new Date(ms);
  }, [ts]);

  const fromDt = useMemo(() => {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? null : d;
  }, [dt]);

  const now = () => { setTs(String(Math.floor(Date.now() / 1000))); setDt(new Date().toISOString().slice(0, 19)); };

  return (
    <ToolShell
      title="Unix Timestamp Converter | DocuNova"
      description="Convert Unix timestamps to human dates and back. ISO 8601, timezone-aware, milliseconds + seconds."
      heading="Unix Timestamp Converter"
      intro="Convert between Unix timestamps (seconds or milliseconds) and human-readable dates across timezones."
      guide={`A Unix timestamp counts seconds (or milliseconds) since 1970-01-01 00:00:00 UTC. It's the lingua franca for storing instants in databases, APIs and log files because it's timezone-independent.\n\nThis tool auto-detects whether your input is in seconds or milliseconds (values larger than 10^12 are treated as ms) and shows the resulting moment in popular timezones.`}
      faqs={[
        { q: "Seconds or milliseconds?", a: "We auto-detect. If your number is larger than 10^12, it's treated as milliseconds." },
        { q: "Why do I see a different time than expected?", a: "Timestamps are timezone-independent. The displayed times show the same instant in different zones." },
      ]}
      related={[
        { name: "UUID Generator", href: "/tools/uuid-generator" },
        { name: "JSON Formatter", href: "/tools/json-formatter" },
      ]}
      canonical="/tools/timestamp-converter"
    >
      <Button variant="outline" onClick={now} className="mb-4">Use current time</Button>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Unix timestamp</Label>
          <Input value={ts} onChange={e => setTs(e.target.value)} className="font-mono" />
          {fromTs && !isNaN(fromTs.getTime()) && (
            <div className="mt-3 space-y-1 text-sm">
              <div><span className="text-muted-foreground">ISO:</span> <span className="font-mono">{fromTs.toISOString()}</span></div>
              {TZS.map(z => (
                <div key={z}><span className="text-muted-foreground">{z}:</span> <span className="font-mono">{fromTs.toLocaleString("en-GB", { timeZone: z })}</span></div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Label>Date (local)</Label>
          <Input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} />
          {fromDt && (
            <div className="mt-3 space-y-1 text-sm">
              <div><span className="text-muted-foreground">Seconds:</span> <span className="font-mono">{Math.floor(fromDt.getTime() / 1000)}</span></div>
              <div><span className="text-muted-foreground">Milliseconds:</span> <span className="font-mono">{fromDt.getTime()}</span></div>
              <div><span className="text-muted-foreground">ISO:</span> <span className="font-mono">{fromDt.toISOString()}</span></div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
