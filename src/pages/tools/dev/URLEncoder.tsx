import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function URLEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"component" | "uri">("component");

  const encode = () => {
    try {
      setOutput(mode === "component" ? encodeURIComponent(input) : encodeURI(input));
    } catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };
  const decode = () => {
    try {
      setOutput(mode === "component" ? decodeURIComponent(input) : decodeURI(input));
    } catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const swap = () => { setInput(output); setOutput(""); };

  return (
    <ToolShell
      title="URL Encoder / Decoder | DocuNova"
      description="Encode or decode URL strings and components. Choose between encodeURIComponent and encodeURI modes."
      heading="URL Encoder / Decoder"
      intro="Encode or decode URL strings, query parameters, and components. Toggle between full-URI and component encoding."
      guide={`URL encoding (also called percent-encoding) replaces reserved characters with %XX sequences so they survive transmission in URLs. Use 'component' mode for query string values, path segments and form data — it encodes characters like / & = ? #. Use 'uri' mode for full URLs to preserve those reserved characters.\n\nEverything runs locally in the browser.`}
      faqs={[
        { q: "What's the difference between encodeURI and encodeURIComponent?", a: "encodeURI preserves reserved URL characters like / : ? # &. encodeURIComponent encodes them — use it for query values and path segments." },
        { q: "Why am I getting 'URI malformed'?", a: "The input contains an invalid percent-encoded sequence. Make sure each % is followed by two hex digits." },
      ]}
      related={[
        { name: "Base64", href: "/tools/base64" },
        { name: "JSON Formatter", href: "/tools/json-formatter" },
        { name: "Hash Generator", href: "/tools/hash-generator" },
      ]}
      canonical="/tools/url-encoder"
    >
      <div className="flex gap-3 items-end mb-3">
        <div className="flex-1">
          <Label>Mode</Label>
          <select className="w-full mt-1 h-10 rounded-md border bg-background px-3" value={mode} onChange={e => setMode(e.target.value as "component" | "uri")}>
            <option value="component">encodeURIComponent (query, path)</option>
            <option value="uri">encodeURI (full URL)</option>
          </select>
        </div>
      </div>
      <Label>Input</Label>
      <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[120px] font-mono text-sm mb-3" placeholder="Enter text or URL…" />
      <div className="flex gap-2 mb-3 flex-wrap">
        <Button onClick={encode}><ArrowDown className="h-4 w-4 mr-2" />Encode</Button>
        <Button onClick={decode} variant="outline"><ArrowUp className="h-4 w-4 mr-2" />Decode</Button>
        <Button onClick={swap} variant="ghost" disabled={!output}>Swap</Button>
      </div>
      <Label>Output</Label>
      <Textarea readOnly value={output} className="min-h-[120px] font-mono text-sm" />
      {output && <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied" }); }}><Copy className="h-3 w-3 mr-2" />Copy output</Button>}
    </ToolShell>
  );
}
