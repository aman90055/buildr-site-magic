import { FileImage } from "lucide-react";
import ImageConverterTool from "@/components/ImageConverterTool";

const WebPToJPG = () => (
  <ImageConverterTool
    title="WebP to JPG"
    description="Convert modern WebP images to universally compatible JPG format."
    metaTitle="WebP to JPG Converter | PDF Tools"
    metaDescription="Convert WebP images to JPG format."
    icon={FileImage}
    gradient="from-orange-500 to-red-600"
    acceptTypes="image/webp"
    outputFormat="JPG"
    outputMime="image/jpeg"
    outputExt="jpg"
    showQuality
  />
);

export default WebPToJPG;
