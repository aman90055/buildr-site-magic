import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

export interface AlternativeLandingProps {
  /** Competitor / brand the searcher typed, e.g. "iLovePDF" */
  brand: string;
  /** Path with leading slash, e.g. "/ilovepdf-alternative" */
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  /** Comparison rows: what searchers usually care about */
  comparison: { feature: string; docunova: string; typical: string }[];
  /** Matching tools on Docunova */
  tools: { name: string; to: string; blurb: string }[];
  sections: { heading: string; body: string[] }[];
  faqs: { q: string; a: string }[];
}

const SITE = "https://docunova.online";

const AlternativeLanding = ({
  brand,
  path,
  metaTitle,
  metaDescription,
  h1,
  intro,
  comparison,
  tools,
  sections,
  faqs,
}: AlternativeLandingProps) => {
  const url = `${SITE}${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: metaTitle,
        url,
        description: metaDescription,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Docunova AI", url: SITE },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/tools` },
          { "@type": "ListItem", position: 3, name: `${brand} alternative`, item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: `Docunova tools comparable to ${brand}`,
        itemListElement: tools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `${SITE}${t.to}`,
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 container max-w-4xl">
          <Breadcrumbs />

          <h1 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">{h1}</h1>

          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            {intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            <Button asChild size="lg">
              <Link to="/tools">
                Browse all 100+ free tools <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/merge">Try Merge PDF now</Link>
            </Button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Docunova AI vs typical online PDF suites</h2>
          <div className="overflow-x-auto mb-12 rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold">What people compare</th>
                  <th className="text-left p-3 font-semibold">Docunova AI</th>
                  <th className="text-left p-3 font-semibold">Typical free web suites</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-t">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3">{row.docunova}</td>
                    <td className="p-3 text-muted-foreground">{row.typical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground -mt-8 mb-12">
            Comparison describes Docunova AI's own behaviour and the patterns commonly seen in free
            browser-based document suites. Always check {brand}'s current documentation for their
            latest limits and pricing — third-party terms change often.
          </p>

          <h2 className="text-2xl font-bold mb-4">The tools most people are looking for</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {tools.map((t) => (
              <Card key={t.to} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <Link to={t.to} className="font-semibold hover:text-primary">
                    {t.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{t.blurb}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {sections.map((s) => (
            <section key={s.heading} className="mb-10">
              <h2 className="text-2xl font-bold mb-3">{s.heading}</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold flex gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {f.q}
                  </h3>
                  <p className="text-muted-foreground mt-1 ml-7 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-xl border p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Start with any file, no account needed</h2>
            <p className="text-muted-foreground mb-4">
              Every tool on Docunova AI is free, with no page caps or file-size limits.
            </p>
            <Button asChild size="lg">
              <Link to="/">Open the tool dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AlternativeLanding;
