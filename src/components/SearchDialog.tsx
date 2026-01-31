import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, FileText, Merge, Scissors, FileDown, ImageIcon, FileImage, 
  Pencil, Lock, ScanText, Wrench, Presentation, Table, Globe, Hash,
  Droplets, Crop, RotateCw, Unlock, PenTool, EyeOff, GitCompare, Brain,
  Trash2, FileOutput, LayoutGrid, Scan, BookOpen, HelpCircle
} from "lucide-react";

interface SearchItem {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: "tool" | "blog" | "page";
  ai?: boolean;
}

const searchItems: SearchItem[] = [
  // Tools - Organize PDF
  { title: "Merge PDF", description: "Combine multiple PDFs into one", href: "/merge", icon: Merge, category: "tool", ai: true },
  { title: "Split PDF", description: "Split PDF into multiple files", href: "/split", icon: Scissors, category: "tool", ai: true },
  { title: "Remove Pages", description: "Remove specific pages from PDF", href: "/remove-pages", icon: Trash2, category: "tool", ai: true },
  { title: "Extract Pages", description: "Extract specific pages from PDF", href: "/extract-pages", icon: FileOutput, category: "tool", ai: true },
  { title: "Organize PDF", description: "Rearrange and organize PDF pages", href: "/organize-pdf", icon: LayoutGrid, category: "tool", ai: true },
  { title: "Scan to PDF", description: "Convert scanned documents to PDF", href: "/scan-to-pdf", icon: Scan, category: "tool" },
  
  // Tools - AI Powered
  { title: "Smart OCR", description: "Extract text from images with AI", href: "/ocr", icon: ScanText, category: "tool", ai: true },
  { title: "AI Analysis", description: "Summarize and analyze documents", href: "/ocr", icon: Brain, category: "tool", ai: true },
  { title: "Compress PDF", description: "Reduce PDF file size with AI", href: "/compress", icon: FileDown, category: "tool", ai: true },
  { title: "Repair PDF", description: "Fix corrupted PDF files", href: "/repair-pdf", icon: Wrench, category: "tool", ai: true },
  
  // Tools - Convert to PDF
  { title: "JPG to PDF", description: "Convert images to PDF", href: "/image-to-pdf", icon: ImageIcon, category: "tool", ai: true },
  { title: "Word to PDF", description: "Convert Word documents to PDF", href: "/word-to-pdf", icon: FileText, category: "tool" },
  { title: "PowerPoint to PDF", description: "Convert presentations to PDF", href: "/powerpoint-to-pdf", icon: Presentation, category: "tool" },
  { title: "Excel to PDF", description: "Convert spreadsheets to PDF", href: "/excel-to-pdf", icon: Table, category: "tool" },
  { title: "HTML to PDF", description: "Convert web pages to PDF", href: "/html-to-pdf", icon: Globe, category: "tool" },
  
  // Tools - Convert from PDF
  { title: "PDF to JPG", description: "Convert PDF to images", href: "/pdf-to-image", icon: FileImage, category: "tool", ai: true },
  { title: "PDF to Word", description: "Convert PDF to Word document", href: "/pdf-to-word", icon: FileText, category: "tool", ai: true },
  { title: "PDF to PowerPoint", description: "Convert PDF to presentation", href: "/pdf-to-powerpoint", icon: Presentation, category: "tool" },
  { title: "PDF to Excel", description: "Convert PDF to spreadsheet", href: "/pdf-to-excel", icon: Table, category: "tool", ai: true },
  
  // Tools - Edit PDF
  { title: "Edit PDF", description: "Edit text and images in PDF", href: "/edit-pdf", icon: Pencil, category: "tool", ai: true },
  { title: "Rotate PDF", description: "Rotate PDF pages", href: "/rotate-pdf", icon: RotateCw, category: "tool" },
  { title: "Add Page Numbers", description: "Add page numbers to PDF", href: "/add-page-numbers", icon: Hash, category: "tool" },
  { title: "Add Watermark", description: "Add watermark to PDF", href: "/add-watermark", icon: Droplets, category: "tool" },
  { title: "Crop PDF", description: "Crop PDF pages", href: "/crop-pdf", icon: Crop, category: "tool" },
  
  // Tools - Security
  { title: "Unlock PDF", description: "Remove PDF password protection", href: "/unlock-pdf", icon: Unlock, category: "tool" },
  { title: "Protect PDF", description: "Add password protection to PDF", href: "/protect-pdf", icon: Lock, category: "tool" },
  { title: "Sign PDF", description: "Add digital signature to PDF", href: "/sign-pdf", icon: PenTool, category: "tool" },
  { title: "Redact PDF", description: "Redact sensitive information", href: "/redact-pdf", icon: EyeOff, category: "tool", ai: true },
  { title: "Compare PDF", description: "Compare two PDF files", href: "/compare-pdf", icon: GitCompare, category: "tool", ai: true },
  
  // Blog posts
  { title: "AI-Powered PDF Compression", description: "Reduce file size by 90%", href: "/blog/ai-powered-compression", icon: BookOpen, category: "blog" },
  { title: "How to Merge Multiple PDFs", description: "Step-by-step merge guide", href: "/blog/merge-pdfs-guide", icon: BookOpen, category: "blog" },
  { title: "OCR Technology Guide", description: "Extract text from scanned docs", href: "/blog/ocr-technology", icon: BookOpen, category: "blog" },
  { title: "PDF Security Best Practices", description: "Protect sensitive documents", href: "/blog/pdf-security-best-practices", icon: BookOpen, category: "blog" },
  { title: "Batch Processing Guide", description: "Process multiple files at once", href: "/blog/batch-processing", icon: BookOpen, category: "blog" },
  { title: "Converting Images to PDF", description: "Complete conversion guide", href: "/blog/image-to-pdf-guide", icon: BookOpen, category: "blog" },
  
  // Pages
  { title: "Blog", description: "Tips, tutorials & updates", href: "/blog", icon: BookOpen, category: "page" },
  { title: "FAQ", description: "Frequently asked questions", href: "/faq", icon: HelpCircle, category: "page" },
  { title: "About", description: "About PDF Tools", href: "/about", icon: FileText, category: "page" },
  { title: "Contact", description: "Get in touch with us", href: "/contact", icon: FileText, category: "page" },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchItems;
    
    const lowerQuery = query.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const groupedItems = useMemo(() => {
    const tools = filteredItems.filter((item) => item.category === "tool");
    const blog = filteredItems.filter((item) => item.category === "blog");
    const pages = filteredItems.filter((item) => item.category === "page");
    return { tools, blog, pages };
  }, [filteredItems]);

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setQuery("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tool":
        return "bg-primary/10 text-primary";
      case "blog":
        return "bg-brand-purple/10 text-brand-purple";
      case "page":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools, blog posts, and pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-0 bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] px-2 pb-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {groupedItems.tools.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tools ({groupedItems.tools.length})
                  </div>
                  <div className="space-y-1">
                    {groupedItems.tools.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                              {item.title}
                            </span>
                            {item.ai && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-brand-ai/10 text-brand-ai border-0">
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groupedItems.blog.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Blog Posts ({groupedItems.blog.length})
                  </div>
                  <div className="space-y-1">
                    {groupedItems.blog.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groupedItems.pages.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Pages ({groupedItems.pages.length})
                  </div>
                  <div className="space-y-1">
                    {groupedItems.pages.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd> to select</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
