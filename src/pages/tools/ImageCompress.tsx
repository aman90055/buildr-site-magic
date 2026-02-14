import { Minimize2 } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ImageCompress = () => (
  <ToolPageTemplate
    title="Compress Image"
    description="Reduce image file size up to 80% while maintaining visual quality with AI compression."
    metaTitle="Compress Image - Reduce Image Size | PDF Tools"
    metaDescription="Compress JPG, PNG, WebP images up to 80% without quality loss using AI."
    icon={Minimize2}
    color="from-green-500 to-emerald-600"
    isAI
    category="Image Tools"
    acceptedFormats="JPG, PNG, WebP, GIF, BMP"
    features={["AI-powered smart compression", "Up to 80% file size reduction", "No visible quality loss", "Batch compress multiple images", "Supports all major formats", "Custom quality settings"]}
    howItWorks={["Upload your images", "AI determines optimal compression", "Preview compressed results", "Download optimized images"]}
  />
);
export default ImageCompress;
