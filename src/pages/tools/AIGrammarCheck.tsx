import { SpellCheck } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIGrammarCheck = () => (
  <AITextTool
    title="AI Grammar Check"
    description="Fix grammar, spelling, and punctuation errors with AI precision."
    metaTitle="AI Grammar Checker | PDF Tools"
    metaDescription="Fix grammar and spelling errors instantly with AI."
    icon={SpellCheck}
    gradient="from-green-500 to-emerald-600"
    systemPrompt="You are a professional grammar checker. Correct all grammar, spelling, and punctuation errors. First show the corrected text, then list the changes you made with explanations."
    inputLabel="Text to Check"
    inputPlaceholder="Paste your text here to check for grammar errors..."
    outputLabel="Corrected Text"
    actionLabel="Check Grammar"
  />
);

export default AIGrammarCheck;
