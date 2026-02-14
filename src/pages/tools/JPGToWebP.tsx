import { FileImage } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const JPGToWebP = () => (
  <ToolPageTemplate
    title="JPG to WebP"
    description="Convert JPG to modern WebP format for smaller file sizes and better web performance."
    metaTitle="JPG to WebP - Convert for Web | PDF Tools"
    metaDescription="Convert JPG images to WebP for 30% smaller file sizes."
    icon={FileImage}
    color="from-sky-500 to-sky-600"
    category="Image Tools"
    acceptedFormats="JPG, JPEG"
    features={["30% smaller than JPG", "Superior web performance", "Transparency support", "Batch conversion", "Quality control slider", "Browser-native format"]}
    howItWorks={["Upload JPG images", "Adjust WebP quality", "Preview file size savings", "Download WebP images"]}
  />
);
export default JPGToWebP;
