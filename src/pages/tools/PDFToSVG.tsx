import { PenTool } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PDFToSVG = () => (
  <ToolPageTemplate
    title="PDF to SVG"
    description="Convert PDF pages to scalable vector graphics for unlimited resolution."
    metaTitle="PDF to SVG - Vector Conversion | PDF Tools"
    metaDescription="Convert PDF to SVG vector format for infinite scalability."
    icon={PenTool}
    color="from-orange-500 to-red-600"
    category="Convert from PDF"
    acceptedFormats="PDF"
    features={["Infinite scalability", "Editable vector output", "Color preservation", "Text to paths conversion", "Works with any design tool", "Batch conversion"]}
    howItWorks={["Upload your PDF", "Select pages to convert", "Process vector conversion", "Download SVG files"]}
  />
);
export default PDFToSVG;
