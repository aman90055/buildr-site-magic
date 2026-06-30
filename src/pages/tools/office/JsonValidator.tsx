import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle } from "lucide-react";

export default function JsonValidator() {
  const [text, setText] = useState('{\n  "name": "Alice",\n  "age": 30\n}');

  const result = useMemo(() => {
    if (!text.trim()) return { ok: false, msg: "Empty input", parsed: null };
    try {
      const parsed = JSON.parse(text);
      const type = Array.isArray(parsed) ? `Array(${parsed.length})` : typeof parsed;
      return { ok: true, msg: `Valid JSON · ${type}`, parsed };
    } catch (e: any) {
      const m = e.message.match(/position (\d+)/);
      let lineInfo = "";
      if (m) {
        const pos = +m[1];
        const before = text.slice(0, pos);
        const line = before.split("\n").length;
        const col = pos - before.lastIndexOf("\n");
        lineInfo = ` (line ${line}, col ${col})`;
      }
      return { ok: false, msg: e.message + lineInfo, parsed: null };
    }
  }, [text]);

  return (
    <ToolShell
      title="JSON Validator — Check JSON Syntax with Line Errors | DocuNova"
      description="Validate JSON instantly with detailed error messages including line and column. Free, client-side."
      heading="JSON Validator"
      intro="Paste JSON and see live validation with precise error locations."
      canonical="https://docunova-ai.lovable.app/tools/json-validator"
      faqs={[{ q: "How does it differ from JSON Formatter?", a: "The validator focuses on detecting errors with line/column. The Formatter pretty-prints valid JSON." }]}
      related={[{ name: "JSON Formatter", href: "/tools/json-formatter" }, { name: "JSON ↔ CSV ↔ XML", href: "/tools/json-csv-xml" }]}
    >
      <Textarea value={text} onChange={e => setText(e.target.value)} className="font-mono text-xs min-h-[300px] mb-3" />
      <div className={`p-3 rounded-lg border flex items-start gap-2 ${result.ok ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30"}`}>
        {result.ok ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> : <XCircle className="h-5 w-5 text-destructive shrink-0" />}
        <div className="text-sm font-mono">{result.msg}</div>
      </div>
    </ToolShell>
  );
}
