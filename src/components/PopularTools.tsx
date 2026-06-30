import { Link } from "react-router-dom";
import { 
  ImageIcon, FileImage, FileDown, Merge, Scissors, Pencil, Lock, ScanText,
  Trash2, FileOutput, LayoutGrid, Scan, Wrench, FileText, Presentation, Table,
  Globe, FileArchive, RotateCw, Hash, Droplets, Crop, Unlock, PenTool, EyeOff, GitCompare, Star, Lightbulb,
  ArrowDownUp, Layers, Contrast, Info, BookOpen, FileCode, Type,
  Minimize2, Maximize, Eraser, RefreshCw, Languages, SpellCheck, Database,
  Receipt, Award, Mail, FileUser
} from "lucide-react";
import AIBadge from "./AIBadge";

const toolCategories = [
  {
    title: "Organize PDF",
    icon: LayoutGrid,
    tools: [
      { title: "Merge PDF", description: "AI-optimized combining", href: "/merge", icon: Merge, color: "text-brand-orange", ai: true },
      { title: "Split PDF", description: "Smart page detection", href: "/split", icon: Scissors, color: "text-brand-pink", ai: true },
      { title: "Remove Pages", description: "AI-suggested removal", href: "/remove-pages", icon: Trash2, color: "text-destructive", ai: true },
      { title: "Extract Pages", description: "Smart extraction", href: "/extract-pages", icon: FileOutput, color: "text-brand-green", ai: true },
      { title: "Organize PDF", description: "AI page arrangement", href: "/organize-pdf", icon: LayoutGrid, color: "text-brand-purple", ai: true },
      { title: "Scan to PDF", description: "Enhanced scanning", href: "/scan-to-pdf", icon: Scan, color: "text-brand-cyan" },
      { title: "Reverse PDF", description: "Reverse page order", href: "/reverse-pdf", icon: ArrowDownUp, color: "text-brand-orange" },
    ]
  },
  {
    title: "Smart Tools",
    icon: Lightbulb,
    tools: [
      { title: "Smart OCR", description: "99.9% accuracy AI OCR", href: "/ocr", icon: ScanText, color: "text-brand-ai", ai: true },
      { title: "Smart Analysis", description: "Summarize & extract", href: "/ocr", icon: Lightbulb, color: "text-brand-purple", ai: true },
      { title: "Compress PDF", description: "AI compression engine", href: "/compress", icon: FileDown, color: "text-brand-green", ai: true },
      { title: "Repair PDF", description: "Smart PDF repair", href: "/repair-pdf", icon: Wrench, color: "text-brand-orange", ai: true },
      { title: "Smart Summarizer", description: "Instant PDF summaries", href: "/ai-summarizer", icon: Lightbulb, color: "text-brand-cyan", ai: true },
      { title: "AI Translator", description: "Translate documents", href: "/ai-translator", icon: Languages, color: "text-brand-blue", ai: true },
      { title: "AI Grammar Check", description: "Fix errors instantly", href: "/ai-grammar-check", icon: SpellCheck, color: "text-brand-green", ai: true },
      { title: "AI Rewriter", description: "Paraphrase content", href: "/ai-rewriter", icon: RefreshCw, color: "text-brand-orange", ai: true },
      { title: "AI Data Extractor", description: "Extract tables & data", href: "/ai-data-extractor", icon: Database, color: "text-brand-purple", ai: true },
      { title: "Image Enhance", description: "Upscale & sharpen", href: "/ai-image-enhance", icon: Star, color: "text-brand-pink", ai: true },
      { title: "Remove Background", description: "AI background removal", href: "/remove-background", icon: Eraser, color: "text-destructive", ai: true },
      { title: "Image to Text", description: "OCR from images", href: "/image-to-text", icon: ScanText, color: "text-brand-ai", ai: true },
    ]
  },
  {
    title: "Convert to PDF",
    icon: FileText,
    tools: [
      { title: "JPG to PDF", description: "AI image optimization", href: "/image-to-pdf", icon: ImageIcon, color: "text-brand-blue", ai: true },
      { title: "Word to PDF", description: "Perfect formatting", href: "/word-to-pdf", icon: FileText, color: "text-brand-blue" },
      { title: "PowerPoint to PDF", description: "Preserve animations", href: "/powerpoint-to-pdf", icon: Presentation, color: "text-brand-orange" },
      { title: "Excel to PDF", description: "Keep formulas", href: "/excel-to-pdf", icon: Table, color: "text-brand-green" },
      { title: "HTML to PDF", description: "Web to document", href: "/html-to-pdf", icon: Globe, color: "text-brand-cyan" },
      { title: "SVG to PDF", description: "Vector to PDF", href: "/svg-to-pdf", icon: PenTool, color: "text-brand-pink" },
      { title: "Markdown to PDF", description: "MD to formatted PDF", href: "/markdown-to-pdf", icon: FileCode, color: "text-brand-purple" },
      { title: "Text to PDF", description: "Plain text to PDF", href: "/text-to-pdf", icon: Type, color: "text-muted-foreground" },
    ]
  },
  {
    title: "Convert from PDF",
    icon: FileImage,
    tools: [
      { title: "PDF to JPG", description: "AI-enhanced export", href: "/pdf-to-image", icon: FileImage, color: "text-brand-purple", ai: true },
      { title: "PDF to Word", description: "Smart conversion", href: "/pdf-to-word", icon: FileText, color: "text-brand-blue", ai: true },
      { title: "PDF to PowerPoint", description: "Editable slides", href: "/pdf-to-powerpoint", icon: Presentation, color: "text-brand-orange" },
      { title: "PDF to Excel", description: "Extract tables", href: "/pdf-to-excel", icon: Table, color: "text-brand-green", ai: true },
      { title: "PDF to PDF/A", description: "Archive format", href: "/pdf-to-pdfa", icon: FileArchive, color: "text-brand-purple" },
      { title: "PDF to Text", description: "AI text extraction", href: "/pdf-to-text", icon: FileText, color: "text-brand-cyan", ai: true },
      { title: "PDF to HTML", description: "Web-ready output", href: "/pdf-to-html", icon: Globe, color: "text-brand-blue", ai: true },
      { title: "PDF to PNG", description: "High-res images", href: "/pdf-to-png", icon: ImageIcon, color: "text-brand-green", ai: true },
      { title: "PDF to SVG", description: "Vector graphics", href: "/pdf-to-svg", icon: PenTool, color: "text-brand-orange" },
      { title: "PDF to eBook", description: "EPUB conversion", href: "/pdf-to-epub", icon: BookOpen, color: "text-brand-pink", ai: true },
    ]
  },
  {
    title: "Edit PDF",
    icon: Pencil,
    tools: [
      { title: "Edit PDF", description: "AI-assisted editing", href: "/edit-pdf", icon: Pencil, color: "text-brand-cyan", ai: true },
      { title: "Rotate PDF", description: "Smart rotation", href: "/rotate-pdf", icon: RotateCw, color: "text-brand-pink" },
      { title: "Add Page Numbers", description: "Auto-numbering", href: "/add-page-numbers", icon: Hash, color: "text-brand-blue" },
      { title: "Add Watermark", description: "Custom branding", href: "/add-watermark", icon: Droplets, color: "text-brand-cyan" },
      { title: "Crop PDF", description: "Precision cropping", href: "/crop-pdf", icon: Crop, color: "text-brand-green" },
      { title: "Flatten PDF", description: "Lock form fields", href: "/flatten-pdf", icon: Layers, color: "text-brand-purple" },
      { title: "Grayscale PDF", description: "Convert to B&W", href: "/grayscale-pdf", icon: Contrast, color: "text-muted-foreground" },
      { title: "Edit Metadata", description: "PDF properties", href: "/pdf-metadata", icon: Info, color: "text-brand-orange" },
    ]
  },
  {
    title: "PDF Security",
    icon: Lock,
    tools: [
      { title: "Unlock PDF", description: "Remove restrictions", href: "/unlock-pdf", icon: Unlock, color: "text-brand-orange" },
      { title: "Protect PDF", description: "Bank-grade encryption", href: "/protect-pdf", icon: Lock, color: "text-destructive" },
      { title: "Sign PDF", description: "Digital signatures", href: "/sign-pdf", icon: PenTool, color: "text-brand-purple" },
      { title: "Redact PDF", description: "AI-powered redaction", href: "/redact-pdf", icon: EyeOff, color: "text-destructive", ai: true },
      { title: "Compare PDF", description: "AI difference detection", href: "/compare-pdf", icon: GitCompare, color: "text-brand-ai", ai: true },
    ]
  },
  {
    title: "Image Tools",
    icon: ImageIcon,
    tools: [
      { title: "Compress Image", description: "AI smart compression", href: "/compress-image", icon: Minimize2, color: "text-brand-green", ai: true },
      { title: "Resize Image", description: "Custom dimensions", href: "/resize-image", icon: Maximize, color: "text-brand-blue" },
      { title: "Crop Image", description: "Precision cropping", href: "/crop-image", icon: Crop, color: "text-brand-orange" },
      { title: "Rotate Image", description: "Rotate & flip", href: "/rotate-image", icon: RotateCw, color: "text-brand-pink" },
      { title: "PNG to JPG", description: "Format conversion", href: "/png-to-jpg", icon: FileImage, color: "text-brand-cyan" },
      { title: "JPG to PNG", description: "Lossless conversion", href: "/jpg-to-png", icon: FileImage, color: "text-brand-purple" },
      { title: "WebP to JPG", description: "Universal format", href: "/webp-to-jpg", icon: FileImage, color: "text-brand-green" },
      { title: "JPG to WebP", description: "Modern format", href: "/jpg-to-webp", icon: FileImage, color: "text-brand-blue" },
    ]
  },
  {
    title: "Document Tools",
    icon: FileText,
    tools: [
      { title: "AI Resume Builder", description: "ATS-friendly resumes", href: "/resume-builder", icon: FileUser, color: "text-brand-blue", ai: true },
      { title: "Invoice Generator", description: "Professional invoices", href: "/invoice-generator", icon: Receipt, color: "text-brand-green" },
      { title: "Certificate Maker", description: "Beautiful certificates", href: "/certificate-maker", icon: Award, color: "text-brand-orange" },
      { title: "AI Letter Writer", description: "Smart correspondence", href: "/letter-writer", icon: Mail, color: "text-brand-purple", ai: true },
    ]
  },
];

