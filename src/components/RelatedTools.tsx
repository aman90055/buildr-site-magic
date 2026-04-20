import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

/**
 * Related-tools widget for internal linking & SEO.
 * Pass the current tool's category + slug; we surface 6 sibling tools.
 */

interface ToolLink {
  slug: string;
  name: string;
  description: string;
  category: string;
}

const ALL_TOOLS: ToolLink[] = [
  // Core
  { slug: "/merge", name: "Merge PDF", description: "Combine multiple PDFs", category: "Organize" },
  { slug: "/split", name: "Split PDF", description: "Extract pages or split", category: "Organize" },
  { slug: "/compress", name: "Compress PDF", description: "Reduce PDF file size", category: "Optimize" },
  { slug: "/convert", name: "Convert PDF", description: "Convert PDFs to other formats", category: "Convert" },
  { slug: "/edit-pdf", name: "Edit PDF", description: "Edit text, images, pages", category: "Edit" },
  { slug: "/protect-pdf", name: "Protect PDF", description: "Add password protection", category: "Security" },
  { slug: "/ocr", name: "OCR PDF", description: "Extract text from scans", category: "AI" },
  // Organize
  { slug: "/rotate-pdf", name: "Rotate PDF", description: "Rotate PDF pages", category: "Organize" },
  { slug: "/remove-pages", name: "Remove Pages", description: "Delete pages from PDF", category: "Organize" },
  { slug: "/extract-pages", name: "Extract Pages", description: "Pull pages out", category: "Organize" },
  { slug: "/organize-pdf", name: "Organize PDF", description: "Reorder PDF pages", category: "Organize" },
  { slug: "/reverse-pdf", name: "Reverse PDF", description: "Reverse page order", category: "Organize" },
  // Edit
  { slug: "/add-watermark", name: "Add Watermark", description: "Stamp text/image", category: "Edit" },
  { slug: "/add-page-numbers", name: "Page Numbers", description: "Add page numbers", category: "Edit" },
  { slug: "/crop-pdf", name: "Crop PDF", description: "Crop margins", category: "Edit" },
  { slug: "/grayscale-pdf", name: "Grayscale PDF", description: "Convert to grayscale", category: "Edit" },
  { slug: "/flatten-pdf", name: "Flatten PDF", description: "Flatten form fields", category: "Edit" },
  // Convert TO
  { slug: "/word-to-pdf", name: "Word to PDF", description: "DOCX to PDF", category: "Convert" },
  { slug: "/excel-to-pdf", name: "Excel to PDF", description: "XLSX to PDF", category: "Convert" },
  { slug: "/powerpoint-to-pdf", name: "PowerPoint to PDF", description: "PPTX to PDF", category: "Convert" },
  { slug: "/image-to-pdf", name: "Image to PDF", description: "JPG/PNG to PDF", category: "Convert" },
  { slug: "/html-to-pdf", name: "HTML to PDF", description: "HTML pages to PDF", category: "Convert" },
  // Convert FROM
  { slug: "/pdf-to-word", name: "PDF to Word", description: "PDF to DOCX", category: "Convert" },
  { slug: "/pdf-to-excel", name: "PDF to Excel", description: "PDF to XLSX", category: "Convert" },
  { slug: "/pdf-to-powerpoint", name: "PDF to PowerPoint", description: "PDF to PPTX", category: "Convert" },
  { slug: "/pdf-to-image", name: "PDF to Image", description: "PDF to JPG/PNG", category: "Convert" },
  { slug: "/pdf-to-text", name: "PDF to Text", description: "PDF to plain text", category: "Convert" },
  // Security
  { slug: "/unlock-pdf", name: "Unlock PDF", description: "Remove password", category: "Security" },
  { slug: "/sign-pdf", name: "Sign PDF", description: "Add e-signature", category: "Security" },
  { slug: "/redact-pdf", name: "Redact PDF", description: "Hide sensitive info", category: "Security" },
  // Image
  { slug: "/compress-image", name: "Compress Image", description: "Reduce image size", category: "Image" },
  { slug: "/resize-image", name: "Resize Image", description: "Change dimensions", category: "Image" },
  { slug: "/jpg-to-png", name: "JPG to PNG", description: "Convert formats", category: "Image" },
  { slug: "/png-to-jpg", name: "PNG to JPG", description: "Convert formats", category: "Image" },
  { slug: "/remove-background", name: "Remove Background", description: "AI bg removal", category: "Image" },
  // AI
  { slug: "/ai-summarizer", name: "AI Summarizer", description: "Summarize documents", category: "AI" },
  { slug: "/ai-translator", name: "AI Translator", description: "Translate text", category: "AI" },
  { slug: "/ai-grammar-check", name: "Grammar Check", description: "Fix grammar", category: "AI" },
  { slug: "/ai-rewriter", name: "AI Rewriter", description: "Rewrite content", category: "AI" },
  // Documents
  { slug: "/resume-builder", name: "Resume Builder", description: "Build a resume", category: "Documents" },
  { slug: "/invoice-generator", name: "Invoice Generator", description: "Create invoices", category: "Documents" },
  { slug: "/certificate-maker", name: "Certificate Maker", description: "Design certificates", category: "Documents" },
];

interface RelatedToolsProps {
  currentSlug?: string;
  category?: string;
  limit?: number;
  title?: string;
}

const RelatedTools = ({
  currentSlug,
  category,
  limit = 6,
  title = "Related Tools",
}: RelatedToolsProps) => {
  // Prefer same-category siblings, then fill with popular core tools
  const siblings = ALL_TOOLS.filter(
    (t) => t.slug !== currentSlug && (!category || t.category === category)
  );
  const fallback = ALL_TOOLS.filter(
    (t) => t.slug !== currentSlug && !siblings.includes(t)
  );
  const items = [...siblings, ...fallback].slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-muted/20">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((t) => (
            <Link key={t.slug} to={t.slug} className="group">
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedTools;
