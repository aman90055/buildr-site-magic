import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialMeta from "@/components/SocialMeta";
import ShareButtons from "@/components/ShareButtons";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Scale, GraduationCap, Briefcase, Users, ArrowRight } from "lucide-react";

/**
 * Honest, illustrative workflows — NOT customer case studies.
 * We do not publish customer names, logos, metrics or quotes we cannot verify.
 */
const useCases = [
  {
    icon: Scale,
    audience: "Legal and admin teams",
    headline: "Prepare contract bundles without uploading client files",
    steps: [
      "Merge signed pages and annexures into a single PDF",
      "Add page numbers and a confidentiality watermark",
      "Redact sensitive clauses before sharing externally",
      "Password-protect the final bundle with AES encryption",
    ],
    tools: [
      { to: "/merge", label: "Merge PDF" },
      { to: "/add-page-numbers", label: "Add Page Numbers" },
      { to: "/redact-pdf", label: "Redact PDF" },
      { to: "/protect-pdf", label: "Protect PDF" },
    ],
    note: "All four steps run inside your browser — the documents are never uploaded to us.",
  },
  {
    icon: GraduationCap,
    audience: "Students and educators",
    headline: "Turn lecture scans into searchable, shareable notes",
    steps: [
      "Capture pages with your phone camera or upload photos",
      "Build a single PDF from the images",
      "Run OCR to get selectable, copyable text",
      "Compress the result so it fits an email or LMS upload",
    ],
    tools: [
      { to: "/scan-to-pdf", label: "Scan to PDF" },
      { to: "/image-to-text", label: "Image to Text (OCR)" },
      { to: "/compress", label: "Compress PDF" },
    ],
    note: "OCR uses an AI provider, so the page image you submit is sent for processing. Everything else stays local.",
  },
  {
    icon: Briefcase,
    audience: "Freelancers and small businesses",
    headline: "Send invoices and proposals that look professional",
    steps: [
      "Generate an invoice with your own branding and line items",
      "Convert a Word or Excel quote into a fixed-layout PDF",
      "Sign the document and flatten it so fields can't be edited",
      "Compress before sending to keep attachments small",
    ],
    tools: [
      { to: "/invoice-generator", label: "Invoice Generator" },
      { to: "/word-to-pdf", label: "Word to PDF" },
      { to: "/sign-pdf", label: "Sign PDF" },
      { to: "/flatten-pdf", label: "Flatten PDF" },
    ],
    note: "No account is needed for any of these steps.",
  },
  {
    icon: Users,
    audience: "Job seekers",
    headline: "Get a resume past automated screening",
    steps: [
      "Build or refine your resume with a clean, parseable layout",
      "Check it against a job description for missing keywords",
      "Export as a text-based PDF (not an image) so parsers can read it",
      "Draft a matching cover letter",
    ],
    tools: [
      { to: "/resume-builder", label: "Resume Builder" },
      { to: "/ai-resume-analyzer", label: "AI Resume Analyzer" },
      { to: "/ai-cover-letter", label: "AI Cover Letter" },
    ],
    note: "The AI resume tools send the text you paste to our AI provider for analysis.",
  },
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Use Cases — How People Use Docunova"
        description="Practical, step-by-step document workflows for legal teams, students, freelancers and job seekers — with the exact Docunova tools each one uses."
        path="/case-studies"
      />
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Use cases</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              These are illustrative workflows, not customer testimonials. We don't publish customer
              names, logos or performance figures we can't verify — instead, here's exactly how the
              tools fit together for common jobs.
            </p>
          </div>
          <ShareButtons title="Docunova use cases" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {useCases.map((c) => (
            <Card key={c.headline} className="p-6 md:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <c.icon className="w-5 h-5 text-primary" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.audience}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold leading-snug">{c.headline}</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                {c.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2 pt-1">
                {c.tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-auto">{c.note}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Browse the full tool list <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudies;
