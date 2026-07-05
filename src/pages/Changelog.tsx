import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Release { version: string; date: string; tags: ("feature"|"fix"|"improvement"|"security")[]; items: string[] }

const releases: Release[] = [
  {
    version: "v2.6.0", date: "30 June 2026", tags: ["feature", "improvement"],
    items: [
      "Responsive Adsterra units (728×90 on desktop, native on mobile)",
      "Admin Adsterra on/off toggle to avoid AdSense policy conflicts",
      "Ad performance dashboard — impressions, clicks, CTR per placement",
      "Public Roadmap, Changelog, Help Center & Newsletter pages",
      "Admin tool-usage analytics — top tools by job count",
    ],
  },
  {
    version: "v2.5.0", date: "20 June 2026", tags: ["feature"],
    items: [
      "Daily check-in credits with streak bonuses",
      "Owner revenue dashboard — MTD/LTD/Conversions + daily chart",
      "User dashboard tabs — History, Favorites, Notifications, API Keys",
    ],
  },
  {
    version: "v2.4.0", date: "1 June 2026", tags: ["feature", "security"],
    items: [
      "Razorpay live payments (UPI + global cards)",
      "RBAC user_roles + has_role() function, hardened RLS across all tables",
      "AI compression analyze: Zod validation + filename sanitization",
    ],
  },
  {
    version: "v2.3.0", date: "15 May 2026", tags: ["feature", "improvement"],
    items: [
      "AI suite: Summarizer, Translator, Grammar, Rewriter, Data extractor",
      "Local pdfjs-dist ESM worker (fixes CDN-related blank screens)",
      "1500+ words homepage content + per-tool SEO guides & FAQ schemas",
    ],
  },
];

const tagColor: Record<Release["tags"][number], string> = {
  feature: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  fix: "bg-red-500/15 text-red-600 border-red-500/30",
  improvement: "bg-green-500/15 text-green-600 border-green-500/30",
  security: "bg-amber-500/15 text-amber-600 border-amber-500/30",
};

const Changelog = () => (
  <>
    <Helmet>
      <title>Changelog — The Docunova AI Suite</title>
      <meta name="description" content="Every release of The Docunova AI Suite — new tools, fixes, and improvements." />
      <link rel="canonical" href="https://document-edit-in.lovable.app/changelog" />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">Changelog</h1>
        <p className="text-center text-muted-foreground mb-10">Every shipped update, newest first.</p>
        <div className="space-y-6">
          {releases.map((r) => (
            <Card key={r.version}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl">{r.version}</CardTitle>
                  <span className="text-sm text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.tags.map((t) => (
                    <Badge key={t} variant="outline" className={`border ${tagColor[t]} capitalize`}>{t}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {r.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default Changelog;
