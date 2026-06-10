import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Home } from "lucide-react";
import { CATEGORY_META, getToolsByCategory, ToolCategory } from "@/lib/toolRegistry";

const VALID: ToolCategory[] = ["organize", "convert", "edit", "ai", "image", "security", "documents"];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || !VALID.includes(slug as ToolCategory)) {
    return <Navigate to="/" replace />;
  }
  const category = slug as ToolCategory;
  const meta = CATEGORY_META[category];
  const tools = getToolsByCategory(category);

  const url = `https://document-edit-in.lovable.app/category/${category}`;
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `https://document-edit-in.lovable.app${t.slug}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>{meta.title} | Free Online — PDF Tools</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-24">
          {/* Hero */}
          <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="container max-w-4xl mx-auto px-6 text-center">
              <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                <Link to="/" className="inline-flex items-center gap-1 hover:text-primary">
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <ArrowRight className="w-3 h-3" />
                <span className="text-foreground">{meta.title}</span>
              </nav>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> {tools.length} free tools
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{meta.hero}</h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">{meta.tagline}</p>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{meta.intro}</p>
              <Button asChild size="lg" className="rounded-xl">
                <a href="#tools">{meta.cta}</a>
              </Button>
            </div>
          </section>

          {/* Tools grid */}
          <section id="tools" className="py-16">
            <div className="container max-w-6xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">All {meta.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((t) => (
                  <Link key={t.slug} to={t.slug} className="group">
                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {t.name}
                          </h3>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{t.short}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA back to home */}
          <section className="py-12 bg-muted/30">
            <div className="container max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-xl font-semibold mb-3">Looking for something else?</h2>
              <p className="text-muted-foreground mb-6">
                See all 80+ free PDF, image, AI and document tools on the homepage.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Browse all tools</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;
