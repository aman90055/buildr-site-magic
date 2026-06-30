import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JSZip from "jszip";
import { Download } from "lucide-react";

interface Item { file: File; newName: string; }

export default function FileRename() {
  const [items, setItems] = useState<Item[]>([]);
  const [pattern, setPattern] = useState("file_{n}");
  const [start, setStart] = useState(1);
  const [pad, setPad] = useState(3);
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (f) => setItems(prev => [...prev, ...f.map(file => ({ file, newName: file.name }))]),
  });

  const applyPattern = () => {
    setItems(items.map((it, i) => {
      const ext = it.file.name.match(/\.[^.]+$/)?.[0] || "";
      const num = String(start + i).padStart(pad, "0");
      const base = pattern.replace("{n}", num).replace("{name}", it.file.name.replace(/\.[^.]+$/, ""));
      return { ...it, newName: base + ext };
    }));
  };

  const applySearch = () => {
    if (!search) return;
    setItems(items.map(it => ({ ...it, newName: it.newName.split(search).join(replace) })));
  };

  const dlZip = async () => {
    const zip = new JSZip();
    items.forEach(it => zip.file(it.newName, it.file));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "renamed.zip"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="File Rename Tool — Batch Rename Files | DocuNova"
      description="Bulk rename multiple files with patterns, numbering and search-replace. Download as ZIP."
      heading="Batch File Rename"
      intro="Add files, apply naming patterns, then download the renamed set as a ZIP."
      canonical="https://docunova-ai.lovable.app/tools/file-rename"
      faqs={[{ q: "What placeholders can I use?", a: "{n} for the sequence number, {name} for the original filename without extension." }]}
      related={[{ name: "File Compressor", href: "/tools/file-compressor" }, { name: "ZIP Extractor", href: "/tools/zip-extractor" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} /><p>Drop files to rename, or click to select</p>
      </div>
      {items.length > 0 && (
        <>
          <div className="grid md:grid-cols-4 gap-3 mb-3">
            <div><Label>Pattern</Label><Input value={pattern} onChange={e => setPattern(e.target.value)} /></div>
            <div><Label>Start</Label><Input type="number" value={start} onChange={e => setStart(+e.target.value)} /></div>
            <div><Label>Pad digits</Label><Input type="number" value={pad} onChange={e => setPad(+e.target.value)} /></div>
            <Button className="self-end" onClick={applyPattern}>Apply pattern</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <div><Label>Find</Label><Input value={search} onChange={e => setSearch(e.target.value)} /></div>
            <div><Label>Replace with</Label><Input value={replace} onChange={e => setReplace(e.target.value)} /></div>
            <Button className="self-end" variant="secondary" onClick={applySearch}>Find &amp; replace</Button>
          </div>
          <div className="max-h-72 overflow-auto border rounded-lg divide-y mb-3">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 text-sm">
                <span className="text-muted-foreground line-through truncate w-40">{it.file.name}</span>
                <span>→</span>
                <Input value={it.newName} onChange={e => { const c = [...items]; c[i].newName = e.target.value; setItems(c); }} className="flex-1" />
              </div>
            ))}
          </div>
          <Button onClick={dlZip}><Download className="h-4 w-4 mr-1" />Download renamed as ZIP</Button>
        </>
      )}
    </ToolShell>
  );
}
