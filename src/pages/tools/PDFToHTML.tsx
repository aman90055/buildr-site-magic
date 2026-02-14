import { Globe } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PDFToHTML = () => (
  <ToolPageTemplate
    title="PDF to HTML"
    description="Convert PDF documents to clean, responsive HTML pages with preserved formatting."
    metaTitle="PDF to HTML - Convert PDF to Web Pages | PDF Tools"
    metaDescription="Convert PDF to HTML with preserved formatting, images, and links."
    icon={Globe}
    color="from-cyan-500 to-cyan-600"
    isAI
    category="Convert from PDF"
    acceptedFormats="PDF"
    features={["Preserves layout and formatting", "Responsive HTML output", "CSS styling included", "Image extraction and embedding", "Hyperlink preservation", "Clean semantic HTML"]}
    howItWorks={["Upload your PDF document", "AI converts structure to HTML", "Preview the HTML output", "Download HTML files"]}
  />
);
export default PDFToHTML;
