import { Sparkles } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const AIImageEnhance = () => (
  <ToolPageTemplate
    title="AI Image Enhance"
    description="Upscale and enhance image quality with AI. Make blurry images sharp and clear."
    metaTitle="AI Image Enhance - Upscale & Sharpen | PDF Tools"
    metaDescription="Enhance image quality with AI upscaling, denoising, and sharpening."
    icon={Sparkles}
    color="from-fuchsia-500 to-pink-600"
    isAI
    category="AI Tools"
    acceptedFormats="JPG, PNG, WebP"
    features={["AI upscaling up to 4x", "Noise reduction", "Sharpness enhancement", "Color correction", "Face enhancement", "Batch processing"]}
    howItWorks={["Upload your image", "Select enhancement level", "AI processes and enhances", "Download enhanced image"]}
  />
);
export default AIImageEnhance;
