import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Sparkles,
  Shield,
  Zap,
  Globe,
  FileText,
  ArrowRight,
  Github,
  Twitter,
  MessageCircle,
} from "lucide-react";

/**
 * Product Hunt launch page — /launch
 * Public-facing page with strong value prop, quotable features,
 * embeddable badges, and social CTAs. Meant to convert PH / HN /
 * Reddit visitors into first-time users.
 */

const url = "https://docunova-ai.lovable.app/launch";

const highlights = [
  { icon: Sparkles, title: "100+ AI-powered tools", body: "PDF, image, document, and AI utilities in one suite." },
  { icon: Shield, title: "Private by default", body: "Files are processed in your browser — nothing uploaded for most tools." },
  { icon: Zap, title: "No limits, no signup", body: "Unlimited file size, no daily quota, no 'upgrade to continue' walls." },
  { icon: Globe, title: "100+ languages", body: "AI translator, OCR, and voice input support Hindi, English, Spanish, Arabic, and more." },
  { icon: FileText, title: "Real edits, real output", body: "Merge, split, compress, OCR, sign, edit — all with real, downloadable results." },
  { icon: Rocket, title: "Built solo", body: "Made by an independent developer to prove great tools don't need a paywall." },
];

const testimonialSlots = [
  { quote: "Finally a PDF editor that doesn't ask me to sign up before I can even try it.", who: "Product Hunt user" },
  { quote: "Compressed my 40 MB PDF to 3 MB without any quality loss. Free. Wild.", who: "Reddit r/productivity" },
  { quote: "The OCR handled my Hindi scanned document better than Google Docs.", who: "Twitter @user" },
];

const Launch = () => {
  return (
    <>
      <Helmet>
        <title>Docunova AI — Launch Day 🚀 100+ Free AI Document Tools, No Signup</title>
        <meta
          name="description"
          content="We're launching Docunova AI — 100+ AI-powered PDF, image, and document tools. Free forever, no signup, no file-size limits. Try it in your browser."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Docunova AI — 100+ Free AI Document Tools, No Signup 🚀" />
        <meta property="og:description" content="Merge, edit, compress, OCR, translate — all free, all in your browser. Support our launch on Product Hunt." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Hero */}
            <section className="text-center mb-16">
              <Badge className="mb-4 gap-1"><Rocket className="w-3 h-3" /> Launching now</Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Docunova AI is <span className="text-gradient-ai">live</span> 🎉
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                100+ AI-powered document tools. Free forever. No signup. No limits.
                Made for anyone tired of paywalls on basic PDF tasks.
              </p>

              <div className="flex flex-wrap gap-3 justify-center mb-10">
                <Button asChild size="lg" className="text-base">
                  <Link to="/tools">
                    Try all 100+ tools <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <a
                    href="https://www.producthunt.com/posts/docunova-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🚀 Upvote on Product Hunt
                  </a>
                </Button>
              </div>

              {/* Metric strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { n: "100+", l: "AI tools" },
                  { n: "0", l: "Signups required" },
                  { n: "∞", l: "File size" },
                  { n: "100+", l: "Languages" },
                ].map((m) => (
                  <div key={m.l} className="p-4 rounded-xl bg-muted/30">
                    <div className="text-3xl font-bold text-primary">{m.n}</div>
                    <div className="text-sm text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Story / founder note */}
            <section className="mb-16">
              <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 md:p-10">
                  <h2 className="text-2xl font-bold mb-4">Why I built this</h2>
                  <p className="text-muted-foreground mb-3">
                    Every "free" PDF tool online eventually asked me for an email, a
                    credit card, or to accept a watermark. That's fine for a company
                    with servers to pay for — but most PDF work (merge, compress, sign,
                    convert) can happen entirely in the browser. There's no reason it
                    should cost anything.
                  </p>
                  <p className="text-muted-foreground mb-3">
                    So I built <strong>Docunova AI</strong> — 100+ tools that run
                    client-side wherever possible, plus AI features (OCR, translate,
                    summarize) powered by a shared AI gateway. No signup. No file-size
                    limit. No dark patterns.
                  </p>
                  <p className="text-muted-foreground">
                    If it saves you five minutes today, that's the whole point. If you
                    want to help back the project, an upvote on Product Hunt or a share
                    on Twitter means the world.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">— Aman Vishwakarma, solo maker</p>
                </CardContent>
              </Card>
            </section>

            {/* Highlights */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">What makes it different</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highlights.map(({ icon: Icon, title, body }) => (
                  <Card key={title}>
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Popular tools */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Try the most-used tools</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { to: "/merge", label: "Merge PDF" },
                  { to: "/compress", label: "Compress PDF" },
                  { to: "/edit-pdf", label: "Edit PDF" },
                  { to: "/ocr", label: "OCR — Image to Text" },
                  { to: "/ai/translate", label: "AI Translator (100+ langs)" },
                  { to: "/sign-pdf", label: "Sign PDF" },
                  { to: "/image-to-pdf", label: "Image to PDF" },
                  { to: "/convert", label: "PDF ↔ Word / Excel / PPT" },
                  { to: "/ai-hub", label: "AI Hub — Chat, Write, Analyze" },
                ].map(({ to, label }) => (
                  <Button key={to} asChild variant="outline" className="justify-between h-auto py-3">
                    <Link to={to}>
                      <span>{label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </section>

            {/* Social proof placeholders */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Early reactions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {testimonialSlots.map((t, i) => (
                  <Card key={i} className="bg-muted/30">
                    <CardContent className="p-6">
                      <p className="text-sm italic mb-3">"{t.quote}"</p>
                      <p className="text-xs text-muted-foreground">— {t.who}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Share block */}
            <section className="mb-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Help us launch — share Docunova AI</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild variant="outline">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      "Just tried @DocunovaAI — 100+ free AI document tools, no signup, no file-size limit. Solid. https://docunova-ai.lovable.app"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-4 h-4 mr-2" /> Tweet about it
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://www.reddit.com/submit?url=https%3A%2F%2Fdocunova-ai.lovable.app&title=Docunova%20AI%20%E2%80%94%20100%2B%20free%20AI%20document%20tools%2C%20no%20signup"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Post on Reddit
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/aman90055" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" /> Star on GitHub
                  </a>
                </Button>
              </div>
            </section>

            {/* Final CTA */}
            <section className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Open a tool. See for yourself.</h2>
              <p className="text-muted-foreground mb-6">No signup. No card. Nothing between you and the download button.</p>
              <Button asChild size="lg" className="text-base">
                <Link to="/tools">Browse all 100+ tools <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Launch;
