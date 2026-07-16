import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const CANONICAL = "https://docunova-ai.lovable.app/guides/how-to-edit-pdf-on-mac-free";

const GuideEditPdfOnMacFree = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Edit a PDF on Mac for Free",
    description:
      "Step-by-step guide to editing PDFs on macOS for free using Preview, plus a browser alternative that adds text, images, signatures and page reordering without installing anything.",
    totalTime: "PT5M",
    supply: [{ "@type": "HowToSupply", name: "A PDF file" }],
    tool: [{ "@type": "HowToTool", name: "macOS Preview" }, { "@type": "HowToTool", name: "Docunova AI (browser)" }],
    step: [
      { "@type": "HowToStep", name: "Open the PDF in Preview", text: "Right-click the file → Open With → Preview." },
      { "@type": "HowToStep", name: "Show the markup toolbar", text: "Click the pencil icon at the top-right to reveal text, shapes and signature tools." },
      { "@type": "HowToStep", name: "Add text or edit annotations", text: "Choose the T tool, drag a text box on the page and type. Reposition anywhere on the page." },
      { "@type": "HowToStep", name: "Sign the document", text: "Click Signature → Create Signature via trackpad or camera and drag it onto the page." },
      { "@type": "HowToStep", name: "Reorder or delete pages", text: "Open the sidebar (View → Thumbnails), drag pages to reorder or press Delete to remove." },
      { "@type": "HowToStep", name: "Export the result", text: "File → Export as PDF to save your edited copy." },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I edit PDF text on Mac for free?",
        acceptedAnswer: { "@type": "Answer", text: "Preview lets you annotate and add text boxes for free. To edit existing text inside the PDF (change wording of the original document body), use Docunova AI's Edit PDF tool in your browser — it runs locally and is free with no size limit." },
      },
      {
        "@type": "Question",
        name: "Is Preview enough or do I need Adobe Acrobat?",
        acceptedAnswer: { "@type": "Answer", text: "Preview handles annotations, signatures, form filling, page reordering and merging. For editing embedded text, replacing images, OCR on scans and compression, use a free online editor instead of paying for Acrobat." },
      },
      {
        "@type": "Question",
        name: "How do I edit a scanned PDF on Mac?",
        acceptedAnswer: { "@type": "Answer", text: "A scan is an image. Run it through Docunova AI's OCR tool first — it converts the scan into a searchable, editable PDF you can then modify like any normal document." },
      },
      {
        "@type": "Question",
        name: "Will the online editor upload my file?",
        acceptedAnswer: { "@type": "Answer", text: "No. Docunova AI processes PDFs in your browser using WebAssembly. The file never leaves your Mac, which is why there are no size caps." },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How to Edit a PDF on Mac for Free (2026 Guide)</title>
        <meta
          name="description"
          content="Edit PDFs on macOS for free — annotate, sign, add text and reorder pages with Preview, or use Docunova AI in your browser for full editing, OCR and compression."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="How to Edit a PDF on Mac for Free (2026 Guide)" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:description" content="Free ways to edit PDFs on Mac using Preview and Docunova AI — text, signatures, page reordering and OCR." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs />

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">
            How to Edit a PDF on Mac for Free
          </h1>
          <p className="text-lg text-muted-foreground">
            The complete 2026 guide to editing PDFs on macOS — using the free Preview app that ships
            with every Mac, and Docunova AI when you need full text editing, OCR or compression without
            paying for Adobe Acrobat.
          </p>

          <Card className="not-prose my-6 border-primary/30">
            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold">Prefer to skip Preview's limits?</p>
                <p className="text-sm text-muted-foreground">Edit any PDF free in your browser — no install, no size cap, files stay on your Mac.</p>
              </div>
              <Button asChild size="lg">
                <Link to="/edit-pdf">Open Free PDF Editor <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <h2>Option 1 — Edit a PDF on Mac with Preview (built-in)</h2>
          <p>
            Preview is the free PDF and image viewer built into macOS. It handles the everyday
            editing tasks most people need: adding text, filling forms, signing, highlighting,
            merging PDFs and reordering pages. Here's the workflow.
          </p>

          <h3>Step 1 — Open the PDF in Preview</h3>
          <p>Double-click any PDF in Finder (Preview is the default), or right-click → <em>Open With → Preview</em> if you set another default.</p>

          <h3>Step 2 — Show the markup toolbar</h3>
          <p>Click the pencil icon at the top-right of the window (or <kbd>⇧⌘A</kbd>). The markup bar exposes text, shapes, signature and highlight tools.</p>

          <h3>Step 3 — Add text, shapes and highlights</h3>
          <ul>
            <li><strong>Text:</strong> click the <em>T</em> icon, drag a text box, type. Change font/size from the <em>A</em> button.</li>
            <li><strong>Shapes:</strong> arrows, rectangles and speech bubbles from the shapes menu.</li>
            <li><strong>Highlight:</strong> select text and press the highlighter icon.</li>
          </ul>

          <h3>Step 4 — Sign the PDF</h3>
          <p>Click <em>Signature → Create Signature</em>. You can draw on your trackpad, hold a hand-signed paper up to your webcam, or use an iPhone. Drag the saved signature onto the page and resize.</p>

          <h3>Step 5 — Reorder, delete or insert pages</h3>
          <p>Open <em>View → Thumbnails</em>. Drag pages up or down to reorder, press <kbd>Delete</kbd> to remove one, or drag another PDF into the sidebar to merge.</p>

          <h3>Step 6 — Save as a new PDF</h3>
          <p><em>File → Export as PDF…</em> keeps your original untouched. If the file is too large to email, use <em>Quartz Filter → Reduce File Size</em>.</p>

          <h2>What Preview can <em>not</em> do</h2>
          <ul>
            <li>Edit the actual body text of the original document (only overlaid annotations).</li>
            <li>Replace or edit embedded images.</li>
            <li>OCR a scanned PDF into searchable text.</li>
            <li>Compress precisely by a target size.</li>
            <li>Convert PDF ↔ Word, Excel or PowerPoint.</li>
          </ul>
          <p>For any of those, jump to Option 2.</p>

          <h2>Option 2 — Edit a PDF on Mac in the browser (free, no install)</h2>
          <p>
            <Link to="/">Docunova AI</Link> runs entirely in Safari, Chrome or Firefox on macOS. Files are
            processed locally with WebAssembly — nothing uploads to a server — so it works with big
            PDFs and stays private. Every tool below is 100% free with no size limit.
          </p>

          <div className="not-prose grid sm:grid-cols-2 gap-3 my-4">
            {[
              { to: "/edit-pdf", title: "Edit PDF", desc: "Add/replace text, images, shapes and signatures" },
              { to: "/ocr", title: "OCR Scanned PDF", desc: "Turn a scan into searchable, editable text" },
              { to: "/compress", title: "Compress PDF", desc: "Shrink big Preview exports for email" },
              { to: "/merge", title: "Merge PDF", desc: "Combine multiple PDFs into one" },
              { to: "/split", title: "Split PDF", desc: "Extract pages or split by range" },
              { to: "/convert", title: "PDF ↔ Word / Excel", desc: "Convert to Office formats and back" },
            ].map(t => (
              <Link key={t.to} to={t.to} className="block p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />{t.title}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </Link>
            ))}
          </div>

          <h2>Preview vs Docunova AI — which should you use?</h2>
          <table>
            <thead>
              <tr><th>Task</th><th>macOS Preview</th><th>Docunova AI</th></tr>
            </thead>
            <tbody>
              <tr><td>Annotate / highlight</td><td>✅</td><td>✅</td></tr>
              <tr><td>Fill forms</td><td>✅</td><td>✅</td></tr>
              <tr><td>Sign PDF</td><td>✅</td><td>✅</td></tr>
              <tr><td>Reorder / delete pages</td><td>✅</td><td>✅</td></tr>
              <tr><td>Edit real body text</td><td>❌</td><td>✅</td></tr>
              <tr><td>Replace embedded images</td><td>❌</td><td>✅</td></tr>
              <tr><td>OCR scanned PDFs</td><td>❌</td><td>✅</td></tr>
              <tr><td>Precise compression</td><td>Limited</td><td>✅</td></tr>
              <tr><td>Convert to Word / Excel</td><td>❌</td><td>✅</td></tr>
              <tr><td>Cost</td><td>Free (built-in)</td><td>Free, no size limit</td></tr>
            </tbody>
          </table>

          <h2>Tips for a smooth workflow on macOS</h2>
          <ul>
            <li>Use <em>iCloud Drive</em> to open the same PDF on iPhone/iPad via Preview markup handoff.</li>
            <li>Duplicate the file (<kbd>⌘D</kbd>) before editing so the original stays intact.</li>
            <li>If Preview's exported PDF is too big, run it through <Link to="/compress">Compress PDF</Link> — usually a 40–80% reduction.</li>
            <li>Scanned document? Always OCR first, otherwise "text" edits are just image overlays.</li>
          </ul>

          <h2>Frequently asked questions</h2>
          <h3>Can I edit a PDF on Mac without downloading anything?</h3>
          <p>Yes — Preview is preinstalled, and Docunova AI runs in the browser. Neither requires a download.</p>

          <h3>Is there a free alternative to Adobe Acrobat on Mac?</h3>
          <p>Yes. Preview covers everyday needs; Docunova AI covers the advanced ones Acrobat is usually bought for — full text editing, OCR, compression, format conversion — free with no page or size limits.</p>

          <h3>Is it safe to edit PDFs online?</h3>
          <p>With Docunova AI the file never leaves your Mac — editing happens in the browser via WebAssembly. That's why the tools work offline once loaded and have no size cap.</p>

          <h3>How do I edit a PDF form on Mac?</h3>
          <p>Open it in Preview, click any field and type. Save with <em>File → Export as PDF</em>. Non-fillable forms can be filled with Preview's text tool.</p>

          <div className="not-prose mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to edit your PDF?</h3>
                <p className="text-muted-foreground mb-4">Free forever. No signup. No file size limit. Runs on macOS Safari, Chrome and Firefox.</p>
                <Button asChild size="lg"><Link to="/edit-pdf">Open Free PDF Editor</Link></Button>
              </CardContent>
            </Card>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default GuideEditPdfOnMacFree;
