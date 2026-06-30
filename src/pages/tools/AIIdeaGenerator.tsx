import { Lightbulb } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIIdeaGenerator = () => (
  <AITextTool
    title="AI Idea Generator"
    description="Get 10 creative, actionable ideas for any topic — business, content, products, names, more."
    metaTitle="AI Idea Generator - Brainstorm Anything | Document Edit Pro"
    metaDescription="Generate 10 creative ideas instantly. Perfect for content, business, products, or names."
    icon={Lightbulb}
    gradient="from-yellow-500 to-amber-600"
    systemPrompt="You are a world-class creative strategist. For the given topic, generate exactly 10 distinct, specific, actionable ideas. Number them 1-10. For each idea give a short title in bold and 1-2 sentences of explanation. Avoid generic suggestions."
    inputLabel="Topic to brainstorm"
    inputPlaceholder="e.g., YouTube channel ideas about personal finance for Gen Z..."
    outputLabel="10 Ideas"
    actionLabel="Generate Ideas"
  />
);

export default AIIdeaGenerator;
