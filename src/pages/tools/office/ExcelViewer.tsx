import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

export default function ExcelViewer() {
  const [sheets, setSheets] = useState<{ name: string; rows: any[][] }[]>([]);
  const [active, setActive] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/vnd.ms-excel": [".xls"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
    multiple: false,
    onDrop: async (f) => {
      const file = f[0]; if (!file) return;
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const parsed = wb.SheetNames.map(n => ({ name: n, rows: XLSX.utils.sheet_to_json<any[]>(wb.Sheets[n], { header: 1, defval: "" }) }));
      setSheets(parsed); setActive(0);
    },
  });

  const current = sheets[active];

  return (
    <ToolShell
      title="Excel Viewer — Open .xlsx & .xls Online | DocuNova"
      description="View Excel spreadsheets (.xlsx, .xls) directly in your browser. No upload, no signup."
      heading="Excel Viewer"
      intro="Drop an Excel file to preview every sheet as a table."
      canonical="https://docunova-ai.lovable.app/tools/excel-viewer"
      faqs={[{ q: "Are formulas evaluated?", a: "Cached formula values are shown. Live recalculation requires Excel itself." }]}
      related={[{ name: "CSV Viewer", href: "/tools/csv-viewer" }, { name: "Excel to PDF", href: "/excel-to-pdf" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} />
        <FileSpreadsheet className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>Drop .xlsx or .xls file here</p>
      </div>
      {sheets.length > 0 && (
        <>
          <div className="flex gap-2 mb-3 overflow-auto">
            {sheets.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} className={`px-3 py-1 rounded-md text-sm whitespace-nowrap border ${i === active ? "bg-primary text-primary-foreground" : "bg-muted/40"}`}>{s.name}</button>
            ))}
          </div>
          <div className="overflow-auto max-h-[500px] border rounded-lg">
            <table className="text-xs w-full">
              <tbody>
                {current?.rows.slice(0, 500).map((row, r) => (
                  <tr key={r} className="border-b">
                    {row.map((cell, c) => <td key={c} className="px-2 py-1 border-r whitespace-nowrap">{String(cell ?? "")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {current && current.rows.length > 500 && <div className="text-xs text-muted-foreground mt-2">Showing first 500 of {current.rows.length} rows.</div>}
        </>
      )}
    </ToolShell>
  );
}
