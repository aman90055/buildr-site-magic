import { Helmet } from "react-helmet-async";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface FAQ { q: string; a: string }
interface RelatedTool { name: string; href: string }

interface Props {
  title: string;
  description: string;
  heading: string;
  intro?: string;
  children: ReactNode;
  guide?: string;
  faqs?: FAQ[];
  related?: RelatedTool[];
  canonical?: string;
}

export default function ToolShell({ title, description, heading, intro, children, guide, faqs, related, canonical }: Props) {
  const faqJsonLd = faqs && faqs.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  } : null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {faqJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground flex items-center gap-1">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{heading}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{heading}</h1>
            {intro && <p className="text-muted-foreground mb-6">{intro}</p>}
            <Card className="p-5 md:p-6 mb-8">{children}</Card>

            {guide && (
              <section className="prose prose-sm dark:prose-invert max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-2">How it works</h2>
                {guide.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </section>
            )}

            {faqs && faqs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">FAQ</h2>
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <details key={i} className="rounded-lg border p-3">
                      <summary className="font-medium cursor-pointer">{f.q}</summary>
                      <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {related && related.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Related tools</h2>
                <div className="flex flex-wrap gap-2">
                  {related.map((r) => (
                    <Link key={r.href} to={r.href} className="text-sm px-3 py-1.5 rounded-full border hover:bg-accent transition">
                      {r.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
