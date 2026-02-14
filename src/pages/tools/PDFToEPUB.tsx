import { BookOpen } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PDFToEPUB = () => (
  <ToolPageTemplate
    title="PDF to eBook"
    description="Convert PDF documents to EPUB format for reading on any e-reader device."
    metaTitle="PDF to eBook (EPUB) - Convert for E-Readers | PDF Tools"
    metaDescription="Convert PDF to EPUB eBook format for Kindle, iPad, and other e-readers."
    icon={BookOpen}
    color="from-emerald-500 to-emerald-600"
    isAI
    category="Convert from PDF"
    acceptedFormats="PDF"
    features={["AI-powered layout conversion", "Reflowable text for any screen", "Chapter detection", "Image optimization for e-readers", "Table of contents generation", "Compatible with all e-readers"]}
    howItWorks={["Upload your PDF", "AI analyzes document structure", "Chapters and formatting are converted", "Download EPUB file"]}
  />
);
export default PDFToEPUB;
