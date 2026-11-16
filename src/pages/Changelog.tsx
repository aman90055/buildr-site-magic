import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHANGELOG, type ChangeTag } from "@/lib/changelog";

const tagVariant: Record<ChangeTag, "default" | "secondary" | "outline" | "destructive"> = {
  feature: "default",
  fix: "destructive",
  improvement: "secondary",
  accuracy: "outline",
};

const tagLabel: Record<ChangeTag, string> = {
  feature: "New",
  fix: "Fix",
  improvement: "Improvement",
  accuracy: "Accuracy",
};

const Changelog = () => (
  <>
    <Helmet>
      <title>Changelog — What changed in Docunova</title>
      <meta
        name="description"
        content="Dated list of Docunova updates: tool repairs, new guides, corrected claims and layout fixes, newest first."
      />
      <link rel="canonical" href="https://docunova.online/changelog" />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">Changelog</h1>
        <p className="text-center text-muted-foreground mb-2">
          What we changed and why, newest first. Dates are when the change was made.
        </p>
        <p className="text-center text-sm text-muted-foreground mb-10">
          Found a problem? Tell us through <Link to="/support" className="text-primary underline">support chat</Link> or the{" "}
          <Link to="/contact" className="text-primary underline">contact form</Link>.
        </p>
        <div className="space-y-6">
          {CHANGELOG.map((r) => (
            <Card key={r.date + r.title}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl">{r.title}</CardTitle>
                  <time dateTime={r.date} className="text-sm text-muted-foreground">
                    {new Date(r.date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                  </time>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.tags.map((t) => (
                    <Badge key={t} variant={tagVariant[t]}>{tagLabel[t]}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1.5 text-sm">
                  {r.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">
          Updates made before September 2026 are not listed here.
        </p>
      </main>
      <Footer />
    </div>
  </>
);

export default Changelog;
