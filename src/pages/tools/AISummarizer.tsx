import { Brain } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AISummarizer = () => (
  <AITextTool
    title="AI PDF Summarizer"
    description="Get instant AI-powered summaries of any text. Save hours of reading time."
    metaTitle="AI Summarizer - Summarize Text Instantly | PDF Tools"
    metaDescription="Get instant AI summaries of any text or document."
    icon={Brain}
    gradient="from-violet-500 to-purple-600"
    systemPrompt="You are a professional text summarizer. Provide clear, concise summaries that capture the key points. Use bullet points for clarity."
    inputLabel="Text to Summarize"
    inputPlaceholder="Paste the text you want to summarize..."
    outputLabel="Summary"
    actionLabel="Summarize"
  />
);

export default AISummarizer;
