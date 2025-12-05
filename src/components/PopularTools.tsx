import { Link } from "react-router-dom";
import { ImageIcon, FileImage, FileDown, Merge, Scissors, Pencil, Lock, ScanText } from "lucide-react";

const tools = [
  {
    title: "Image to PDF",
    description: "Combine JPG/PNG into a single PDF.",
    href: "/image-to-pdf",
    icon: ImageIcon,
    color: "text-brand-blue",
  },
  {
    title: "PDF to Image",
    description: "Export pages as JPG or PNG.",
    href: "/pdf-to-image",
    icon: FileImage,
    color: "text-brand-purple",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size fast.",
    href: "/compress",
    icon: FileDown,
    color: "text-brand-green",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one.",
    href: "/merge",
    icon: Merge,
    color: "text-brand-orange",
  },
  {
    title: "Split PDF",
    description: "Extract or split by page ranges.",
    href: "/split",
    icon: Scissors,
    color: "text-brand-pink",
  },
  {
    title: "Edit PDF",
    description: "Add text, images, and annotations.",
    href: "/edit-pdf",
    icon: Pencil,
    color: "text-brand-cyan",
  },
  {
    title: "Protect PDF",
    description: "Password‑lock your document.",
    href: "/protect-pdf",
    icon: Lock,
    color: "text-primary",
  },
  {
    title: "OCR (Scan to text)",
    description: "Recognize text in scans and images.",
    href: "/ocr",
    icon: ScanText,
    color: "text-accent",
  },
];

const PopularTools = () => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-8">
        Popular tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <Link
            key={index}
            to={tool.href}
            className="group block p-5 rounded-xl bg-card border border-border hover:bg-background hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
              <h3 className={`font-display font-semibold text-lg ${tool.color}`}>
                {tool.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularTools;
