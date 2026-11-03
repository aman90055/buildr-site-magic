import { getRichContent } from "@/lib/richToolContent";
import { toolPrivacy } from "@/lib/toolInstructions";
/**
 * Tool registry: powers ToolSEOSection (FAQ + usage guide + JSON-LD)
 * and the /category/:slug landing pages. One source of truth.
 */

export interface ToolFAQ { q: string; a: string }

export interface ToolMeta {
  slug: string;            // route, e.g. "/merge"
  name: string;            // "Merge PDF"
  category: ToolCategory;
  short: string;           // one-liner
  guide: string;           // 200+ word usage guide (markdown-light, \n\n paragraphs)
  faqs: ToolFAQ[];         // 4-6 FAQs
}

export type ToolCategory = "organize" | "convert" | "edit" | "ai" | "image" | "security" | "documents";

export const CATEGORY_META: Record<ToolCategory, {
  title: string;
  tagline: string;
  description: string;
  hero: string;
  intro: string;
  cta: string;
}> = {
  organize: {
    title: "Organize PDF Tools",
    tagline: "Merge, split, reorder & extract pages — all free",
    description: "Free online tools to organize, merge, split, rotate, extract and reorder PDF pages. Process files of any size right in your browser. No watermarks, no signup.",
    hero: "Organize PDFs the easy way",
    intro: "Whether you're combining a 5-page contract with its appendix, pulling chapter 3 out of an ebook, or stripping blank pages out of a scan, our organize-PDF tools do it in seconds — processed in your browser. Signed-in Merge, Split and Compress results are also saved to private account storage. Device memory affects large jobs.",
    cta: "Start organizing — pick a tool below",
  },
  convert: {
    title: "Convert PDF Tools",
    tagline: "PDF ↔ Word, Excel, PPT, Image, HTML, EPUB — free",
    description: "Convert PDF to Word, Excel, PowerPoint, JPG, PNG, HTML, EPUB and back. Format-specific results with no watermark. Review each converter’s limitations.",
    hero: "Convert PDFs to any format",
    intro: "Move text and page images between formats. Some exports retain only text or use image-based pages; check the individual converter before relying on its output.",
    cta: "Choose a converter to get started",
  },
  edit: {
    title: "Edit & Sign PDF Tools",
    tagline: "Sign, watermark, redact, crop, number — instantly",
    description: "Edit PDFs online: add e-signatures, watermarks, page numbers, redact sensitive text, crop margins or change metadata. Free, unlimited and private.",
    hero: "Edit & sign PDFs in seconds",
    intro: "Sign a contract, add a confidentiality watermark, redact a name from a deposition, or crop the margins of a scan. Review the output and the file-processing disclosure before sharing confidential documents.",
    cta: "Pick an editor below",
  },
  ai: {
    title: "AI PDF & Text Tools",
    tagline: "Summarize, translate, OCR, rewrite, extract — with AI",
    description: "AI-powered tools to summarize, translate, grammar-check, rewrite and extract data from PDFs and text. Powered by frontier models, free for everyone.",
    hero: "AI tools for documents and text",
    intro: "Summarise text, translate, correct grammar and recognise scanned text. AI features send submitted content to an AI service; request limits and sign-in may apply. Review every response.",
    cta: "Try an AI tool below",
  },
  image: {
    title: "Image Tools",
    tagline: "Compress, resize, crop, convert, remove background",
    description: "Free image tools: compress, resize, crop, rotate, remove background, and convert between JPG, PNG and WebP. Unlimited size, no signup.",
    hero: "Image tools, free and unlimited",
    intro: "Optimize images for the web, prepare batch uploads, swap formats, or strip the background for a logo — using browser image tools. Background removal handles white or very light pixels rather than arbitrary backgrounds.",
    cta: "Pick an image tool",
  },
  security: {
    title: "PDF Security Tools",
    tagline: "Protect, unlock, sign and redact — privately",
    description: "Add or remove PDF passwords, e-sign documents, and redact sensitive text. These password operations run locally; unlocking requires the correct password.",
    hero: "Secure your PDFs",
    intro: "Add a password before emailing a contract, unlock a PDF you are authorised to use with its known password, redact a Social Security number, or e-sign with a typed or drawn signature.",
    cta: "Choose a security tool",
  },
  documents: {
    title: "Document Builders",
    tagline: "Resumes, invoices, certificates, letters — instant PDF",
    description: "Build professional PDFs in minutes: resumes, invoices, certificates and formal letters. Free, customizable templates with instant PDF export.",
    hero: "Document builders that ship to PDF",
    intro: "Fill in the builder’s fields and export a PDF. Check the names, dates and amounts; invoice generation does not calculate tax or add logos.",
    cta: "Pick a builder",
  },
};

