import { ScanText } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ImageToText = () => (
  <ToolPageTemplate
    title="Image to Text (OCR)"
    description="Extract text from images with AI-powered OCR. Supports handwriting and 100+ languages."
    metaTitle="Image to Text - AI OCR from Images | PDF Tools"
    metaDescription="Extract text from images using AI OCR with 99.9% accuracy."
    icon={ScanText}
    color="from-violet-500 to-violet-600"
    isAI
    category="AI Tools"
    acceptedFormats="JPG, PNG, WebP, BMP, TIFF"
    features={["99.9% OCR accuracy", "Handwriting recognition", "100+ language support", "Table structure detection", "Copy text instantly", "Batch OCR processing"]}
    howItWorks={["Upload image with text", "AI scans and recognizes text", "Edit and correct if needed", "Copy or download extracted text"]}
  />
);
export default ImageToText;
