import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Lang = "html" | "css" | "js" | "json" | "xml";

function minifyHtml(s: string) {
  return s.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}
function minifyCss(s: string) {
  return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim();
}
function minifyJs(s: string) {
  // Safe-ish: strip /* */ and // line comments outside strings and collapse whitespace.
  // Not a full JS minifier — preserves correctness for most snippets.
  let out = ""; let i = 0; const n = s.length;
  while (i < n) {
    const c = s[i], d = s[i + 1];
    if (c === "/" && d === "*") { const e = s.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === "/" && d === "/") { while (i < n && s[i] !== "\n") i++; continue; }
    if (c === '"' || c === "'" || c === "`") {
      const q = c; out += c; i++;
      while (i < n) { out += s[i]; if (s[i] === "\\") { out += s[i + 1] || ""; i += 2; continue; } if (s[i] === q) { i++; break; } i++; }
      continue;
    }
    out += c; i++;
  }
  return out.replace(/\s+/g, " ").replace(/\s*([{};,:()<>=+\-*/%&|!?])\s*/g, "$1").trim();
}
function minifyJson(s: string) { return JSON.stringify(JSON.parse(s)); }
function minifyXml(s: string) { return s.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim(); }

function beautifyJson(s: string) { return JSON.stringify(JSON.parse(s), null, 2); }
function beautifyXml(s: string) {
  const PAD = "  ";
  let formatted = "", indent = "";
  s.replace(/>\s*</g, ">\n<").split("\n").forEach(node => {
    if (/^<\/\w/.test(node)) indent = indent.slice(PAD.length);
    formatted += indent + node + "\n";
    if (/^<\w[^>]*[^/]>.*$/.test(node) && !/<\/\w/.test(node)) indent += PAD;
  });
  return formatted.trim();
}
function beautifyHtml(s: string) { return beautifyXml(s); }
function beautifyCss(s: string) {
  return s.replace(/\s*\{\s*/g, " {\n  ").replace(/;\s*/g, ";\n  ").replace(/\s*}\s*/g, "\n}\n").replace(/\n\s*\n/g, "\n").trim();
}
function beautifyJs(s: string) {
  // Lightweight: add newlines after ; and { and before }
  let out = "", depth = 0;
  const pad = (d: number) => "  ".repeat(Math.max(0, d));
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "{") { out += "{\n"; depth++; out += pad(depth); continue; }
    if (c === "}") { depth--; out = out.replace(/\s+$/, "") + "\n" + pad(depth) + "}"; continue; }
    if (c === ";") { out += ";\n" + pad(depth); continue; }
    out += c;
  }
  return out.trim();
}

export default function MinifyBeautify() {
  const [lang, setLang] = useState<Lang>("json");
  const [input, setInput] = useState('{"hello":"world","count":3}');
  const [output, setOutput] = useState("");

  const run = (op: "min" | "pretty") => {
    try {
      const map = {
        html: { min: minifyHtml, pretty: beautifyHtml },
        css: { min: minifyCss, pretty: beautifyCss },
        js: { min: minifyJs, pretty: beautifyJs },
        json: { min: minifyJson, pretty: beautifyJson },
        xml: { min: minifyXml, pretty: beautifyXml },
      } as const;
      setOutput(map[lang][op](input));
    } catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  return (
    <ToolShell
      title="Minify & Beautify — HTML, CSS, JS, JSON, XML | DocuNova"
      description="Minify or beautify HTML, CSS, JavaScript, JSON, and XML. Fast, free, and entirely client-side."
      heading="Minify & Beautify"
      intro="Compress or pretty-print HTML, CSS, JavaScript, JSON or XML — all in your browser."
      guide={`Minification removes unnecessary whitespace, comments and formatting to shrink file size for production. Beautification reverses that, adding indentation and line breaks to make code readable. This tool uses lightweight client-side formatters suitable for snippets — for large production bundles, prefer dedicated tooling like esbuild or terser in your build pipeline.`}
      faqs={[
        { q: "Is this a full JS minifier like terser?", a: "No — it's a lightweight whitespace/comment-stripping pass that's safe for snippets. For production bundles, use esbuild, terser, or your bundler." },
        { q: "Does my code leave the browser?", a: "No. All formatting runs locally." },
      ]}
      related={[
        { name: "JSON Formatter", href: "/tools/json-formatter" },
        { name: "Base64", href: "/tools/base64" },
        { name: "Regex Tester", href: "/tools/regex-tester" },
      ]}
      canonical="/tools/minify-beautify"
    >
      <div className="grid sm:grid-cols-[160px_1fr] gap-3 mb-3 items-end">
        <div>
          <Label>Language</Label>
          <select className="w-full mt-1 h-10 rounded-md border bg-background px-3" value={lang} onChange={e => setLang(e.target.value as Lang)}>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
            <option value="xml">XML</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => run("min")} className="flex-1">Minify</Button>
          <Button onClick={() => run("pretty")} variant="outline" className="flex-1">Beautify</Button>
        </div>
      </div>
      <Label>Input</Label>
      <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[160px] font-mono text-xs mb-3" />
      <Label>Output</Label>
      <Textarea readOnly value={output} className="min-h-[160px] font-mono text-xs" />
      {output && <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied" }); }}><Copy className="h-3 w-3 mr-2" />Copy</Button>}
    </ToolShell>
  );
}