// Catalogue identities; displayed copy is resolved through reviewed guides.
export const TOOL_REGISTRY: Record<string, ToolMeta> = Object.fromEntries([
  { slug: "/merge", name: "Merge PDF", category: "organize" as ToolCategory, short: "Merge PDF", guide: "", faqs: [] },
  { slug: "/split", name: "Split PDF", category: "organize" as ToolCategory, short: "Split PDF", guide: "", faqs: [] },
  { slug: "/compress", name: "Compress PDF", category: "organize" as ToolCategory, short: "Compress PDF", guide: "", faqs: [] },
  { slug: "/convert", name: "Convert PDF", category: "convert" as ToolCategory, short: "Convert PDF", guide: "", faqs: [] },
  { slug: "/ocr", name: "OCR PDF", category: "ai" as ToolCategory, short: "OCR PDF", guide: "", faqs: [] },
  { slug: "/pdf-to-word", name: "PDF to Word", category: "convert" as ToolCategory, short: "PDF to Word", guide: "", faqs: [] },
  { slug: "/word-to-pdf", name: "Word to PDF", category: "convert" as ToolCategory, short: "Word to PDF", guide: "", faqs: [] },
  { slug: "/ai-summarizer", name: "AI PDF Summarizer", category: "ai" as ToolCategory, short: "AI PDF Summarizer", guide: "", faqs: [] },
  { slug: "/ai-translator", name: "AI Translator", category: "ai" as ToolCategory, short: "AI Translator", guide: "", faqs: [] },
  { slug: "/pdf-filler", name: "PDF Filler", category: "edit" as ToolCategory, short: "PDF Filler", guide: "", faqs: [] },
].map(tool => [tool.slug, tool]));

// ---------- Fallback generator for tools not in the registry ----------

const NAME_MAP: Record<string, string> = {
  "/edit-pdf": "Edit PDF", "/protect-pdf": "Protect PDF", "/image-to-pdf": "Image to PDF",
  "/pdf-to-image": "PDF to Image", "/remove-pages": "Remove Pages from PDF",
  "/extract-pages": "Extract PDF Pages", "/organize-pdf": "Organize PDF", "/scan-to-pdf": "Scan to PDF",
  "/reverse-pdf": "Reverse PDF Pages", "/repair-pdf": "Repair PDF", "/powerpoint-to-pdf": "PowerPoint to PDF",
  "/excel-to-pdf": "Excel to PDF", "/html-to-pdf": "HTML to PDF", "/svg-to-pdf": "SVG to PDF",
  "/markdown-to-pdf": "Markdown to PDF", "/text-to-pdf": "Text to PDF", "/pdf-to-powerpoint": "PDF to PowerPoint",
  "/pdf-to-excel": "PDF to Excel", "/pdf-to-pdfa": "PDF to PDF/A", "/pdf-to-text": "PDF to Text",
  "/pdf-to-html": "PDF to HTML", "/pdf-to-png": "PDF to PNG", "/pdf-to-svg": "PDF to SVG",
  "/pdf-to-epub": "PDF to EPUB", "/rotate-pdf": "Rotate PDF", "/add-page-numbers": "Add Page Numbers",
  "/add-watermark": "Add Watermark to PDF", "/crop-pdf": "Crop PDF", "/flatten-pdf": "Flatten PDF",
  "/grayscale-pdf": "Grayscale PDF", "/pdf-metadata": "Edit PDF Metadata", "/unlock-pdf": "Unlock PDF",
  "/sign-pdf": "Sign PDF", "/pdf-filler": "PDF Filler", "/redact-pdf": "Redact PDF", "/compare-pdf": "Compare PDFs",
  "/compress-image": "Compress Image", "/resize-image": "Resize Image", "/crop-image": "Crop Image",
  "/png-to-jpg": "PNG to JPG", "/jpg-to-png": "JPG to PNG", "/webp-to-jpg": "WebP to JPG",
  "/webp-to-png": "WebP to PNG",
  "/jpg-to-webp": "JPG to WebP", "/rotate-image": "Rotate Image", "/remove-background": "Remove Background",
  "/image-to-text": "Image to Text (OCR)", "/ai-image-enhance": "AI Image Enhance",
  "/ai-grammar-check": "AI Grammar Check", "/ai-rewriter": "AI Rewriter",
  "/ai-data-extractor": "AI Data Extractor", "/resume-builder": "Resume Builder",
  "/invoice-generator": "Invoice Generator", "/certificate-maker": "Certificate Maker",
  "/letter-writer": "Letter Writer",
};

