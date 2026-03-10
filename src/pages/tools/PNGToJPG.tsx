import { FileImage } from "lucide-react";
import ImageConverterTool from "@/components/ImageConverterTool";

const PNGToJPG = () => (
  <ImageConverterTool
    title="PNG to JPG"
    description="Convert PNG images to JPG format with adjustable quality."
    metaTitle="PNG to JPG Converter | PDF Tools"
    metaDescription="Convert PNG images to JPG format with adjustable quality settings."
    icon={FileImage}
    gradient="from-green-500 to-emerald-600"
    acceptTypes="image/png"
    outputFormat="JPG"
    outputMime="image/jpeg"
    outputExt="jpg"
    showQuality
  />
);

export default PNGToJPG;
