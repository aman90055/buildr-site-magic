import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

async function digest(name: string, buf: ArrayBuffer) {
  const h = await crypto.subtle.digest(name, buf);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function ChecksumViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: async (f) => {
      const file = f[0]; if (!file) return;
      setFile(file); setBusy(true); setHashes({});
      const buf = await file.arrayBuffer();
      const [s1, s256, s384, s512] = await Promise.all([
        digest("SHA-1", buf), digest("SHA-256", buf), digest("SHA-384", buf), digest("SHA-512", buf),
      ]);
      setHashes({ "SHA-1": s1, "SHA-256": s256, "SHA-384": s384, "SHA-512": s512 });
      setBusy(false);
    },
  });

  const copy = (v: string) => { navigator.clipboard.writeText(v); toast({ title: "Copied" }); };

  return (
    <ToolShell
      title="Checksum & Metadata Viewer — SHA-256, SHA-512 | DocuNova"
      description="Compute SHA-1, SHA-256, SHA-384, SHA-512 checksums and view file metadata. 100% private — file never uploaded."
      heading="Checksum & Metadata Viewer"
      intro="Verify file integrity with multiple hash algorithms — all in your browser."
      canonical="https://docunova-ai.lovable.app/tools/checksum-viewer"
      faqs={[
        { q: "Why use SHA-256 vs MD5?", a: "MD5 is broken for security. SHA-256 (and higher) are cryptographically secure and standard for downloads, signatures and blockchain." },
      ]}
      related={[{ name: "Hash Generator", href: "/tools/hash-generator" }, { name: "PDF Metadata", href: "/pdf-metadata" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} /><p>Drop a file to compute its checksums</p>
      </div>
      {file && (
        <>
          <div className="grid md:grid-cols-3 gap-3 mb-4 text-sm">
            <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Name</div><div className="font-mono break-all">{file.name}</div></div>
            <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Size</div><div>{file.size.toLocaleString()} bytes</div></div>
            <div className="p-3 rounded-lg border bg-muted/40"><div className="text-xs text-muted-foreground">Type</div><div>{file.type || "—"}</div></div>
            <div className="p-3 rounded-lg border bg-muted/40 md:col-span-3"><div className="text-xs text-muted-foreground">Last modified</div><div>{new Date(file.lastModified).toString()}</div></div>
          </div>
          {busy && <div className="text-muted-foreground">Computing checksums…</div>}
          <div className="space-y-2">
            {Object.entries(hashes).map(([k, v]) => (
              <div key={k} className="p-3 rounded-lg border bg-muted/40">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs font-semibold">{k}</div>
                  <Button size="icon" variant="ghost" onClick={() => copy(v)}><Copy className="h-3 w-3" /></Button>
                </div>
                <div className="font-mono text-xs break-all">{v}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </ToolShell>
  );
}
