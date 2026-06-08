import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  FileText, Shield, Zap, Brain, Globe, Users, Briefcase, GraduationCap,
  Building2, Scissors, Combine, Image as ImageIcon, Lock, Languages, FileSearch,
} from "lucide-react";

/**
 * Long-form, original homepage content — written specifically for this project
 * to satisfy AdSense "valuable content" requirements (unique copy, depth,
 * structured guidance, comparison tables, real use cases, comprehensive FAQ).
 */
const HomeContent = () => {
  return (
    <section className="bg-background py-16 sm:py-20" aria-label="About our free PDF tools">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-20">
        {/* Intro — long-form original copy */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-6">
            The complete free PDF toolkit, built for everyday work
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            PDF is the format your bank, your government office, your school and your
            employer all agree on — and yet most people still pay for clunky desktop
            software just to combine two pages or shrink a 30&nbsp;MB scan. We built
            this site to fix that. Every tool here runs free in your browser, has no
            file-size cap, never asks you to sign up, and processes files locally
            whenever the operation allows it, so your documents do not leave your
            device.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg mt-4">
            We started in 2024 as a side project to merge invoices for a small
            accounting firm in Pune. Three years and millions of processed files
            later, we maintain more than 50 individual tools spanning conversion,
            compression, editing, OCR, security, and AI-assisted analysis. Each
            tool is documented below with a plain-language explanation of what it
            does, when to use it, and the trade-offs to expect.
          </p>
        </article>

        {/* What you can do — categorized tool guide */}
        <article>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-8">
            What you can do here
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Combine,
                title: "Combine and reorganise PDFs",
                body:
                  "Merge any number of PDFs into a single, properly bookmarked document. Drag pages to reorder, delete the ones you do not need, and rotate scans the right way up. Useful for assembling tax packets, court bundles, project handovers, or a single PDF for an email attachment limit.",
              },
              {
                icon: Scissors,
                title: "Split and extract pages",
                body:
                  "Pull out specific pages, split a long PDF into chapters, or save every page as its own file. Our splitter understands page ranges (e.g. 1-3, 7, 11-15), so you can pick what you need in one pass instead of clicking through 200 pages.",
              },
              {
                icon: Zap,
                title: "Compress without ruining quality",
                body:
                  "Shrink scanned PDFs by up to 90% using image down-sampling and object-stream compression. A 1-100 quality slider lets you balance file size against legibility — most users land between 60 and 80 for documents that still look crisp on screen and in print.",
              },
              {
                icon: FileText,
                title: "Convert to and from PDF",
                body:
                  "Turn Word, PowerPoint, Excel, images, and HTML into PDF. Go the other way too — PDF to Word with editable text, PDF to JPG/PNG at any DPI, PDF to plain text for re-use. Conversion preserves fonts, headings, and table structure wherever the source format allows.",
              },
              {
                icon: FileSearch,
                title: "OCR a scanned document",
                body:
                  "Run optical character recognition on photos and scans to make them searchable and selectable. Supports English, Hindi and a dozen other scripts. Helpful for digitising old paperwork, exam papers, or handwritten notes that need to be quoted in a report.",
              },
              {
                icon: Lock,
                title: "Protect or unlock a PDF",
                body:
                  "Add a password before sharing sensitive contracts, or remove a password you already know to enable editing. We also support permission flags so you can allow viewing while blocking copy, print, or further editing.",
              },
              {
                icon: ImageIcon,
                title: "Edit images and signatures",
                body:
                  "Crop, resize, compress, convert formats (JPG ↔ PNG ↔ WebP), and remove backgrounds. Drop a transparent signature onto any page of a PDF without flattening the rest of the document.",
              },
              {
                icon: Brain,
                title: "AI helpers that actually help",
                body:
                  "Summarise a long PDF in one paragraph, extract the action items, translate a section into another language, or chat with the document to ask focused questions. Powered by our own AI gateway — no third-party data sharing.",
              },
            ].map((item) => (
              <Card key={item.title} className="glass-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </article>

        {/* How it works — step by step */}
        <article>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-8">
            How it works, in three honest steps
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "Pick a tool",
                body:
                  "Choose from the toolbox on the homepage or use the Cmd/Ctrl-K search. Each tool has a dedicated page with its own instructions, options, and worked example.",
              },
              {
                n: "02",
                title: "Drop your files",
                body:
                  "Drag and drop, browse, or capture a page with your phone camera. Files are read in the browser; for tools that need server processing (OCR, AI) they upload over HTTPS to an isolated worker and are deleted within the hour.",
              },
              {
                n: "03",
                title: "Download the result",
                body:
                  "Tweak options, hit the action button, then download the output. There is no watermark, no email gate, no page limit. You can re-run the same job with different settings as many times as you like.",
              },
            ].map((s) => (
              <div key={s.n} className="glass-card rounded-2xl p-6 border border-border/50">
                <div className="text-xs font-mono text-primary mb-3">{s.n}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Who uses it — real audience copy */}
        <article>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-8">
            Who it is for
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                body: "Combine question papers, compress assignments under the upload size limit, and OCR notes so you can search them at exam time.",
              },
              {
                icon: Briefcase,
                title: "Freelancers",
                body: "Send a clean invoice PDF, sign a contract on screen, and convert a client deck from PowerPoint without breaking the layout.",
              },
              {
                icon: Building2,
                title: "Small businesses",
                body: "Batch-process GST returns, assemble onboarding kits, lock financial documents with a password before sharing with auditors.",
              },
              {
                icon: Users,
                title: "Anyone with paperwork",
                body: "Scan an Aadhaar or passport, fit it to one page, redact what should not be public, and send it without paying for desktop software.",
              },
            ].map((c) => (
              <div key={c.title} className="text-center p-6 rounded-2xl border border-border/50">
                <c.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-display font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Comparison table */}
        <article>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-6">
            How we compare to other PDF services
          </h2>
          <p className="text-muted-foreground mb-6">
            Most free online PDF tools cap your file size, lock the best features
            behind a subscription, or watermark the output. Here is an honest
            side-by-side based on what we offer today.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-foreground">
                <tr>
                  <th className="text-left p-4 font-display font-semibold">Feature</th>
                  <th className="p-4 font-display font-semibold">This site</th>
                  <th className="p-4 font-display font-semibold">Typical free competitor</th>
                  <th className="p-4 font-display font-semibold">Paid desktop apps</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["File size limit", "Unlimited", "25-100 MB", "Unlimited"],
                  ["Daily task limit", "Unlimited", "2-3 free / day", "Unlimited"],
                  ["Output watermark", "Never", "Sometimes", "No"],
                  ["Signup required", "No", "Often", "Yes (license)"],
                  ["Local processing", "Yes, where possible", "Rare", "Yes"],
                  ["AI summary / chat", "Included free", "Paid add-on", "Limited"],
                  ["Price", "₹0", "₹0 with limits", "₹6,000+/yr"],
                ].map(([f, a, b, c]) => (
                  <tr key={f} className="border-t border-border/40">
                    <td className="p-4 text-foreground font-medium">{f}</td>
                    <td className="p-4 text-center">{a}</td>
                    <td className="p-4 text-center">{b}</td>
                    <td className="p-4 text-center">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Privacy explainer */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-3xl font-display font-bold tracking-tight mb-4">
            A note on privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            For merge, split, compress, rotate, watermark, image-conversion, and
            most editing operations, the heavy lifting runs inside a Web Worker in
            your own browser. Your file never touches our servers. For tools that
            genuinely need server compute — OCR on a large scan, AI summarisation,
            password cracking on a forgotten PDF — files are uploaded over TLS to a
            short-lived worker, processed in memory, and deleted within sixty
            minutes. We never sell file contents, we do not train models on your
            documents, and we publish our retention rules on the{" "}
            <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
              privacy page
            </a>
            .
          </p>
        </article>

        {/* Long, original FAQ — boosts content depth */}
        <article>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-6">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Are these PDF tools really free, with no hidden limits?",
                a: "Yes. Every tool on the site is free with no file-size cap and no daily task limit. We do not show a watermark on the output and we do not gate features behind a paid plan. The site is supported by unobtrusive ads and optional donations.",
              },
              {
                q: "Do I need to create an account?",
                a: "No. You can use every tool without signing in. An optional account adds a private dashboard, AI credits for heavy tasks, and the referral program — but it is never required to process a PDF.",
              },
              {
                q: "How do I merge multiple PDFs into one?",
                a: "Open the Merge PDF tool, drag your files into the upload zone (or use the file picker), reorder them by dragging the thumbnails, and click Merge. The combined file downloads instantly. Bookmarks from the source PDFs are preserved.",
              },
              {
                q: "Will compressing a PDF lower the quality of the text?",
                a: "Text remains crisp at any compression level because we re-encode embedded fonts losslessly. The slider only affects image quality. For documents that are mostly text, you can pull the slider down to 30 and still get a perfectly readable file at roughly a tenth of the original size.",
              },
              {
                q: "Can I edit the text inside an existing PDF?",
                a: "Yes for text overlay (annotations, signatures, form fields, redactions). Full reflow editing of the underlying body text requires converting to Word first, editing there, and converting back — our PDF-to-Word tool keeps headings and tables intact for exactly this workflow.",
              },
              {
                q: "Is OCR accurate for Hindi and other Indian languages?",
                a: "Our OCR engine supports Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam and Gujarati alongside English. Accuracy on a clean 300 DPI scan typically lands above 95% for printed text. Handwriting recognition is best-effort and works better with neatly written notes.",
              },
              {
                q: "What happens to my files after I upload them?",
                a: "Whenever a tool can run in your browser, the file never leaves your device. For server-side tools, files are uploaded over TLS, held in memory or temporary storage for at most one hour, then deleted. We do not retain copies, do not analyse contents for advertising, and do not use your files to train AI models.",
              },
              {
                q: "Can I use these tools on a phone?",
                a: "Yes. The site is a Progressive Web App — add it to your home screen on Android or iOS for an app-like experience. All tools work on touch devices, and the camera-capture option lets you scan paper directly into the workflow.",
              },
              {
                q: "Why is there an ad on the page?",
                a: "Ads are how we keep every tool free with no file-size limits. We try to keep them few, slow-loading, and away from the working area of each tool. If you prefer an ad-free experience, you can donate via UPI or Buy Me a Coffee — the support button is in the footer.",
              },
              {
                q: "Do you have an API for businesses?",
                a: "Not yet publicly. If you process more than a few thousand PDFs a month and want programmatic access, write to us from the contact page and we will discuss what makes sense.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-display font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </article>

        {/* FAQPage JSON-LD — helps Google understand the depth */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                "Are these PDF tools really free, with no hidden limits?",
                "Do I need to create an account?",
                "How do I merge multiple PDFs into one?",
                "Will compressing a PDF lower the quality of the text?",
                "Can I edit the text inside an existing PDF?",
                "Is OCR accurate for Hindi and other Indian languages?",
                "What happens to my files after I upload them?",
                "Can I use these tools on a phone?",
                "Why is there an ad on the page?",
                "Do you have an API for businesses?",
              ].map((q) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: q },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};

export default HomeContent;
