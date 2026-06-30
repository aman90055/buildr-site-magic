import {
  MessageSquare, ScanText, Languages, FileUser, FileSearch, Mail, FileCheck2,
  Receipt, FileSignature, NotebookPen, BookOpen, PenLine, Inbox, SpellCheck, Wand2,
} from "lucide-react";

export type AITool = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  gradient: string;
  placeholder: string;
  extraLabel?: string;
  extraPlaceholder?: string;
  cta: string;
};

export const AI_TOOLS: AITool[] = [
  { slug: "document-chat", name: "AI Document Chat", tagline: "Chat with any document", description: "Paste document content and ask any question — get cited answers instantly.", icon: MessageSquare, gradient: "from-blue-500 to-indigo-600", placeholder: "Paste document text here…", extraLabel: "Your question", extraPlaceholder: "What does section 4 say about cancellation?", cta: "Ask" },
  { slug: "ocr-clean", name: "AI OCR", tagline: "Clean & structure scanned text", description: "Fix OCR artifacts, restore paragraphs and tables from messy scans.", icon: ScanText, gradient: "from-cyan-500 to-blue-600", placeholder: "Paste raw OCR text…", cta: "Clean it up" },
  { slug: "translate", name: "AI Translation", tagline: "Translate anything", description: "Professional translation that preserves tone, formatting and meaning.", icon: Languages, gradient: "from-emerald-500 to-teal-600", placeholder: "Text to translate…", extraLabel: "Target language", extraPlaceholder: "Spanish, Hindi, French…", cta: "Translate" },
  { slug: "resume-builder", name: "AI Resume Builder", tagline: "ATS-friendly resume", description: "Generate a polished, achievement-focused resume from your background.", icon: FileUser, gradient: "from-indigo-500 to-purple-600", placeholder: "Paste your background, skills, experience…", extraLabel: "Target role", extraPlaceholder: "Senior Frontend Engineer", cta: "Generate Resume" },
  { slug: "resume-analyzer", name: "AI Resume Analyzer", tagline: "Score & improve resumes", description: "Recruiter-grade scoring with strengths, weaknesses, and missing keywords.", icon: FileSearch, gradient: "from-purple-500 to-fuchsia-600", placeholder: "Paste your resume text…", extraLabel: "Job description (optional)", extraPlaceholder: "Paste JD for tailored scoring", cta: "Analyze" },
  { slug: "cover-letter", name: "AI Cover Letter", tagline: "Tailored in seconds", description: "Confident, role-specific cover letters generated from your resume + JD.", icon: Mail, gradient: "from-pink-500 to-rose-600", placeholder: "Your resume summary / background…", extraLabel: "Job description", extraPlaceholder: "Paste the JD here", cta: "Write Letter" },
  { slug: "contract-review", name: "AI Contract Review", tagline: "Spot risky clauses", description: "Lawyer-style review with risk table and suggested redlines.", icon: FileCheck2, gradient: "from-amber-500 to-orange-600", placeholder: "Paste contract text…", cta: "Review Contract" },
  { slug: "invoice-generator", name: "AI Invoice Generator", tagline: "Professional invoices", description: "Generate clean invoices with line items, tax and totals from a description.", icon: Receipt, gradient: "from-green-500 to-emerald-600", placeholder: "Client: Acme Co. Items: 40h dev @ $80, design $500…", cta: "Generate Invoice" },
  { slug: "proposal-generator", name: "AI Proposal Generator", tagline: "Win more clients", description: "Polished proposals with scope, deliverables, timeline and pricing.", icon: FileSignature, gradient: "from-blue-500 to-cyan-600", placeholder: "Describe the project, client, scope, budget…", cta: "Generate Proposal" },
  { slug: "meeting-notes", name: "AI Meeting Notes", tagline: "From transcript to action items", description: "Summary, decisions and owner-tagged action items from any transcript.", icon: NotebookPen, gradient: "from-violet-500 to-purple-600", placeholder: "Paste meeting transcript or rough notes…", cta: "Summarize" },
  { slug: "research-assistant", name: "AI Research Assistant", tagline: "Structured research", description: "Get an organized analysis with findings, sources and next questions.", icon: BookOpen, gradient: "from-teal-500 to-cyan-600", placeholder: "Topic to research, e.g. 'state of SaaS pricing 2026'", cta: "Research" },
  { slug: "writing-assistant", name: "AI Writing Assistant", tagline: "Improve any text", description: "Clarity, flow and impact upgrades with a diff of what changed.", icon: PenLine, gradient: "from-fuchsia-500 to-pink-600", placeholder: "Paste the text you want to improve…", extraLabel: "Tone", extraPlaceholder: "Professional, Friendly, Persuasive…", cta: "Improve" },
  { slug: "email-writer", name: "AI Email Writer", tagline: "Perfect every email", description: "Concise, on-brand emails with a clear subject and call to action.", icon: Inbox, gradient: "from-sky-500 to-blue-600", placeholder: "What do you want to say? To whom?", extraLabel: "Tone", extraPlaceholder: "Formal, Friendly, Apologetic…", cta: "Write Email" },
  { slug: "grammar-checker", name: "AI Grammar Checker", tagline: "Flawless writing", description: "Grammar, clarity and tone fixes with a clean diff.", icon: SpellCheck, gradient: "from-lime-500 to-emerald-600", placeholder: "Paste text to check…", cta: "Check" },
  { slug: "prompt-generator", name: "AI Prompt Generator", tagline: "Better prompts, better outputs", description: "Generate a high-quality structured prompt for any task.", icon: Wand2, gradient: "from-orange-500 to-pink-600", placeholder: "What should the AI do? e.g. 'review a marketing landing page'", cta: "Generate Prompt" },
];

export const getAITool = (slug: string) => AI_TOOLS.find((t) => t.slug === slug);
