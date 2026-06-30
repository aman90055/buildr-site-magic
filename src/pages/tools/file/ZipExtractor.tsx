import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { Download, FileArchive } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Entry { name: string; size: number; dir: boolean; blob?: Blob; }

export default function ZipExtractor() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [zipName, setZipName] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/zip": [".zip"], "application/x-zip-compressed": [".zip"] },
    multiple: false,
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;
      setZipName(file.name);
      try {
        const zip = await JSZip.loadAsync(file);
        const list: Entry[] = [];
        for (const [name, entry] of Object.entries(zip.files)) {
          if (entry.dir) { list.push({ name, size: 0, dir: true }); continue; }
          const blob = await entry.async("blob");
          list.push({ name, size: blob.size, dir: false, blob });
        }
        setEntries(list);
        toast({ title: "Extracted", description: `${list.filter(e => !e.dir).length} files` });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    },
  });

  const dl = (e: Entry) => {
    if (!e.blob) return;
    const url = URL.createObjectURL(e.blob);
    const a = document.createElement("a");
    a.href = url; a.download = e.name.split("/").pop() || "file";
    a.click(); URL.revokeObjectURL(url);
  };

  const dlAll = async () => {
    for (const e of entries.filter(x => !x.dir)) dl(e);
  };

  return (
    <ToolShell
      title="ZIP Extractor — Unzip Files in Browser | DocuNova"
      description="Extract ZIP archives in your browser. 100% private — files never leave your device."
      heading="ZIP Extractor"
      intro="Drop a .zip file to preview and download every file inside."
      canonical="https://docunova-ai.lovable.app/tools/zip-extractor"
      faqs={[{ q: "Is my zip uploaded anywhere?", a: "No. Extraction happens entirely in your browser using JSZip." }]}
      related={[{ name: "File Compressor", href: "/tools/file-compressor" }, { name: "File Rename", href: "/tools/file-rename" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} />
        <FileArchive className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>Drop a .zip file here, or click to select</p>
        {zipName && <p className="text-sm text-muted-foreground mt-2">{zipName}</p>}
      </div>
      {entries.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">{entries.filter(e => !e.dir).length} files</div>
            <Button size="sm" onClick={dlAll}><Download className="h-4 w-4 mr-1" />Download all</Button>
          </div>
          <div className="max-h-96 overflow-auto border rounded-lg divide-y">
            {entries.filter(e => !e.dir).map((e, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="truncate flex-1 mr-2 font-mono">{e.name}</span>
                <span className="text-muted-foreground text-xs mr-2">{(e.size / 1024).toFixed(1)} KB</span>
                <Button size="sm" variant="ghost" onClick={() => dl(e)}><Download className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
        </>
      )}
    </ToolShell>
  );
}
