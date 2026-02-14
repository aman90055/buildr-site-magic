import { Mail } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const LetterWriter = () => (
  <ToolPageTemplate
    title="AI Letter Writer"
    description="Generate professional business letters, cover letters, and formal correspondence with AI."
    metaTitle="AI Letter Writer - Generate Professional Letters | PDF Tools"
    metaDescription="Write professional letters with AI assistance. Business, cover, and formal letters."
    icon={Mail}
    color="from-indigo-500 to-blue-600"
    isAI
    category="Document Tools"
    acceptedFormats="N/A - Create from scratch"
    features={["Multiple letter types", "AI tone adjustment", "Professional formatting", "Letterhead support", "Multi-language support", "Export as PDF/DOCX"]}
    howItWorks={["Select letter type", "Provide key details", "AI generates the letter", "Review, edit, and download"]}
  />
);
export default LetterWriter;
