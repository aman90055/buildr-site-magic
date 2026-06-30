import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { useDropzone } from "react-dropzone";
import mammoth from "mammoth";
import { FileText } from "lucide-react";

export default function WordViewer() {
  const [html, setHtml] = useState("");
  const [name, setName] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    multiple: false,
    onDrop: async (f) => {
      const file = f[0]; if (!file) return;
      setName(file.name);
      const buf = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buf });
      setHtml(result.value);
    },
  });

  return (
    <ToolShell
      title="Word Document Viewer — Open .docx Online | DocuNova"
      description="View Microsoft Word .docx files directly in browser. Preserves formatting, no upload required."
      heading="Word (.docx) Viewer"
      intro="Drop a .docx file to render it as formatted HTML preview."
      canonical="https://docunova-ai.lovable.app/tools/word-viewer"
      faqs={[{ q: "Are images and tables preserved?", a: "Yes — inline images, tables, lists and basic formatting are rendered via Mammoth.js." }]}
      related={[{ name: "Word to PDF", href: "/word-to-pdf" }, { name: "Excel Viewer", href: "/tools/excel-viewer" }]}
    >
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/40 mb-4">
        <input {...getInputProps()} />
        <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>Drop .docx file here</p>
        {name && <p className="text-sm text-muted-foreground mt-2">{name}</p>}
      </div>
      {html && (
        <div className="prose prose-sm dark:prose-invert max-w-none border rounded-lg p-4 bg-background max-h-[600px] overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </ToolShell>
  );
}