// Premium gradient palette for tool icons
const gradientPalette = [
  "from-blue-500 via-blue-600 to-indigo-600",
  "from-purple-500 via-fuchsia-500 to-pink-500",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-orange-400 via-amber-500 to-rose-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-indigo-500 via-violet-500 to-purple-600",
  "from-teal-400 via-emerald-500 to-green-600",
];

const pickGradient = (catIndex: number, idx: number) =>
  gradientPalette[(catIndex * 3 + idx) % gradientPalette.length];

const PopularTools = () => {
  const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <section id="tools" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-brand-ai" />
          <span className="text-brand-ai font-display font-medium text-sm uppercase tracking-wider">Complete Toolkit</span>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
          All {totalTools}+ Tools You Need
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {totalTools}+ premium tools across PDF, Image, Document & Smart categories
        </p>
      </div>

      <div className="space-y-14">
        {toolCategories.map((category, catIndex) => (
          <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 0.08}s` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl md:text-2xl text-foreground tracking-tight">
                {category.title}
              </h3>
              <span className="text-xs font-medium text-muted-foreground bg-muted/60 backdrop-blur px-2.5 py-1 rounded-full border border-border/50">
                {category.tools.length} tools
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {category.tools.map((tool, index) => {
                const grad = pickGradient(catIndex, index);
                return (
                  <Link
                    key={index}
                    to={tool.href}
                    className="group relative block rounded-[22px] p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-blue-400/60 hover:via-purple-400/40 hover:to-cyan-400/60 transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <div className="relative h-full rounded-[20px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 p-5 overflow-hidden shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] group-hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.45)] transition-shadow duration-500">
                      <div className={`pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-500`} />
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_50%)]" />

                      {tool.ai && (
                        <div className="absolute top-3 right-3 z-10">
                          <AIBadge variant="inline" glow={false} />
                        </div>
                      )}

                      <div className="relative flex flex-col h-full">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg shadow-black/10 group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 mb-4 ring-1 ring-white/40 dark:ring-white/10`}>
                          <tool.icon className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
                        </div>

                        <h4 className="font-display font-semibold text-[15px] leading-tight text-foreground group-hover:text-primary transition-colors mb-1.5">
                          {tool.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                          {tool.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                            Open Tool
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${grad} opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300`} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularTools;
