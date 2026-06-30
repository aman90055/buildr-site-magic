import { FileBadge2 } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIResumeAnalyzer = () => (
  <AITextTool
    title="AI Resume Analyzer"
    description="Paste your resume to get a detailed analysis, ATS score, and improvement suggestions."
    metaTitle="AI Resume Analyzer - Free ATS Check | Document Edit Pro"
    metaDescription="Analyze your resume with AI. Get an ATS score, strengths, weaknesses, and rewrite suggestions."
    icon={FileBadge2}
    gradient="from-violet-500 to-indigo-600"
    systemPrompt="You are an expert resume reviewer and career coach. Analyze the resume and return: 1) **ATS Score (0-100)** with brief reasoning, 2) **Top 3 Strengths**, 3) **Top 5 Weaknesses / Risks**, 4) **Rewrite Suggestions** (bullet-level), 5) **Missing Keywords** to add. Use Markdown."
    inputLabel="Paste your resume text"
    inputPlaceholder="John Doe\nFrontend Developer\nExperience: ..."
    outputLabel="Resume Analysis"
    actionLabel="Analyze Resume"
  />
);

export default AIResumeAnalyzer;
