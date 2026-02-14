import { RotateCw } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ImageRotate = () => (
  <ToolPageTemplate
    title="Rotate Image"
    description="Rotate and flip images with precision. Fix orientation or create creative effects."
    metaTitle="Rotate Image - Rotate & Flip Photos | PDF Tools"
    metaDescription="Rotate images by any angle and flip horizontally or vertically."
    icon={RotateCw}
    color="from-pink-500 to-pink-600"
    category="Image Tools"
    acceptedFormats="JPG, PNG, WebP, GIF, BMP"
    features={["Rotate 90°, 180°, 270°", "Custom angle rotation", "Flip horizontal/vertical", "Auto-fix EXIF orientation", "Batch rotate support", "No quality loss"]}
    howItWorks={["Upload your images", "Choose rotation angle", "Preview the result", "Download rotated images"]}
  />
);
export default ImageRotate;
