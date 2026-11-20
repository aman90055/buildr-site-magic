import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, ShieldCheck, Cloud, Brain } from "lucide-react";
const faqs = [
  { q: "Do I need an account or payment?", a: "Core PDF tools including Merge, Split and Compress are free without sign-in. There is no app-defined file-size cap or daily processing quota. Large jobs depend on your device’s memory. AI tools have separate input and request limits and may require sign-in." },
  { q: "Where do my documents go?", a: "Merge, Split and Compress process PDFs in your browser. When you are signed in, their finished PDFs are also uploaded to private account storage and listed in your history. AI and OCR tools send submitted content to an online service. We do not promise automatic deletion after one hour." },
  { q: "Does compression keep the original quality?", a: "Less compression uses lossless processing and may make only a small difference. Stronger compression can rebuild pages as images, reducing quality and removing selectable text. Reduction varies by file; check the result before sharing it." },
  { q: "Will a converted document look exactly the same?", a: "Not always. PDF-to-Word extracts text, PDF-to-Excel approximates rows, and PDF-to-PowerPoint uses page images. Office-to-PDF output is image-based. Review the individual tool’s limitations and compare your download with the original." },
];
const cards = [
  { icon: ShieldCheck, tone: "bg-brand-green/10 text-brand-green", title: "Local PDF processing", text: "Merge, Split and Compress run in your browser. No sign-in is needed; device memory affects large files." },
  { icon: Cloud, tone: "bg-brand-blue/10 text-brand-blue", title: "Signed-in storage", text: "When signed in, completed Merge, Split and Compress PDFs also save to your private account storage and history." },
  { icon: Brain, tone: "bg-brand-purple/10 text-brand-purple", title: "Online AI & OCR", text: "Submitted text or images go to an online AI service. Sign-in, request limits and input limits depend on the tool." },
];
const HomeContent = () => (
  <>
    <section className="border-y border-border bg-muted/30 py-12 sm:py-16" aria-labelledby="privacy-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="privacy-heading" className="font-display text-2xl font-bold sm:text-3xl">Your files. Clear choices.</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Three things happen to a document here, depending on the tool you open.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, tone, title, text }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
              <span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <Link to="/privacy" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">Read our privacy policy<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="home-faq-heading">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <h2 id="home-faq-heading" className="font-display text-2xl font-bold sm:text-3xl">Before you start</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Straight answers on cost, storage, quality and what a converted file keeps.</p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to="/help" className="text-primary hover:underline">Help center</Link>
            <Link to="/support" className="text-primary hover:underline">Contact support</Link>
            <Link to="/blog" className="text-primary hover:underline">Document guides</Link>
          </div>
        </div>
        <Accordion type="single" collapsible className="rounded-2xl border border-border/60 bg-card/60 px-5 backdrop-blur-sm">
          {faqs.map(({ q, a }, index) => (
            <AccordionItem key={q} value={`home-faq-${index}`}>
              <AccordionTrigger className="text-left">{q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) }} />
  </>
);
export default HomeContent;
