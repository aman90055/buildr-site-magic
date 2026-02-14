import { Link } from "react-router-dom";
import { 
  ImageIcon, FileImage, FileDown, Merge, Scissors, Pencil, Lock, ScanText,
  Trash2, FileOutput, LayoutGrid, Scan, Wrench, FileText, Presentation, Table,
  Globe, FileArchive, RotateCw, Hash, Droplets, Crop, Unlock, PenTool, EyeOff, GitCompare, Sparkles, Brain,
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
    title: "AI-Powered",
    icon: Brain,
    tools: [
      { title: "Smart OCR", description: "99.9% accuracy AI OCR", href: "/ocr", icon: ScanText, color: "text-brand-ai", ai: true },
      { title: "AI Analysis", description: "Summarize & extract", href: "/ocr", icon: Brain, color: "text-brand-purple", ai: true },
      { title: "Compress PDF", description: "AI compression engine", href: "/compress", icon: FileDown, color: "text-brand-green", ai: true },
      { title: "Repair PDF", description: "Smart PDF repair", href: "/repair-pdf", icon: Wrench, color: "text-brand-orange", ai: true },
      { title: "AI Summarizer", description: "Instant PDF summaries", href: "/ai-summarizer", icon: Brain, color: "text-brand-cyan", ai: true },
      { title: "AI Translator", description: "Translate documents", href: "/ai-translator", icon: Languages, color: "text-brand-blue", ai: true },
      { title: "AI Grammar Check", description: "Fix errors instantly", href: "/ai-grammar-check", icon: SpellCheck, color: "text-brand-green", ai: true },
      { title: "AI Rewriter", description: "Paraphrase content", href: "/ai-rewriter", icon: RefreshCw, color: "text-brand-orange", ai: true },
      { title: "AI Data Extractor", description: "Extract tables & data", href: "/ai-data-extractor", icon: Database, color: "text-brand-purple", ai: true },
      { title: "AI Image Enhance", description: "Upscale & sharpen", href: "/ai-image-enhance", icon: Sparkles, color: "text-brand-pink", ai: true },
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

const PopularTools = () => {
  const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <section id="tools" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-ai" />
          <span className="text-brand-ai font-display font-medium text-sm uppercase tracking-wider">Complete Toolkit</span>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
          All {totalTools}+ Tools You Need
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {totalTools}+ professional tools across PDF, Image, Document & AI categories
        </p>
      </div>
      
      <div className="space-y-12">
        {toolCategories.map((category, catIndex) => (
          <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground">
                {category.title}
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {category.tools.length} tools
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.href}
                  className="group relative block p-5 rounded-2xl glass-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {tool.ai && (
                    <div className="absolute top-3 right-3">
                      <AIBadge variant="inline" glow={false} />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-ai opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl" />
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <h4 className={`font-display font-semibold ${tool.color} group-hover:text-primary transition-colors`}>
                      {tool.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-13">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularTools;
