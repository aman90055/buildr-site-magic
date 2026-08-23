import { FileImage } from "lucide-react";
import ImageConverterTool from "@/components/ImageConverterTool";

const WebPToPNG = () => (
  <ImageConverterTool
    title="WebP to PNG"
    description="Convert WebP images to lossless PNG with full transparency support — free, unlimited, and processed in your browser."
    metaTitle="WebP to PNG Converter — Free & Lossless | Docunova AI"
    metaDescription="Convert WebP to PNG free online. Lossless output, transparency preserved, no file size limit, and images never leave your browser."
    icon={FileImage}
    gradient="from-emerald-500 to-teal-600"
    acceptTypes="image/webp"
    outputFormat="PNG"
    outputMime="image/png"
    outputExt="png"
  />
);

export default WebPToPNG;
