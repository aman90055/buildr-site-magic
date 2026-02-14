import { FileText } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PDFToText = () => (
  <ToolPageTemplate
    title="PDF to Text"
    description="Extract plain text from any PDF document instantly with AI-powered accuracy."
    metaTitle="PDF to Text - Extract Text from PDF | PDF Tools"
    metaDescription="Extract text from PDF files quickly and accurately using AI-powered OCR technology."
    icon={FileText}
    color="from-blue-500 to-blue-600"
    isAI
    category="Convert from PDF"
    acceptedFormats="PDF"
    features={["AI-powered text extraction", "Preserves text formatting and structure", "Batch processing support", "Handles scanned PDFs with OCR", "Multi-language support", "Export as TXT or DOCX"]}
    howItWorks={["Upload your PDF file", "AI analyzes and extracts all text content", "Review and edit extracted text", "Download as plain text file"]}
  />
);
export default PDFToText;
