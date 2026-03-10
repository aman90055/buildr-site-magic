import { RefreshCw } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIRewriter = () => (
  <AITextTool
    title="AI Rewriter"
    description="Rewrite text to improve clarity, tone, and readability while preserving meaning."
    metaTitle="AI Text Rewriter | PDF Tools"
    metaDescription="Rewrite and improve your text with AI."
    icon={RefreshCw}
    gradient="from-orange-500 to-red-600"
    systemPrompt="You are a professional text rewriter. Rewrite the given text to be clearer, more engaging, and better structured while preserving the original meaning. Provide the rewritten version only."
    inputLabel="Text to Rewrite"
    inputPlaceholder="Paste the text you want to rewrite..."
    outputLabel="Rewritten Text"
    actionLabel="Rewrite"
  />
);

export default AIRewriter;
