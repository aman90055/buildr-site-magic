import { Eraser } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const RemoveBackground = () => (
  <ToolPageTemplate
    title="Remove Background"
    description="AI-powered background removal for any image in seconds. Perfect edges, every time."
    metaTitle="Remove Background - AI Background Remover | PDF Tools"
    metaDescription="Remove image backgrounds instantly with AI-powered precision."
    icon={Eraser}
    color="from-rose-500 to-pink-600"
    isAI
    category="AI Tools"
    acceptedFormats="JPG, PNG, WebP"
    features={["AI-powered edge detection", "Perfect hair and fur handling", "Transparent PNG output", "Custom background colors", "Batch processing", "High-resolution support"]}
    howItWorks={["Upload your image", "AI detects and removes background", "Fine-tune edges if needed", "Download transparent PNG"]}
  />
);
export default RemoveBackground;
