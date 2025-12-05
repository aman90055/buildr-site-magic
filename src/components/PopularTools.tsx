import { Link } from "react-router-dom";
import { 
  ImageIcon, FileImage, FileDown, Merge, Scissors, Pencil, Lock, ScanText,
  Trash2, FileOutput, LayoutGrid, Scan, Wrench, FileText, Presentation, Table,
  Globe, FileArchive, RotateCw, Hash, Droplets, Crop, Unlock, PenTool, EyeOff, GitCompare
} from "lucide-react";

const toolCategories = [
  {
    title: "Organize PDF",
    tools: [
      { title: "Merge PDF", description: "Combine multiple PDFs into one.", href: "/merge", icon: Merge, color: "text-brand-orange" },
      { title: "Split PDF", description: "Extract or split by page ranges.", href: "/split", icon: Scissors, color: "text-brand-pink" },
      { title: "Remove Pages", description: "Delete unwanted pages.", href: "/remove-pages", icon: Trash2, color: "text-primary" },
      { title: "Extract Pages", description: "Extract specific pages.", href: "/extract-pages", icon: FileOutput, color: "text-brand-green" },
      { title: "Organize PDF", description: "Rearrange PDF pages.", href: "/organize-pdf", icon: LayoutGrid, color: "text-brand-purple" },
      { title: "Scan to PDF", description: "Convert scans to PDF.", href: "/scan-to-pdf", icon: Scan, color: "text-brand-cyan" },
    ]
  },
  {
    title: "Optimize PDF",
    tools: [
      { title: "Compress PDF", description: "Reduce file size fast.", href: "/compress", icon: FileDown, color: "text-brand-green" },
      { title: "Repair PDF", description: "Fix corrupted PDFs.", href: "/repair-pdf", icon: Wrench, color: "text-brand-orange" },
      { title: "OCR PDF", description: "Recognize text in scans.", href: "/ocr", icon: ScanText, color: "text-accent" },
    ]
  },
  {
    title: "Convert to PDF",
    tools: [
      { title: "JPG to PDF", description: "Convert images to PDF.", href: "/image-to-pdf", icon: ImageIcon, color: "text-brand-blue" },
      { title: "Word to PDF", description: "Convert DOCX to PDF.", href: "/word-to-pdf", icon: FileText, color: "text-brand-blue" },
      { title: "PowerPoint to PDF", description: "Convert PPTX to PDF.", href: "/powerpoint-to-pdf", icon: Presentation, color: "text-brand-orange" },
      { title: "Excel to PDF", description: "Convert XLSX to PDF.", href: "/excel-to-pdf", icon: Table, color: "text-brand-green" },
      { title: "HTML to PDF", description: "Convert web pages to PDF.", href: "/html-to-pdf", icon: Globe, color: "text-brand-cyan" },
    ]
  },
  {
    title: "Convert from PDF",
    tools: [
      { title: "PDF to JPG", description: "Export pages as images.", href: "/pdf-to-image", icon: FileImage, color: "text-brand-purple" },
      { title: "PDF to Word", description: "Convert to DOCX.", href: "/pdf-to-word", icon: FileText, color: "text-brand-blue" },
      { title: "PDF to PowerPoint", description: "Convert to PPTX.", href: "/pdf-to-powerpoint", icon: Presentation, color: "text-brand-orange" },
      { title: "PDF to Excel", description: "Convert to XLSX.", href: "/pdf-to-excel", icon: Table, color: "text-brand-green" },
      { title: "PDF to PDF/A", description: "Archive format.", href: "/pdf-to-pdfa", icon: FileArchive, color: "text-brand-purple" },
    ]
  },
  {
    title: "Edit PDF",
    tools: [
      { title: "Edit PDF", description: "Add text and images.", href: "/edit-pdf", icon: Pencil, color: "text-brand-cyan" },
      { title: "Rotate PDF", description: "Rotate pages.", href: "/rotate-pdf", icon: RotateCw, color: "text-brand-pink" },
      { title: "Add Page Numbers", description: "Number your pages.", href: "/add-page-numbers", icon: Hash, color: "text-brand-blue" },
      { title: "Add Watermark", description: "Add text/image watermark.", href: "/add-watermark", icon: Droplets, color: "text-brand-cyan" },
      { title: "Crop PDF", description: "Trim page margins.", href: "/crop-pdf", icon: Crop, color: "text-brand-green" },
    ]
  },
  {
    title: "PDF Security",
    tools: [
      { title: "Unlock PDF", description: "Remove password.", href: "/unlock-pdf", icon: Unlock, color: "text-brand-orange" },
      { title: "Protect PDF", description: "Add password protection.", href: "/protect-pdf", icon: Lock, color: "text-primary" },
      { title: "Sign PDF", description: "Add digital signature.", href: "/sign-pdf", icon: PenTool, color: "text-brand-purple" },
      { title: "Redact PDF", description: "Black out sensitive info.", href: "/redact-pdf", icon: EyeOff, color: "text-primary" },
      { title: "Compare PDF", description: "Find differences.", href: "/compare-pdf", icon: GitCompare, color: "text-accent" },
    ]
  },
];

const PopularTools = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-12 text-center">
        All PDF Tools
      </h2>
      <div className="space-y-12">
        {toolCategories.map((category, catIndex) => (
          <div key={catIndex}>
            <h3 className="font-display font-semibold text-xl text-foreground mb-4 border-b border-border pb-2">
              {category.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.href}
                  className="group block p-4 rounded-xl bg-card border border-border hover:bg-background hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    <h4 className={`font-display font-semibold ${tool.color}`}>
                      {tool.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
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
