import { FileImage } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PNGToJPG = () => (
  <ToolPageTemplate
    title="PNG to JPG"
    description="Convert PNG images to JPG format with adjustable quality settings."
    metaTitle="PNG to JPG - Convert PNG to JPEG | PDF Tools"
    metaDescription="Convert PNG images to JPG format quickly with quality control."
    icon={FileImage}
    color="from-yellow-500 to-yellow-600"
    category="Image Tools"
    acceptedFormats="PNG"
    features={["Fast format conversion", "Adjustable JPEG quality (1-100)", "Smaller file sizes", "Background color selection", "Batch conversion", "EXIF data preservation"]}
    howItWorks={["Upload PNG images", "Set JPG quality level", "Preview the output", "Download JPG images"]}
  />
);
export default PNGToJPG;