const CATEGORY_OF: Record<string, ToolCategory> = {
  "/edit-pdf": "edit", "/protect-pdf": "security", "/image-to-pdf": "convert", "/pdf-to-image": "convert",
  "/remove-pages": "organize", "/extract-pages": "organize", "/organize-pdf": "organize",
  "/scan-to-pdf": "organize", "/reverse-pdf": "organize", "/repair-pdf": "organize",
  "/powerpoint-to-pdf": "convert", "/excel-to-pdf": "convert", "/html-to-pdf": "convert",
  "/svg-to-pdf": "convert", "/markdown-to-pdf": "convert", "/text-to-pdf": "convert",
  "/pdf-to-powerpoint": "convert", "/pdf-to-excel": "convert", "/pdf-to-pdfa": "convert",
  "/pdf-to-text": "convert", "/pdf-to-html": "convert", "/pdf-to-png": "convert",
  "/pdf-to-svg": "convert", "/pdf-to-epub": "convert", "/rotate-pdf": "edit",
  "/add-page-numbers": "edit", "/add-watermark": "edit", "/crop-pdf": "edit",
  "/flatten-pdf": "edit", "/grayscale-pdf": "edit", "/pdf-metadata": "edit",
  "/unlock-pdf": "security", "/sign-pdf": "security", "/pdf-filler": "edit", "/redact-pdf": "security",
  "/compare-pdf": "edit", "/compress-image": "image", "/resize-image": "image",
  "/crop-image": "image", "/png-to-jpg": "image", "/jpg-to-png": "image",
  "/webp-to-jpg": "image", "/webp-to-png": "image", "/jpg-to-webp": "image", "/rotate-image": "image",
  "/remove-background": "image", "/image-to-text": "ai", "/ai-image-enhance": "ai",
  "/ai-grammar-check": "ai", "/ai-rewriter": "ai", "/ai-data-extractor": "ai",
  "/resume-builder": "documents", "/invoice-generator": "documents",
  "/certificate-maker": "documents", "/letter-writer": "documents",
};

export function getToolMeta(pathname: string): ToolMeta | null {
  const existing = TOOL_REGISTRY[pathname];
  const extra = EXTRA_TOOL_DEFS.find(tool => tool.slug === pathname);
  const name = existing?.name ?? NAME_MAP[pathname] ?? extra?.name;
  if (!name) return null;
  const category = existing?.category ?? CATEGORY_OF[pathname] ?? extra?.category ?? "organize";
  const content = getRichContent(pathname);
  const privacy = toolPrivacy(pathname);
  return {
    slug: pathname, name, category,
    short: content?.whatIsIt ?? existing?.short ?? extra?.short ?? name,
    guide: [content?.whatIsIt, ...(content?.tutorial ?? []), privacy].filter(Boolean).join("\n\n"),
    faqs: [
      ...(content?.faqs ?? []),
      { q: "Where is my input processed?", a: privacy },
      { q: "What should I check before sharing?", a: (content?.bestPractices ?? []).join(" ") || "Compare the result with your original. Check page order, names, numbers and readability before relying on it." },
      { q: "What if the tool cannot finish?", a: "Check the input format and any shown error. Large local jobs can exceed device memory; use a smaller job. AI features need an internet connection and may require sign-in or apply request limits." },
    ],
  };
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  const all = [
    ...Object.keys(TOOL_REGISTRY).map(s => getToolMeta(s)).filter((t): t is ToolMeta => t !== null),
    ...Object.keys(NAME_MAP).filter(s => !TOOL_REGISTRY[s]).map(s => getToolMeta(s)).filter((t): t is ToolMeta => t !== null),
  ];
  return all.filter(t => t.category === category);
}


