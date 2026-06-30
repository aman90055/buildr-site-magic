import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// UTF-8 safe Base64
function b64encode(s: string) { return btoa(unescape(encodeURIComponent(s))); }
function b64decode(s: string) { try { return decodeURIComponent(escape(atob(s))); } catch { return atob(s); } }

export default function Base64() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  const encode = () => {
    try {
      let r = b64encode(input);
      if (urlSafe) r = r.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      setOutput(r);
    } catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };
  const decode = () => {
    try {
      let s = input.trim();
      if (urlSafe) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; }
      setOutput(b64decode(s));
    } catch (e) { toast({ title: "Error", description: "Not valid Base64. " + (e as Error).message, variant: "destructive" }); }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = ""; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    let r = btoa(bin);
    if (urlSafe) r = r.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    setOutput(`data:${f.type || "application/octet-stream"};base64,${r}`);
    setInput(`<file: ${f.name} · ${(f.size / 1024).toFixed(1)} KB>`);
  };

  return (
    <ToolShell
      title="Base64 Encoder / Decoder + File to Data URL | DocuNova"
      description="Encode or decode Base64 text. Convert files to data URLs. URL-safe Base64 supported."
      heading="Base64 Encoder / Decoder"
      intro="Encode or decode Base64 text and convert files to data URLs. UTF-8 and URL-safe variants supported."
      guide={`Base64 turns binary data into 64 printable ASCII characters so it can travel through text-only channels like email, JSON or URLs. It expands data by ~33%, so don't Base64-encode large assets you intend to serve over the web.\n\nURL-safe Base64 replaces + and / with - and _ so the result can be used in URLs and file names without further escaping.`}
      faqs={[
        { q: "Why does my encoded text look wrong?", a: "Make sure URL-safe is unchecked if you're using a standard Base64 decoder elsewhere." },
        { q: "Can I encode images?", a: "Yes — use the file upload to get a data URL you can paste into CSS or HTML." },
      ]}
      related={[
        { name: "URL Encoder", href: "/tools/url-encoder" },
        { name: "JWT Decoder", href: "/tools/jwt-decoder" },
        { name: "Hash Generator", href: "/tools/hash-generator" },
      ]}
      canonical="/tools/base64"
    >
      <label className="flex items-center gap-2 text-sm mb-3">
        <input type="checkbox" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} />
        URL-safe (Base64URL)
      </label>
      <Label>Input</Label>
      <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[140px] font-mono text-sm mb-2" placeholder="Enter text…" />
      <div className="flex gap-2 mb-3 flex-wrap items-center">
        <Button onClick={encode}><ArrowDown className="h-4 w-4 mr-2" />Encode</Button>
        <Button variant="outline" onClick={decode}><ArrowUp className="h-4 w-4 mr-2" />Decode</Button>
        <label className="text-sm">
          <input type="file" className="hidden" onChange={onFile} />
          <span className="inline-flex h-9 items-center px-3 rounded-md border cursor-pointer hover:bg-accent text-sm">Encode file…</span>
        </label>
      </div>
      <Label>Output</Label>
      <Textarea readOnly value={output} className="min-h-[140px] font-mono text-xs" />
      {output && <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied" }); }}><Copy className="h-3 w-3 mr-2" />Copy</Button>}
    </ToolShell>
  );
}
