import { Code2 } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AICodeExplainer = () => (
  <AITextTool
    title="AI Code Explainer"
    description="Paste any code snippet and get a clear, line-by-line explanation."
    metaTitle="AI Code Explainer - Understand Any Code | Document Edit Pro"
    metaDescription="Explain code in plain English. Supports JavaScript, Python, TypeScript, SQL, and more."
    icon={Code2}
    gradient="from-amber-500 to-orange-600"
    systemPrompt="You are an expert software engineer and teacher. Explain the given code clearly: 1) one-sentence summary of what it does, 2) a step-by-step breakdown of the important parts, 3) any bugs, edge cases, or improvements. Use plain English with short code references. Format in Markdown."
    inputLabel="Paste your code"
    inputPlaceholder="function fib(n) { return n < 2 ? n : fib(n-1) + fib(n-2); }"
    outputLabel="Explanation"
    actionLabel="Explain Code"
  />
);

export default AICodeExplainer;
