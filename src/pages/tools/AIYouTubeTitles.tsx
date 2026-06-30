import { Youtube } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIYouTubeTitles = () => (
  <AITextTool
    title="AI YouTube Title Generator"
    description="Generate 10 high-CTR YouTube titles optimized for clicks and SEO."
    metaTitle="AI YouTube Title Generator - Boost CTR | Document Edit Pro"
    metaDescription="Generate viral YouTube titles with high CTR. Optimized for search and curiosity."
    icon={Youtube}
    gradient="from-red-500 to-rose-600"
    systemPrompt="You are a YouTube growth expert. For the video topic, generate exactly 10 high-CTR titles. Mix curiosity, numbers, benefit-driven, and SEO-friendly styles. Each title must be under 70 characters. Output as a numbered list only."
    inputLabel="Video topic / description"
    inputPlaceholder="A tutorial on how to compress PDFs without losing quality..."
    outputLabel="10 Title Ideas"
    actionLabel="Generate Titles"
  />
);

export default AIYouTubeTitles;
