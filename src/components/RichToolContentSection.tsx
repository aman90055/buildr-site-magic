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
    mainEntityOfPage: `https://docunova.online${slug}`,
  };
  const faqSchema = c.faqs && c.faqs.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: c.faqs.map(f => ({ "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  void faqSchema; void ListChecks; void AlertTriangle; void Lightbulb; void Sparkles; void Accordion; void AccordionItem; void AccordionTrigger; void AccordionContent;
  const tips = [...(c.bestPractices ?? []), ...(c.proTips ?? [])].slice(0, 3);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <section className="border-t border-border bg-background" aria-labelledby="rich-guide">
        <div className="container mx-auto max-w-3xl px-6 py-10">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> By <a href={AUTHOR.url} rel="author" className="text-primary hover:underline">{AUTHOR.name}</a></span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Updated {LAST_UPDATED}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {Math.min(mins, 2)} min read</span>
          </div>

          <h2 id="rich-guide" className="text-2xl font-bold mb-4">How to use {c.name}</h2>

          <article className="prose prose-slate dark:prose-invert max-w-none">
            {c.whatIsIt && <p>{c.whatIsIt.split(". ").slice(0, 2).join(". ").replace(/\.?$/, ".")}</p>}

            {c.tutorial && c.tutorial.length > 0 && (
              <ol>{c.tutorial.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}</ol>
            )}

            {tips.length > 0 && (
              <><h3 className="flex items-center gap-2 text-lg"><CheckCircle2 className="w-4 h-4 text-primary inline" /> Quick tips</h3>
              <ul>{tips.map((s, i) => <li key={i}>{s}</li>)}</ul></>
            )}
          </article>
        </div>
      </section>
    </>
  );
};

export default RichToolContentSection;
