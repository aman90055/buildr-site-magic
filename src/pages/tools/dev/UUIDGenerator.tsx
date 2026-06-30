import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DEV_RELATED = [
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "Password Generator", href: "/tools/password-generator" },
  { name: "Base64 Encoder", href: "/tools/base64" },
  { name: "JWT Decoder", href: "/tools/jwt-decoder" },
];

export default function UUIDGenerator() {
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [uuids, setUuids] = useState<string[]>([]);

  const v4 = () => crypto.randomUUID();
  const v7 = () => {
    // UUIDv7: 48-bit unix ms timestamp + 74 random bits
    const ts = BigInt(Date.now());
    const rand = new Uint8Array(10);
    crypto.getRandomValues(rand);
    const bytes = new Uint8Array(16);
    bytes[0] = Number((ts >> 40n) & 0xffn);
    bytes[1] = Number((ts >> 32n) & 0xffn);
    bytes[2] = Number((ts >> 24n) & 0xffn);
    bytes[3] = Number((ts >> 16n) & 0xffn);
    bytes[4] = Number((ts >> 8n) & 0xffn);
    bytes[5] = Number(ts & 0xffn);
    for (let i = 0; i < 10; i++) bytes[6 + i] = rand[i];
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  };

  const generate = () => {
    const n = Math.max(1, Math.min(1000, count));
    const list: string[] = [];
    for (let i = 0; i < n; i++) list.push(version === "v4" ? v4() : v7());
    setUuids(list);
  };

  const copy = async () => {
    if (!uuids.length) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    toast({ title: "Copied", description: `${uuids.length} UUIDs copied to clipboard.` });
  };

  return (
    <ToolShell
      title="UUID Generator — v4 & v7 | DocuNova"
      description="Generate cryptographically random UUID v4 or time-ordered UUID v7. Bulk generation up to 1,000 at once. Free, no signup."
      heading="UUID Generator"
      intro="Generate one or many UUIDs (v4 random or v7 time-ordered) directly in your browser."
      guide={`UUIDs (Universally Unique Identifiers) are 128-bit identifiers used for database primary keys, session IDs, distributed system records and more. UUID v4 uses 122 bits of randomness and is the most common choice for ID generation. UUID v7 encodes a millisecond timestamp in the first 48 bits, which makes IDs sortable by creation time — useful for B-tree indexes.\n\nAll generation happens locally using the WebCrypto API. Nothing is sent to a server.`}
      faqs={[
        { q: "Are these UUIDs cryptographically secure?", a: "Yes. We use crypto.getRandomValues / crypto.randomUUID which are cryptographically secure random number generators." },
        { q: "What is the difference between v4 and v7?", a: "v4 is purely random. v7 starts with a Unix millisecond timestamp so generated IDs sort chronologically — great for database performance." },
        { q: "Can I generate UUIDs in bulk?", a: "Yes, up to 1,000 UUIDs per click. Click Copy to copy them all as newline-separated text." },
        { q: "Is my data sent to your server?", a: "No. UUID generation runs entirely in your browser." },
      ]}
      related={DEV_RELATED}
      canonical="/tools/uuid-generator"
    >
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <Label>Version</Label>
          <select className="w-full mt-1 h-10 rounded-md border bg-background px-3" value={version} onChange={e => setVersion(e.target.value as "v4" | "v7")}>
            <option value="v4">v4 (random)</option>
            <option value="v7">v7 (time-ordered)</option>
          </select>
        </div>
        <div>
          <Label htmlFor="count">Count (1–1000)</Label>
          <Input id="count" type="number" min={1} max={1000} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={generate} className="flex-1"><RefreshCw className="h-4 w-4 mr-2" />Generate</Button>
          <Button variant="outline" onClick={copy} disabled={!uuids.length}><Copy className="h-4 w-4" /></Button>
        </div>
      </div>
      <Textarea readOnly value={uuids.join("\n")} placeholder="Generated UUIDs will appear here…" className="font-mono text-sm min-h-[240px]" />
    </ToolShell>
  );
}
