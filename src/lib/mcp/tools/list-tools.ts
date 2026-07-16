import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SITE = "https://docunova-ai.lovable.app";

const CATEGORIES = ["organize", "convert", "edit", "ai", "image", "security", "documents"] as const;

const TOOLS: Array<{ slug: string; name: string; category: string }> = [
  { slug: "/merge", name: "Merge PDF", category: "organize" },
  { slug: "/split", name: "Split PDF", category: "organize" },
  { slug: "/compress", name: "Compress PDF", category: "organize" },
  { slug: "/organize", name: "Organize PDF", category: "organize" },
  { slug: "/extract-pages", name: "Extract Pages", category: "organize" },
  { slug: "/remove-pages", name: "Remove Pages", category: "organize" },
  { slug: "/rotate-pdf", name: "Rotate PDF", category: "organize" },
  { slug: "/reverse-pdf", name: "Reverse PDF", category: "organize" },
  { slug: "/convert", name: "Convert PDF", category: "convert" },
  { slug: "/pdf-to-word", name: "PDF to Word", category: "convert" },
  { slug: "/word-to-pdf", name: "Word to PDF", category: "convert" },
  { slug: "/pdf-to-excel", name: "PDF to Excel", category: "convert" },
  { slug: "/excel-to-pdf", name: "Excel to PDF", category: "convert" },
  { slug: "/pdf-to-powerpoint", name: "PDF to PowerPoint", category: "convert" },
  { slug: "/powerpoint-to-pdf", name: "PowerPoint to PDF", category: "convert" },
  { slug: "/pdf-to-image", name: "PDF to Image", category: "convert" },
  { slug: "/image-to-pdf", name: "Image to PDF", category: "convert" },
  { slug: "/pdf-to-text", name: "PDF to Text", category: "convert" },
  { slug: "/pdf-to-html", name: "PDF to HTML", category: "convert" },
  { slug: "/html-to-pdf", name: "HTML to PDF", category: "convert" },
  { slug: "/pdf-to-epub", name: "PDF to EPUB", category: "convert" },
  { slug: "/edit-pdf", name: "Edit PDF", category: "edit" },
  { slug: "/sign-pdf", name: "Sign PDF", category: "edit" },
  { slug: "/add-watermark", name: "Add Watermark", category: "edit" },
  { slug: "/add-page-numbers", name: "Add Page Numbers", category: "edit" },
  { slug: "/redact-pdf", name: "Redact PDF", category: "edit" },
  { slug: "/crop-pdf", name: "Crop PDF", category: "edit" },
  { slug: "/photo-text-edit", name: "Photo Text Edit", category: "edit" },
  { slug: "/ocr", name: "OCR PDF", category: "ai" },
  { slug: "/ai-summarizer", name: "AI PDF Summarizer", category: "ai" },
  { slug: "/ai-translator", name: "AI Translator", category: "ai" },
  { slug: "/ai-rewriter", name: "AI Rewriter", category: "ai" },
  { slug: "/ai-grammar-check", name: "AI Grammar Check", category: "ai" },
  { slug: "/ai-email-writer", name: "AI Email Writer", category: "ai" },
  { slug: "/ai-cover-letter", name: "AI Cover Letter", category: "ai" },
  { slug: "/ai-blog-writer", name: "AI Blog Writer", category: "ai" },
  { slug: "/ai-idea-generator", name: "AI Idea Generator", category: "ai" },
  { slug: "/ai-code-explainer", name: "AI Code Explainer", category: "ai" },
  { slug: "/ai-math-solver", name: "AI Math Solver", category: "ai" },
  { slug: "/ai-data-extractor", name: "AI Data Extractor", category: "ai" },
  { slug: "/ai-resume-analyzer", name: "AI Resume Analyzer", category: "ai" },
  { slug: "/ai-hashtag-generator", name: "AI Hashtag Generator", category: "ai" },
  { slug: "/ai-image-enhance", name: "AI Image Enhance", category: "ai" },
  { slug: "/image-to-text", name: "Image to Text (OCR)", category: "ai" },
  { slug: "/image-compress", name: "Image Compress", category: "image" },
  { slug: "/image-resize", name: "Image Resize", category: "image" },
  { slug: "/image-crop", name: "Image Crop", category: "image" },
  { slug: "/image-rotate", name: "Image Rotate", category: "image" },
  { slug: "/remove-background", name: "Remove Background", category: "image" },
  { slug: "/jpg-to-png", name: "JPG to PNG", category: "image" },
  { slug: "/png-to-jpg", name: "PNG to JPG", category: "image" },
  { slug: "/jpg-to-webp", name: "JPG to WebP", category: "image" },
  { slug: "/webp-to-jpg", name: "WebP to JPG", category: "image" },
  { slug: "/protect-pdf", name: "Protect PDF", category: "security" },
  { slug: "/unlock-pdf", name: "Unlock PDF", category: "security" },
  { slug: "/resume-builder", name: "Resume Builder", category: "documents" },
  { slug: "/invoice-generator", name: "Invoice Generator", category: "documents" },
  { slug: "/certificate-maker", name: "Certificate Maker", category: "documents" },
  { slug: "/letter-writer", name: "Letter Writer", category: "documents" },
];

export default defineTool({
  name: "list_tools",
  title: "List Docunova AI tools",
  description: "List the free document, PDF, image, and AI tools available on Docunova AI. Optionally filter by category or search query.",
  inputSchema: {
    category: z.enum(CATEGORIES).optional().describe("Filter by category."),
    query: z.string().optional().describe("Case-insensitive substring match against tool name or slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, query }) => {
    const q = query?.trim().toLowerCase();
    const filtered = TOOLS.filter((t) => {
      if (category && t.category !== category) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.slug.toLowerCase().includes(q)) return false;
      return true;
    }).map((t) => ({ ...t, url: `${SITE}${t.slug}` }));

    return {
      content: [{ type: "text", text: JSON.stringify({ count: filtered.length, tools: filtered }, null, 2) }],
      structuredContent: { count: filtered.length, tools: filtered },
    };
  },
});

export { TOOLS, SITE };
