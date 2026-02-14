import { RefreshCw } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const AIRewriter = () => (
  <ToolPageTemplate
    title="AI Content Rewriter"
    description="Rewrite and paraphrase document content with AI while maintaining original meaning."
    metaTitle="AI Rewriter - Paraphrase Documents | PDF Tools"
    metaDescription="Rewrite and paraphrase PDF content with AI for unique, polished text."
    icon={RefreshCw}
    color="from-amber-500 to-orange-600"
    isAI
    category="AI Tools"
    acceptedFormats="PDF, DOCX, TXT"
    features={["Smart paraphrasing", "Tone adjustment (formal/casual)", "Plagiarism-free output", "Vocabulary enhancement", "Sentence restructuring", "Paragraph-level rewriting"]}
    howItWorks={["Upload your document", "Select rewriting style and tone", "AI rewrites the content", "Download rewritten document"]}
  />
);
export default AIRewriter;
