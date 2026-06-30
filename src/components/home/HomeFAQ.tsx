import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "Is Document Edit Pro AI really free?",
    a: "Yes. Every core PDF and document tool is 100% free with no daily limit, no watermark, and no signup wall. Pro plans unlock advanced AI quotas and team features but never lock the basics.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "Most tools (merge, split, compress, convert, sign, watermark, redact) run entirely in your browser using WebAssembly. Files never leave your device. AI tools that need a model send only the necessary content over an encrypted connection and are deleted immediately after processing.",
  },
  {
    q: "Is there a file size limit?",
    a: "No. Unlike most competitors we don't cap file size. You can merge a 500 MB scan or compress a 1 GB design file directly in your browser.",
  },
  {
    q: "Which AI models power the AI tools?",
    a: "We route to frontier hosted models (Gemini 2.5, GPT-class and Llama) through Lovable AI Gateway with managed keys, so you never need to bring your own API key.",
  },
  {
    q: "Do you support team plans, GST invoices, and Indian payments?",
    a: "Yes. Razorpay handles UPI, Google Pay, PhonePe, Paytm, cards and net banking. We issue GST-compliant invoices and support annual team plans with role management and audit logs.",
  },
  {
    q: "Can I use Document Edit Pro AI for commercial work?",
    a: "Absolutely. Free and Pro tiers permit unlimited commercial use. Outputs (PDFs, signatures, AI text, images) belong to you with no attribution required.",
  },
];

export default function HomeFAQ() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" aria-label="Frequently asked questions" className="py-16 sm:py-24">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about pricing, privacy, and our 100+ tools.
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass-card rounded-3xl border border-border/60 p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium hover:no-underline px-3 sm:px-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed px-3 sm:px-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
