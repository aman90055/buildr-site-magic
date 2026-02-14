import { FileText } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const SVGToPDF = () => (
  <ToolPageTemplate
    title="SVG to PDF"
    description="Convert SVG vector graphics to high-quality PDF documents."
    metaTitle="SVG to PDF - Vector to PDF Conversion | PDF Tools"
    metaDescription="Convert SVG files to PDF with perfect vector quality preservation."
    icon={FileText}
    color="from-red-500 to-red-600"
    category="Convert to PDF"
    acceptedFormats="SVG"
    features={["Perfect vector preservation", "Multi-page support", "Custom page sizes", "Color space management", "Batch conversion", "Print-ready output"]}
    howItWorks={["Upload SVG files", "Set page size and margins", "Convert to PDF", "Download PDF document"]}
  />
);
export default SVGToPDF;
