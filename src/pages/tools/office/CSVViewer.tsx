import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { Table } from "lucide-react";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [], cell = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(cell); cell = ""; }
      else if (c === "\n") { cur.push(cell); rows.push(cur); cur = []; cell = ""; }
      else if (c === "\r") {}
      else cell += c;
    }
  }
  if (cell || cur.length) { cur.push(cell); rows.push(cur); }
  return rows;
}

export default function CSVViewer() {
  const [text, setText] = useState("");
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"], "text/plain": [".csv", ".tsv"] },
    multiple: false,
    onDrop: async (f) => { const file = f[0]; if (file) setText(await file.text()); },
  });

  const rows = useMemo(() => parseCSV(text), [text]);

  return (
    <ToolShell
      title="CSV Viewer — Preview CSV Files Online | DocuNova"
      description="Open and view CSV files as tables. Drop a file or paste text. RFC 4180 quoted fields supported."
      heading="CSV Viewer"
      intro="Paste CSV or drop a .csv file to render it as a table."
      canonical="https://docunova-ai.lovable.app/tools/csv-viewer"
      faqs={[{ q: "Does it support quoted fields with commas?", a: "Yes — full RFC 4180 quoting including escaped double quotes." }]}
      related={[{ name: "JSON ↔ CSV ↔ XML", href: "/tools/json-csv-xml" }, { name: "Excel Viewer", href: "/tools/excel-viewer" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40 mb-3">
        <input {...getInputProps()} />
        <Table className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
        <p className="text-sm">Drop .csv or paste below</p>
      </div>
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="name,age,city&#10;Alice,30,Mumbai" className="font-mono text-xs min-h-[120px] mb-3" />
      {rows.length > 0 && (
        <div className="overflow-auto max-h-[500px] border rounded-lg">
          <table className="text-xs w-full">
            <thead className="bg-muted sticky top-0">
              <tr>{rows[0].map((h, i) => <th key={i} className="px-2 py-1 border-r text-left whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(1, 500).map((row, r) => (
                <tr key={r} className="border-b">{row.map((c, i) => <td key={i} className="px-2 py-1 border-r whitespace-nowrap">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolShell>
  );
}
