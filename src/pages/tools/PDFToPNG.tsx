import { Image } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PDFToPNG = () => (
  <ToolPageTemplate
    title="PDF to PNG"
    description="Convert PDF pages to high-quality PNG images with transparent background support."
    metaTitle="PDF to PNG - Convert PDF to PNG Images | PDF Tools"
    metaDescription="Convert PDF to high-resolution PNG images with transparency support."
    icon={Image}
    color="from-green-500 to-green-600"
    isAI
    category="Convert from PDF"
    acceptedFormats="PDF"
    features={["High-resolution PNG output", "Transparent background support", "Custom DPI settings (72-600)", "Batch page conversion", "AI-enhanced image quality", "Lossless compression"]}
    howItWorks={["Upload your PDF file", "Choose resolution and pages", "AI enhances image quality", "Download PNG images"]}
  />
);
export default PDFToPNG;
