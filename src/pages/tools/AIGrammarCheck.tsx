import { SpellCheck } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const AIGrammarCheck = () => (
  <ToolPageTemplate
    title="AI Grammar Checker"
    description="AI-powered grammar, spelling, and style correction for your documents."
    metaTitle="AI Grammar Checker - Fix Errors Instantly | PDF Tools"
    metaDescription="Check and fix grammar, spelling, and style in PDF documents with AI."
    icon={SpellCheck}
    color="from-green-500 to-emerald-600"
    isAI
    category="AI Tools"
    acceptedFormats="PDF, DOCX, TXT"
    features={["Grammar and spelling correction", "Style and tone suggestions", "Punctuation fixes", "Readability score", "Multi-language support", "Track changes view"]}
    howItWorks={["Upload your document", "AI analyzes text for errors", "Review suggested corrections", "Apply fixes and download"]}
  />
);
export default AIGrammarCheck;
