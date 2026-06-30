import { Hash } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIHashtagGenerator = () => (
  <AITextTool
    title="AI Hashtag Generator"
    description="Generate the best mix of trending, niche, and branded hashtags for any post."
    metaTitle="AI Hashtag Generator - Instagram, TikTok, X | Document Edit Pro"
    metaDescription="Generate optimized hashtags for Instagram, TikTok, X (Twitter), LinkedIn, and YouTube."
    icon={Hash}
    gradient="from-fuchsia-500 to-pink-600"
    systemPrompt="You are a social media growth expert. For the user's post topic, generate 30 hashtags as a clean space-separated list. Mix: 10 broad/popular, 15 niche/medium-reach, and 5 specific/long-tail. Avoid banned or spammy tags. Output only the hashtags, no explanations."
    inputLabel="Post topic / caption"
    inputPlaceholder="A reel about morning productivity routine for entrepreneurs..."
    outputLabel="Hashtags"
    actionLabel="Generate Hashtags"
  />
);

export default AIHashtagGenerator;
