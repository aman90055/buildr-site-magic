import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home, ArrowRight } from "lucide-react";
import { getToolMeta, CATEGORY_META } from "@/lib/toolRegistry";
import RelatedTools from "@/components/RelatedTools";

/**
 * Auto-mounted on every tool page (via Footer).
 * Renders: 200+ word usage guide, FAQ accordion, FAQPage JSON-LD,
 * "back to home" link, and category landing-page link.
 * Returns null on non-tool routes.
 */
const ToolSEOSection = () => {
  const { pathname } = useLocation();
  const meta = getToolMeta(pathname);
  if (!meta) return null;

  const category = CATEGORY_META[meta.category];
  const categoryPath = `/category/${meta.category}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: meta.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://document-edit-in.lovable.app/" },
      { "@type": "ListItem", position: 2, name: category.title, item: `https://document-edit-in.lovable.app${categoryPath}` },
      { "@type": "ListItem", position: 3, name: meta.name, item: `https://document-edit-in.lovable.app${meta.slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <section className="border-t border-border bg-background" aria-labelledby="tool-guide-heading">
        <div className="container mx-auto max-w-4xl px-6 py-12">
          {/* Breadcrumb / contextual links */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ArrowRight className="w-3 h-3" />
            <Link to={categoryPath} className="hover:text-primary transition-colors">
              {category.title}
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{meta.name}</span>
          </nav>

          {/* Usage guide (200+ words) */}
          <article className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2 id="tool-guide-heading" className="text-2xl md:text-3xl font-bold mb-4">
              About {meta.name}
            </h2>
            {meta.guide.split("\n\n").map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
            ))}
            <p className="text-sm">
              Browse more in{" "}
              <Link to={categoryPath} className="text-primary hover:underline font-medium">
                {category.title}
              </Link>{" "}
              or return to the{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                homepage
              </Link>{" "}
              to see all 80+ free tools.
            </p>
          </article>

          {/* FAQ accordion */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {meta.faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Related tools — same-category siblings */}
        <RelatedTools
          currentSlug={meta.slug}
          category={meta.category.charAt(0).toUpperCase() + meta.category.slice(1)}
          limit={6}
          title="Related Tools"
        />
      </section>
    </>
  );
};

export default ToolSEOSection;
