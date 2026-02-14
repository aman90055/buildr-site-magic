import { Languages } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const AITranslator = () => (
  <ToolPageTemplate
    title="AI Document Translator"
    description="Translate entire PDF documents while preserving layout, formatting, and images."
    metaTitle="AI Translator - Translate PDF Documents | PDF Tools"
    metaDescription="Translate PDF documents to 50+ languages while preserving formatting."
    icon={Languages}
    color="from-blue-500 to-cyan-600"
    isAI
    category="AI Tools"
    acceptedFormats="PDF, DOCX, TXT"
    features={["50+ language support", "Layout preservation", "Context-aware translation", "Technical terminology support", "Batch translation", "Side-by-side comparison"]}
    howItWorks={["Upload your document", "Select target language", "AI translates with context", "Download translated document"]}
  />
);
export default AITranslator;
