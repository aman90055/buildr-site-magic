import { Contrast } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const GrayscalePDF = () => (
  <ToolPageTemplate
    title="Grayscale PDF"
    description="Convert colorful PDFs to grayscale for printing savings and professional appearance."
    metaTitle="Grayscale PDF - Convert to Black & White | PDF Tools"
    metaDescription="Convert color PDFs to grayscale to save on printing costs."
    icon={Contrast}
    color="from-gray-500 to-gray-600"
    category="Edit PDF"
    acceptedFormats="PDF"
    features={["Full color to grayscale conversion", "Save up to 60% on printing", "Preserve text sharpness", "Adjustable contrast levels", "Batch processing", "Professional document output"]}
    howItWorks={["Upload your color PDF", "Adjust contrast settings", "Preview grayscale output", "Download converted PDF"]}
  />
);
export default GrayscalePDF;
