import { FileCode } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const MarkdownToPDF = () => (
  <ToolPageTemplate
    title="Markdown to PDF"
    description="Convert Markdown files to beautifully formatted PDF documents."
    metaTitle="Markdown to PDF - Convert MD to PDF | PDF Tools"
    metaDescription="Convert Markdown documents to professionally formatted PDFs."
    icon={FileCode}
    color="from-gray-600 to-gray-700"
    category="Convert to PDF"
    acceptedFormats="MD, Markdown"
    features={["Syntax highlighting for code blocks", "Table support", "Image embedding", "Custom CSS themes", "Table of contents generation", "Math formula rendering"]}
    howItWorks={["Upload or paste Markdown", "Choose a formatting theme", "Preview PDF output", "Download PDF document"]}
  />
);
export default MarkdownToPDF;
