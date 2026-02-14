import { FileImage } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const WebPToJPG = () => (
  <ToolPageTemplate
    title="WebP to JPG"
    description="Convert modern WebP images to universally compatible JPG format."
    metaTitle="WebP to JPG - Convert WebP to JPEG | PDF Tools"
    metaDescription="Convert WebP images to JPG for universal compatibility."
    icon={FileImage}
    color="from-teal-500 to-teal-600"
    category="Image Tools"
    acceptedFormats="WebP"
    features={["Universal compatibility", "Adjustable quality settings", "Fast conversion", "Batch processing", "No software required", "Works in browser"]}
    howItWorks={["Upload WebP images", "Select quality settings", "Convert instantly", "Download JPG files"]}
  />
);
export default WebPToJPG;
