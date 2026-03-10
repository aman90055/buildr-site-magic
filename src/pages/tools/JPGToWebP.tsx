import { FileImage } from "lucide-react";
import ImageConverterTool from "@/components/ImageConverterTool";

const JPGToWebP = () => (
  <ImageConverterTool
    title="JPG to WebP"
    description="Convert JPG to modern WebP format for smaller file sizes and better web performance."
    metaTitle="JPG to WebP Converter | PDF Tools"
    metaDescription="Convert JPG to WebP format for better compression."
    icon={FileImage}
    gradient="from-purple-500 to-pink-600"
    acceptTypes="image/jpeg"
    outputFormat="WebP"
    outputMime="image/webp"
    outputExt="webp"
    showQuality
  />
);

export default JPGToWebP;
