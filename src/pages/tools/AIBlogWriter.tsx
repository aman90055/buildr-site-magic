import { PenLine } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIBlogWriter = () => (
  <AITextTool
    title="AI Blog Writer"
    description="Generate a complete SEO-friendly blog post from a topic or outline."
    metaTitle="AI Blog Writer - Free Article Generator | Document Edit Pro"
    metaDescription="Write SEO-friendly blog posts with AI. Add a topic and get a full structured article."
    icon={PenLine}
    gradient="from-emerald-500 to-teal-600"
    systemPrompt="You are an expert blog writer and SEO copywriter. Given a topic or outline, write a complete, well-structured blog post in Markdown with an engaging H1 title, intro, 3-5 H2 sections, helpful examples, and a conclusion. Use a clear, friendly, expert voice. Optimize naturally for SEO without keyword stuffing. Aim for 600-900 words."
    inputLabel="Topic or outline"
    inputPlaceholder="e.g., How to choose the right PDF editor for small businesses..."
    outputLabel="Blog Post (Markdown)"
    actionLabel="Write Blog Post"
  />
);

export default AIBlogWriter;
