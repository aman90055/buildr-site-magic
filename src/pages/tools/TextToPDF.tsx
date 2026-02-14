import { Type } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const TextToPDF = () => (
  <ToolPageTemplate
    title="Text to PDF"
    description="Convert plain text files to formatted PDF documents with custom styling."
    metaTitle="Text to PDF - Convert TXT to PDF | PDF Tools"
    metaDescription="Convert plain text files to professionally formatted PDFs."
    icon={Type}
    color="from-slate-500 to-slate-600"
    category="Convert to PDF"
    acceptedFormats="TXT, CSV, LOG"
    features={["Custom font selection", "Page margins control", "Header and footer options", "Line spacing adjustment", "Page numbering", "Batch conversion"]}
    howItWorks={["Upload text files", "Choose formatting options", "Preview the layout", "Download PDF"]}
  />
);
export default TextToPDF;
