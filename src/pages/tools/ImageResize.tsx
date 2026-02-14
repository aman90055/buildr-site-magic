import { Maximize } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ImageResize = () => (
  <ToolPageTemplate
    title="Resize Image"
    description="Resize images to exact dimensions or percentages while preserving quality."
    metaTitle="Resize Image - Change Image Dimensions | PDF Tools"
    metaDescription="Resize images to any dimension with quality preservation."
    icon={Maximize}
    color="from-blue-500 to-blue-600"
    category="Image Tools"
    acceptedFormats="JPG, PNG, WebP, GIF, BMP"
    features={["Custom width and height", "Resize by percentage", "Maintain aspect ratio", "Preset social media sizes", "Batch resize support", "High-quality resampling"]}
    howItWorks={["Upload your images", "Set target dimensions", "Preview resized output", "Download resized images"]}
  />
);
export default ImageResize;
