import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, User, Mail, ShieldCheck } from "lucide-react";

export interface LegalSection {
  id: string;
  heading: string;
  /** Plain paragraphs + bullet lists. Use \n\n between paragraphs. Use "- " prefix for bullets. */
  body: string;
}

interface Props {
  slug: string;
  title: string;
  description: string;
  updated: string; // ISO date
  intro: string;
  sections: LegalSection[];
  contactNote?: string;
}

const BASE = "https://document-edit-in.lovable.app";

function renderBlock(text: string, idx: number) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (trimmed.split("\n").every((l) => l.trim().startsWith("- "))) {
    return (
      <ul key={idx} className="list-disc pl-6 space-y-2 text-muted-foreground">
        {trimmed.split("\n").map((l, i) => (
          <li key={i}>{l.replace(/^\s*-\s*/, "")}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={idx} className="text-muted-foreground leading-relaxed">
      {trimmed}
    </p>
  );
}

const LegalPage = ({ slug, title, description, updated, intro, sections, contactNote }: Props) => {
  const url = `${BASE}/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    dateModified: updated,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Document Edit Pro AI", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "Document Edit Pro AI",
      url: BASE,
    },
    author: {
      "@type": "Person",
      name: "Aman Vishwakarma",
      jobTitle: "Founder & Editor",
      url: `${BASE}/about`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Legal", item: `${BASE}/legal` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  };

  const updatedLabel = new Date(updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Helmet>
        <title>{`${title} — Document Edit Pro AI`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${title} — Document Edit Pro AI`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-6xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Legal</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">{title}</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <Badge variant="outline" className="mb-3">
                <ShieldCheck className="w-3 h-3 mr-1" /> Legal & Policies
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">{intro}</p>
              <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Last updated: <strong className="text-foreground">{updatedLabel}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Maintained by{" "}
                  <Link to="/about" className="text-primary hover:underline font-medium">Aman Vishwakarma</Link>
                  {" "}& the Editorial Team
                </span>
              </div>
            </header>

            <div className="grid lg:grid-cols-[260px_1fr] gap-10">
              {/* TOC */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <Card>
                  <CardContent className="pt-5">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      On this page
                    </h2>
                    <ul className="space-y-2 text-sm">
                      {sections.map((s) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary transition">
                            {s.heading}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </aside>

              {/* Content */}
              <article className="space-y-10">
                {sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-28">
                    <h2 className="text-2xl font-semibold mb-4">{s.heading}</h2>
                    <div className="space-y-4">
                      {s.body.split(/\n{2,}/).map((block, i) => renderBlock(block, i))}
                    </div>
                  </section>
                ))}

                {/* Contact CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Questions about this policy?</h3>
                        <p className="text-sm text-muted-foreground">
                          {contactNote ?? "We reply to every legitimate request within 48 business hours."}
                        </p>
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
                      >
                        <Mail className="w-4 h-4" /> Contact support
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-xs text-muted-foreground border-t border-border pt-6">
                  This page is maintained by the Document Edit Pro AI editorial team and reflects current product
                  behavior. It is informational and is not a substitute for legal advice; please consult a qualified
                  professional for advice specific to your situation.
                </p>
              </article>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LegalPage;
