import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, Lock, Wand2, CreditCard, Users } from "lucide-react";

interface Article { title: string; desc: string; href: string }
interface Section { title: string; icon: typeof BookOpen; articles: Article[] }

const sections: Section[] = [
  {
    title: "Getting Started", icon: BookOpen, articles: [
      { title: "How to merge PDF files", desc: "Combine multiple PDFs into one in seconds.", href: "/merge" },
      { title: "How to split a PDF", desc: "Extract specific pages or split into chunks.", href: "/split" },
      { title: "How to compress a PDF", desc: "Reduce file size while keeping quality.", href: "/compress" },
    ],
  },
  {
    title: "AI Tools", icon: Wand2, articles: [
      { title: "Summarize long PDFs with AI", desc: "Get key points in seconds.", href: "/ai-summarizer" },
      { title: "Translate PDFs into 15+ languages", desc: "Preserve layout while translating.", href: "/ai-translator" },
      { title: "Fix grammar with AI", desc: "Polish writing in any document.", href: "/ai-grammar-check" },
    ],
  },
  {
    title: "Privacy & Security", icon: Lock, articles: [
      { title: "Is my file uploaded anywhere?", desc: "Most tools run 100% in your browser.", href: "/privacy" },
      { title: "Add password protection", desc: "Encrypt PDFs with AES-256.", href: "/protect-pdf" },
      { title: "Sign and redact", desc: "E-sign or redact sensitive text.", href: "/sign-pdf" },
    ],
  },
  {
    title: "Account & Billing", icon: CreditCard, articles: [
      { title: "Premium plans & pricing", desc: "What you get with Premium.", href: "/premium" },
      { title: "Refer & earn credits", desc: "Share your link and unlock rewards.", href: "/refer" },
      { title: "Refund policy", desc: "Contact support for refund requests.", href: "/contact" },
    ],
  },
  {
    title: "Community & Support", icon: Users, articles: [
      { title: "Contact support", desc: "Email us — we reply within 24 hours.", href: "/contact" },
      { title: "FAQ", desc: "Top 20 questions answered.", href: "/faq" },
      { title: "Roadmap", desc: "What we're building next.", href: "/roadmap" },
    ],
  },
];

const HelpCenter = () => {
  const [q, setQ] = useState("");
  const filtered = q
    ? sections.map((s) => ({
        ...s,
        articles: s.articles.filter((a) =>
          (a.title + " " + a.desc).toLowerCase().includes(q.toLowerCase()),
        ),
      })).filter((s) => s.articles.length > 0)
    : sections;

  return (
    <>
      <Helmet>
        <title>Help Center — The Docunova AI Suite</title>
        <meta name="description" content="Tutorials, guides and answers to common questions about The Docunova AI Suite tools." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/help" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 container max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">How can we help?</h1>
            <p className="text-muted-foreground mb-6">Search tutorials, FAQs and guides.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles (e.g. merge, password, AI translate)..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((s) => (
              <Card key={s.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <s.icon className="w-5 h-5 text-primary" /> {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {s.articles.map((a) => (
                      <li key={a.title}>
                        <Link to={a.href} className="block group">
                          <div className="font-medium group-hover:text-primary transition">{a.title}</div>
                          <div className="text-sm text-muted-foreground">{a.desc}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">
              No results. <Link to="/contact" className="text-primary underline">Contact support →</Link>
            </p>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
