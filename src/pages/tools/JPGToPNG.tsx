import { FileImage } from "lucide-react";
import ImageConverterTool from "@/components/ImageConverterTool";

const JPGToPNG = () => (
  <ImageConverterTool
    title="JPG to PNG"
    description="Convert JPG images to PNG format with lossless quality and transparency support."
    metaTitle="JPG to PNG Converter | PDF Tools"
    metaDescription="Convert JPG images to PNG format with lossless quality."
    icon={FileImage}
    gradient="from-blue-500 to-indigo-600"
    acceptTypes="image/jpeg"
    outputFormat="PNG"
    outputMime="image/png"
    outputExt="png"
  />
);

export default JPGToPNG;
