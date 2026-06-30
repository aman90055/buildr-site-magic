import { Twitter } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AITweetGenerator = () => (
  <AITextTool
    title="AI Tweet Generator"
    description="Generate 5 punchy tweet variations from any idea — hook, insight, or thread starter."
    metaTitle="AI Tweet Generator - Punchy Tweets in Seconds | Document Edit Pro"
    metaDescription="Generate 5 engaging tweet variations from any topic. Optimized for engagement on X."
    icon={Twitter}
    gradient="from-cyan-500 to-sky-600"
    systemPrompt="You are an expert X (Twitter) writer. From the user's idea, write 5 distinct tweet variations. Each under 280 characters. Use strong hooks, line breaks, and zero hashtag spam (max 1-2 hashtags). Output as a numbered list."
    inputLabel="Idea or topic"
    inputPlaceholder="Why most people fail to stay consistent with side projects..."
    outputLabel="5 Tweet Variations"
    actionLabel="Generate Tweets"
  />
);

export default AITweetGenerator;
