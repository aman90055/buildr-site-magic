import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { Download, FilePlus2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FileCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("archive");
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [size, setSize] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (f) => setFiles(prev => [...prev, ...f]),
  });

  const make = async () => {
    if (!files.length) return;
    setBusy(true);
    const zip = new JSZip();
    for (const f of files) zip.file(f.name, f);
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
    setSize(blob.size);
    if (url) URL.revokeObjectURL(url);
    setUrl(URL.createObjectURL(blob));
    setBusy(false);
  };

  const totalIn = files.reduce((s, f) => s + f.size, 0);

  return (
    <ToolShell
      title="File Compressor — Create ZIP Archive in Browser | DocuNova"
      description="Bundle multiple files into a compressed ZIP archive. 100% client-side, no uploads."
      heading="File Compressor (ZIP)"
      intro="Drop files and download them as a single .zip archive."
      canonical="https://docunova-ai.lovable.app/tools/file-compressor"
      faqs={[{ q: "What compression level is used?", a: "Maximum DEFLATE level 9 — same as 7-Zip 'Maximum'." }]}
      related={[{ name: "ZIP Extractor", href: "/tools/zip-extractor" }, { name: "Checksum Viewer", href: "/tools/checksum-viewer" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} />
        <FilePlus2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>Drop files here or click to select</p>
      </div>
      {files.length > 0 && (
        <>
          <div className="text-sm text-muted-foreground mb-2">{files.length} files · {(totalIn / 1024).toFixed(1)} KB</div>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div><Label>Archive name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="flex items-end gap-2">
              <Button onClick={make} disabled={busy}>{busy ? "Compressing…" : "Create ZIP"}</Button>
              <Button variant="ghost" onClick={() => { setFiles([]); setUrl(null); }}>Clear</Button>
            </div>
          </div>
          {url && (
            <div className="p-4 rounded-lg border bg-muted/40 flex items-center justify-between">
              <div>
                <div className="font-semibold">{name}.zip</div>
                <div className="text-xs text-muted-foreground">{(size / 1024).toFixed(1)} KB · {totalIn > 0 ? Math.round(100 - (size / totalIn) * 100) : 0}% savings</div>
              </div>
              <Button asChild><a href={url} download={`${name}.zip`}><Download className="h-4 w-4 mr-1" />Download</a></Button>
            </div>
          )}
        </>
      )}
    </ToolShell>
  );
}
