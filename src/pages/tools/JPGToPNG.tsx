import { FileImage } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const JPGToPNG = () => (
  <ToolPageTemplate
    title="JPG to PNG"
    description="Convert JPG images to PNG format with lossless quality and transparency support."
    metaTitle="JPG to PNG - Convert JPEG to PNG | PDF Tools"
    metaDescription="Convert JPG to PNG with transparency support and lossless quality."
    icon={FileImage}
    color="from-purple-500 to-purple-600"
    category="Image Tools"
    acceptedFormats="JPG, JPEG"
    features={["Lossless conversion", "Transparency support", "Higher quality output", "Batch conversion", "No compression artifacts", "Full color depth"]}
    howItWorks={["Upload JPG images", "Choose output settings", "Process conversion", "Download PNG images"]}
  />
);
export default JPGToPNG;
