import { FileText } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AICoverLetter = () => (
  <AITextTool
    title="AI Cover Letter Writer"
    description="Generate a professional cover letter tailored to the role and your background."
    metaTitle="AI Cover Letter Writer - Free | Document Edit Pro"
    metaDescription="Write a professional, ATS-friendly cover letter in seconds with AI."
    icon={FileText}
    gradient="from-indigo-500 to-purple-600"
    systemPrompt="You are an expert career coach. Write a concise, professional, ATS-friendly cover letter based on the user's notes. Use a strong opening, 2 body paragraphs about fit and achievements, and a confident close. Keep it under 350 words and use a warm yet professional tone."
    inputLabel="Job role, company, and your relevant experience"
    inputPlaceholder="Role: Frontend Developer at Acme. My experience: 3 years React, shipped X..."
    outputLabel="Cover Letter"
    actionLabel="Write Cover Letter"
  />
);

export default AICoverLetter;
