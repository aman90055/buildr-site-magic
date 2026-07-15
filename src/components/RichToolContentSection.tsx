import { Helmet } from "react-helmet-async";
import { Clock, User, CalendarDays, CheckCircle2, AlertTriangle, Lightbulb, Sparkles, ListChecks } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getRichContent, AUTHOR, LAST_UPDATED, readingMinutes } from "@/lib/richToolContent";

interface Props { slug: string }

/**
 * Rich AdSense-compliant long-form content block:
 * intro, what/why, tutorial, best practices, mistakes, pro tips, use cases,
 * FAQs (12), author, last-updated, reading time, Article + FAQPage JSON-LD.
 */
const RichToolContentSection = ({ slug }: Props) => {
  const c = getRichContent(slug);
  if (!c) return null;

  const bodyText = [c.introduction, c.whatIsIt, c.whyUse, ...(c.tutorial ?? []),
    ...(c.bestPractices ?? []), ...(c.mistakes ?? []), ...(c.proTips ?? []),
    ...(c.useCases ?? []), ...(c.faqs ?? []).map(f => f.q + " " + f.a)]
    .filter(Boolean).join(" ");
  const mins = readingMinutes(bodyText);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.name} — Complete Guide`,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Organization", name: "The Docunova AI Suite" },
    datePublished: LAST_UPDATED,
    dateModified: LAST_UPDATED,
    mainEntityOfPage: `https://docunova-ai.lovable.app${slug}`,
  };
  const faqSchema = c.faqs && c.faqs.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: c.faqs.map(f => ({ "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <section className="border-t border-border bg-background" aria-labelledby="rich-guide">
        <div className="container mx-auto max-w-4xl px-6 py-12">
          {/* Author / meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-1.5"><User className="w-4 h-4" /> By <a href={AUTHOR.url} rel="author" className="text-primary hover:underline">{AUTHOR.name}</a></span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Updated {LAST_UPDATED}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {mins} min read</span>
          </div>

          <h2 id="rich-guide" className="text-3xl font-bold mb-6">{c.name} — Complete Guide</h2>

          {/* TOC */}
          <nav className="mb-8 rounded-lg border border-border bg-muted/30 p-4" aria-label="Table of contents">
            <p className="text-sm font-semibold mb-2 inline-flex items-center gap-1.5"><ListChecks className="w-4 h-4" /> On this page</p>
            <ol className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground list-decimal list-inside">
              <li><a href="#intro" className="hover:text-primary">Introduction</a></li>
              <li><a href="#what" className="hover:text-primary">What is {c.name}?</a></li>
              <li><a href="#why" className="hover:text-primary">Why use it</a></li>
              <li><a href="#tutorial" className="hover:text-primary">Step-by-step tutorial</a></li>
              <li><a href="#best" className="hover:text-primary">Best practices</a></li>
              <li><a href="#mistakes" className="hover:text-primary">Common mistakes</a></li>
              <li><a href="#tips" className="hover:text-primary">Pro tips</a></li>
              <li><a href="#cases" className="hover:text-primary">Real-world use cases</a></li>
              <li><a href="#faq" className="hover:text-primary">FAQs</a></li>
            </ol>
          </nav>

          <article className="prose prose-slate dark:prose-invert max-w-none">
            {c.introduction && (<><h3 id="intro">Introduction</h3><p>{c.introduction}</p></>)}
            {c.whatIsIt && (<><h3 id="what">What is {c.name}?</h3><p>{c.whatIsIt}</p></>)}
            {c.whyUse && (<><h3 id="why">Why use {c.name}?</h3><p>{c.whyUse}</p></>)}

            {c.tutorial && c.tutorial.length > 0 && (
              <><h3 id="tutorial">Step-by-step tutorial</h3>
              <ol>{c.tutorial.map((s, i) => <li key={i}>{s}</li>)}</ol></>
            )}

            {c.bestPractices && c.bestPractices.length > 0 && (
              <><h3 id="best" className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary inline" /> Best practices</h3>
              <ul>{c.bestPractices.map((s, i) => <li key={i}>{s}</li>)}</ul></>
            )}

            {c.mistakes && c.mistakes.length > 0 && (
              <><h3 id="mistakes" className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500 inline" /> Common mistakes to avoid</h3>
              <ul>{c.mistakes.map((s, i) => <li key={i}>{s}</li>)}</ul></>
            )}

            {c.proTips && c.proTips.length > 0 && (
              <><h3 id="tips" className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary inline" /> Professional tips</h3>
              <ul>{c.proTips.map((s, i) => <li key={i}>{s}</li>)}</ul></>
            )}

            {c.useCases && c.useCases.length > 0 && (
              <><h3 id="cases" className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary inline" /> Real-world use cases</h3>
              <ul>{c.useCases.map((s, i) => <li key={i}>{s}</li>)}</ul></>
            )}
          </article>

          {c.faqs && c.faqs.length > 0 && (
            <div id="faq" className="mt-10">
              <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {c.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`rf-${i}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RichToolContentSection;