// ---------- Single source of truth for the tool catalogue ----------

/** AI/document tools that exist as routes but have no registry/NAME_MAP entry. */
const EXTRA_TOOL_DEFS: { slug: string; name: string; category: ToolCategory; short: string }[] = [
  { slug: "/ai-cover-letter", name: "AI Cover Letter Writer", category: "ai", short: "Generate tailored cover letters in seconds" },
  { slug: "/ai-email-writer", name: "AI Email Writer", category: "ai", short: "Draft professional emails instantly" },
  { slug: "/ai-blog-writer", name: "AI Blog Writer", category: "ai", short: "Generate full blog articles with AI" },
  { slug: "/ai-code-explainer", name: "AI Code Explainer", category: "ai", short: "Understand any code snippet line-by-line" },
  { slug: "/ai-math-solver", name: "AI Math Solver", category: "ai", short: "Step-by-step solutions to math problems" },
  { slug: "/ai-idea-generator", name: "AI Idea Generator", category: "ai", short: "Brainstorm ideas for any topic" },
  { slug: "/ai-hashtag-generator", name: "AI Hashtag Generator", category: "ai", short: "Trending hashtags for Instagram, TikTok, X" },
  { slug: "/ai-youtube-titles", name: "AI YouTube Title Generator", category: "ai", short: "Click-worthy YouTube titles" },
  { slug: "/ai-tweet-generator", name: "AI Tweet Generator", category: "ai", short: "Punchy tweets in your tone" },
  { slug: "/ai-resume-analyzer", name: "AI Resume Analyzer", category: "ai", short: "Free ATS scan and feedback" },
];

const FALLBACK_SLUGS = [
  "/edit-pdf","/protect-pdf","/image-to-pdf","/pdf-to-image","/remove-pages",
  "/extract-pages","/organize-pdf","/scan-to-pdf","/reverse-pdf","/repair-pdf",
  "/powerpoint-to-pdf","/excel-to-pdf","/html-to-pdf","/svg-to-pdf",
  "/markdown-to-pdf","/text-to-pdf","/pdf-to-powerpoint","/pdf-to-excel",
  "/pdf-to-pdfa","/pdf-to-text","/pdf-to-html","/pdf-to-png","/pdf-to-svg",
  "/pdf-to-epub","/rotate-pdf","/add-page-numbers","/add-watermark","/crop-pdf",
  "/flatten-pdf","/grayscale-pdf","/pdf-metadata","/unlock-pdf","/sign-pdf","/pdf-filler",
  "/redact-pdf","/compare-pdf","/compress-image","/resize-image","/crop-image",
  "/png-to-jpg","/jpg-to-png","/webp-to-jpg","/jpg-to-webp","/webp-to-png","/rotate-image",
  "/remove-background","/image-to-text","/ai-image-enhance","/ai-grammar-check",
  "/ai-rewriter","/ai-data-extractor","/resume-builder","/invoice-generator",
  "/certificate-maker","/letter-writer",
];

let _all: ToolMeta[] | null = null;

/** Every tool the site advertises, de-duplicated. The only place the catalogue is defined. */
export function getAllTools(): ToolMeta[] {
  if (_all) return _all;
  const seen = new Set<string>();
  const out: ToolMeta[] = [];
  const push = (t: ToolMeta | null) => {
    if (!t || seen.has(t.slug)) return;
    seen.add(t.slug);
    out.push(t);
  };
  Object.keys(TOOL_REGISTRY).forEach(s => push(getToolMeta(s)));
  FALLBACK_SLUGS.forEach((s) => push(getToolMeta(s)));
  EXTRA_TOOL_DEFS.forEach(t => push(getToolMeta(t.slug)));
  _all = out;
  return out;
}

/** Authoritative tool count — derived, never hardcoded. */
export const TOOL_COUNT = getAllTools().length;

/** Rounded-down marketing label, e.g. "60+". Always <= TOOL_COUNT. */
export const TOOL_COUNT_LABEL = `${Math.floor(TOOL_COUNT / 10) * 10}+`;
