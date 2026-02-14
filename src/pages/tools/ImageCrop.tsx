import { Crop } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ImageCrop = () => (
  <ToolPageTemplate
    title="Crop Image"
    description="Crop images with precision using custom or preset aspect ratios."
    metaTitle="Crop Image - Trim and Crop Photos | PDF Tools"
    metaDescription="Crop images with custom dimensions and preset aspect ratios."
    icon={Crop}
    color="from-orange-500 to-orange-600"
    category="Image Tools"
    acceptedFormats="JPG, PNG, WebP, GIF, BMP"
    features={["Freeform cropping", "Preset aspect ratios (1:1, 16:9, 4:3)", "Pixel-precise selection", "Social media presets", "Batch crop support", "Undo/redo support"]}
    howItWorks={["Upload your image", "Select crop area visually", "Adjust and fine-tune", "Download cropped image"]}
  />
);
export default ImageCrop;
