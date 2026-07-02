import { Upload, Sparkles, PenLine, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1. Upload PDF or Image",
    desc: "Drag & drop any PDF, DOCX, or image. Unlimited size, 100% private — files never leave your browser.",
    color: "from-brand-blue to-brand-cyan",
  },
  {
    icon: Sparkles,
    title: "2. Smart Extraction",
    desc: "OCR, summarization, translation & data extraction powered by our 2026 document engine.",
    color: "from-brand-ai to-brand-purple",
  },
  {
    icon: PenLine,
    title: "3. Edit & Organize",
    desc: "Merge, split, sign, redact, watermark, reorder pages — a full editor in the browser.",
    color: "from-brand-purple to-brand-pink",
  },
  {
    icon: Download,
    title: "4. Export Anywhere",
    desc: "Download as PDF, Word, Excel, PNG, or share a secure link. Optimized for print & web.",
    color: "from-brand-orange to-brand-green",
  },
];

const WorkflowStrip = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background via-secondary/30 to-background" aria-label="How Document Edit Pro AI works">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-primary/20 text-xs font-medium text-primary mb-4">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
            From messy documents to polished output in <span className="text-primary">4 steps</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            The complete PDF, AI &amp; document workflow — no installs, no learning curve.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative p-5 sm:p-6 glass-card rounded-2xl border border-border/60 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.4)] animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <span aria-hidden className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowStrip;
