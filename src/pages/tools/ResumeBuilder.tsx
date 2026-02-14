import { FileUser } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ResumeBuilder = () => (
  <ToolPageTemplate
    title="AI Resume Builder"
    description="Create professional ATS-friendly resumes in minutes with AI assistance."
    metaTitle="AI Resume Builder - Create Professional Resumes | PDF Tools"
    metaDescription="Build ATS-optimized resumes with AI. Professional templates and smart content."
    icon={FileUser}
    color="from-blue-500 to-indigo-600"
    isAI
    category="Document Tools"
    acceptedFormats="PDF, DOCX"
    features={["20+ professional templates", "ATS-friendly formatting", "AI content suggestions", "One-click PDF export", "Skills and keyword optimization", "Multiple format support"]}
    howItWorks={["Choose a template", "Fill in your details", "AI optimizes content", "Download PDF resume"]}
  />
);
export default ResumeBuilder;
