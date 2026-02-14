import { Brain } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const AISummarizer = () => (
  <ToolPageTemplate
    title="AI PDF Summarizer"
    description="Get instant AI-powered summaries of any PDF document. Save hours of reading time."
    metaTitle="AI PDF Summarizer - Smart Document Summary | PDF Tools"
    metaDescription="Summarize PDF documents instantly with AI. Get key points in seconds."
    icon={Brain}
    color="from-purple-500 to-indigo-600"
    isAI
    category="AI Tools"
    acceptedFormats="PDF"
    features={["Instant document summaries", "Key points extraction", "Adjustable summary length", "Multi-language support", "Chapter-by-chapter summaries", "Export summary as PDF"]}
    howItWorks={["Upload your PDF document", "AI reads and analyzes content", "Get a concise summary", "Export or copy the summary"]}
  />
);
export default AISummarizer;
