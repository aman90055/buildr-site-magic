import { useMemo, useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function JSONFormatter() {
  const [input, setInput] = useState('{"name":"DocuNova","tools":100,"free":true,"features":["pdf","ai","ocr"]}');
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, formatted: "" };
    try {
      const obj = JSON.parse(input);
      return { ok: true, formatted: JSON.stringify(obj, null, indent) };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }, [input, indent]);

  return (
    <ToolShell
      title="JSON Formatter & Validator | DocuNova"
      description="Validate and pretty-print JSON with customizable indentation. Get clear error messages on invalid input."
      heading="JSON Formatter & Validator"
      intro="Validate JSON and pretty-print it with the indentation you choose."
      guide={`JSON (JavaScript Object Notation) is the most common data format on the web. It's strict: keys must be double-quoted, no trailing commas, no comments. This tool uses the browser's native JSON.parse for validation, so the errors you see match what your application sees.\n\nAll formatting runs locally — your data never leaves the browser.`}
      faqs={[
        { q: "Why does JSON.parse fail on my data?", a: "Common causes: single quotes instead of double, trailing commas, unquoted keys, JS-style comments." },
        { q: "Can I minify JSON here?", a: "Yes — set indent to 0 and the output is minified." },
      ]}
      related={[
        { name: "Minify & Beautify", href: "/tools/minify-beautify" },
        { name: "Base64", href: "/tools/base64" },
        { name: "Regex Tester", href: "/tools/regex-tester" },
      ]}
      canonical="/tools/json-formatter"
    >
      <div className="flex items-center gap-3 mb-3">
        <Label>Indent</Label>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={indent} onChange={e => setIndent(parseInt(e.target.value))}>
          <option value={0}>Minify</option>
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
        {result.ok ? (
          <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400"><CheckCircle2 className="h-4 w-4" />Valid JSON</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm text-destructive"><XCircle className="h-4 w-4" />Invalid</span>
        )}
      </div>
      <Label>Input</Label>
      <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[180px] font-mono text-xs mb-3" />
      <Label>Output</Label>
      <Textarea readOnly value={result.ok ? result.formatted : result.error || ""} className={`min-h-[180px] font-mono text-xs ${!result.ok ? "text-destructive" : ""}`} />
      {result.ok && result.formatted && (
        <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(result.formatted); toast({ title: "Copied" }); }}><Copy className="h-3 w-3 mr-2" />Copy</Button>
      )}
    </ToolShell>
  );
}
