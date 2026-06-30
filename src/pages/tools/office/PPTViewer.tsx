import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { Presentation } from "lucide-react";

interface Slide { index: number; texts: string[]; }

export default function PPTViewer() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [name, setName] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"] },
    multiple: false,
    onDrop: async (f) => {
      const file = f[0]; if (!file) return;
      setName(file.name);
      const zip = await JSZip.loadAsync(file);
      const slideFiles = Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
        .sort((a, b) => parseInt(a.match(/slide(\d+)/)![1]) - parseInt(b.match(/slide(\d+)/)![1]));
      const parsed: Slide[] = [];
      for (let i = 0; i < slideFiles.length; i++) {
        const xml = await zip.files[slideFiles[i]].async("string");
        const texts = [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)].map(m => m[1]).filter(Boolean);
        parsed.push({ index: i + 1, texts });
      }
      setSlides(parsed);
    },
  });

  return (
    <ToolShell
      title="PowerPoint Viewer — Open .pptx Online | DocuNova"
      description="Preview Microsoft PowerPoint .pptx files in your browser. View slide content without installing Office."
      heading="PowerPoint Viewer"
      intro="Drop a .pptx file to view text content from every slide."
      canonical="https://docunova-ai.lovable.app/tools/ppt-viewer"
      faqs={[{ q: "Does this render slide visuals?", a: "Text content is extracted reliably; for full visuals, convert to PDF first with our PowerPoint→PDF tool." }]}
      related={[{ name: "PowerPoint to PDF", href: "/powerpoint-to-pdf" }, { name: "PDF to PowerPoint", href: "/pdf-to-powerpoint" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} />
        <Presentation className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>Drop .pptx file here</p>
        {name && <p className="text-sm text-muted-foreground mt-2">{name} · {slides.length} slides</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {slides.map(s => (
          <div key={s.index} className="p-4 rounded-lg border bg-muted/40 aspect-video overflow-auto">
            <div className="text-xs text-muted-foreground mb-2">Slide {s.index}</div>
            {s.texts.map((t, i) => (
              <p key={i} className={i === 0 ? "text-lg font-semibold mb-1" : "text-sm"}>{t}</p>
            ))}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
