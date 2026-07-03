import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

// Map known route segments to friendlier labels
const LABELS: Record<string, string> = {
  "ai-hub": "AI Hub",
  "ai-translator": "AI Translator",
  "ai-summarizer": "AI Summarizer",
  "ai-grammar-check": "Grammar Check",
  "ai-rewriter": "AI Rewriter",
  "ai-data-extractor": "Data Extractor",
  "ai-cover-letter": "Cover Letter",
  "ai-email-writer": "Email Writer",
  "ai-blog-writer": "Blog Writer",
  "ai-code-explainer": "Code Explainer",
  "ai-math-solver": "Math Solver",
  "ai-idea-generator": "Idea Generator",
  "ai-hashtag-generator": "Hashtag Generator",
  "ai-youtube-titles": "YouTube Titles",
  "ai-tweet-generator": "Tweet Generator",
  "ai-resume-analyzer": "Resume Analyzer",
  "ai-image-enhance": "AI Image Enhance",
  "image-to-text": "Image to Text",
  "photo-text-edit": "Photo Text Edit",
  "pdf-to-word": "PDF to Word",
  "pdf-to-excel": "PDF to Excel",
  "pdf-to-image": "PDF to Image",
  "image-to-pdf": "Image to PDF",
  "resume-builder": "Resume Builder",
  "invoice-generator": "Invoice Generator",
  "certificate-maker": "Certificate Maker",
  "letter-writer": "Letter Writer",
  ai: "AI",
  tools: "Tools",
  admin: "Admin",
  blog: "Blog",
  legal: "Legal",
  category: "Category",
};

const humanize = (seg: string) =>
  LABELS[seg] ||
  seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="fixed top-16 sm:top-20 left-0 right-0 z-30 pointer-events-none"
    >
      <div className="container mx-auto px-3 sm:px-6">
        <ol className="pointer-events-auto inline-flex items-center gap-1 sm:gap-1.5 max-w-full overflow-x-auto whitespace-nowrap rounded-full glass-card px-3 py-1.5 text-xs sm:text-sm shadow-sm border border-border/40 backdrop-blur-md">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
          {segments.map((seg, i) => {
            const path = "/" + segments.slice(0, i + 1).join("/");
            const isLast = i === segments.length - 1;
            return (
              <li key={path} className="flex items-center gap-1 sm:gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                {isLast ? (
                  <span className="font-medium text-foreground truncate max-w-[40vw] sm:max-w-none">
                    {humanize(decodeURIComponent(seg))}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[30vw] sm:max-w-none"
                  >
                    {humanize(decodeURIComponent(seg))}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
