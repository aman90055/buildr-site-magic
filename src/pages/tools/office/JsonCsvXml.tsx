import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Fmt = "json" | "csv" | "xml";

function csvToRows(text: string): string[][] {
  const rows: string[][] = []; let cur: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true; else if (c === ",") { cur.push(cell); cell = ""; }
    else if (c === "\n") { cur.push(cell); rows.push(cur); cur = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || cur.length) { cur.push(cell); rows.push(cur); }
  return rows;
}

function rowsToObjects(rows: string[][]): any[] {
  if (rows.length < 2) return [];
  const [head, ...body] = rows;
  return body.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

function objectsToCSV(arr: any[]): string {
  if (!arr.length) return "";
  const keys = [...new Set(arr.flatMap(o => Object.keys(o)))];
  const esc = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [keys.join(","), ...arr.map(o => keys.map(k => esc(o[k])).join(","))].join("\n");
}

function objectsToXML(arr: any[]): string {
  const esc = (s: string) => String(s).replace(/[<>&'"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
  const items = arr.map(o => "  <item>\n" + Object.entries(o).map(([k, v]) => `    <${k}>${esc(v as any)}</${k}>`).join("\n") + "\n  </item>").join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${items}\n</root>`;
}

function xmlToObjects(text: string): any[] {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
  const items = doc.documentElement.children;
  return Array.from(items).map(node => {
    const obj: any = {};
    for (const child of Array.from(node.children)) obj[child.tagName] = child.textContent;
    return obj;
  });
}

function parse(text: string, fmt: Fmt): any[] {
  if (fmt === "json") { const d = JSON.parse(text); return Array.isArray(d) ? d : [d]; }
  if (fmt === "csv") return rowsToObjects(csvToRows(text));
  return xmlToObjects(text);
}

function stringify(arr: any[], fmt: Fmt): string {
  if (fmt === "json") return JSON.stringify(arr, null, 2);
  if (fmt === "csv") return objectsToCSV(arr);
  return objectsToXML(arr);
}

export default function JsonCsvXml() {
  const [input, setInput] = useState('[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]');
  const [from, setFrom] = useState<Fmt>("json");
  const [to, setTo] = useState<Fmt>("csv");
  const [output, setOutput] = useState("");
  const [err, setErr] = useState("");

  const run = () => {
    try { setErr(""); setOutput(stringify(parse(input, from), to)); }
    catch (e: any) { setErr(e.message); setOutput(""); }
  };

  return (
    <ToolShell
      title="JSON ↔ CSV ↔ XML Converter — Free Online | DocuNova"
      description="Convert between JSON, CSV and XML formats. Tabular data, arrays of objects, fully client-side."
      heading="JSON ↔ CSV ↔ XML Converter"
      intro="Pick source and target formats, paste data, and convert in one click."
      canonical="https://docunova-ai.lovable.app/tools/json-csv-xml"
      faqs={[{ q: "What structure is expected?", a: "An array of flat objects works best across all three formats. Nested objects flatten to JSON.stringify text in CSV/XML." }]}
      related={[{ name: "JSON Validator", href: "/tools/json-validator" }, { name: "JSON Formatter", href: "/tools/json-formatter" }]}
    >
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <div>
          <Select value={from} onValueChange={(v: any) => setFrom(v)}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["json","csv","xml"].map(f => <SelectItem key={f} value={f}>{f.toUpperCase()}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button onClick={run}>Convert →</Button>
        <div>
          <Select value={to} onValueChange={(v: any) => setTo(v)}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["json","csv","xml"].map(f => <SelectItem key={f} value={f}>{f.toUpperCase()}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-xs min-h-[260px]" />
        <div className="relative">
          <Textarea value={output} readOnly className="font-mono text-xs min-h-[260px]" />
          {output && <Button size="icon" variant="ghost" className="absolute top-1 right-1" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied" }); }}><Copy className="h-3 w-3" /></Button>}
        </div>
      </div>
      {err && <div className="text-destructive text-sm mt-2">{err}</div>}
    </ToolShell>
  );
}
