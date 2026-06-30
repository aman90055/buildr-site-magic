import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Download, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const facts = [
  { label: "Founded", value: "2024" },
  { label: "Founder", value: "Aman Vishwakarma" },
  { label: "HQ", value: "India · Remote" },
  { label: "Tools", value: "60+" },
  { label: "Users served", value: "100k+" },
  { label: "Pricing", value: "Free forever" },
];

export default function Press() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Press & Media Kit — Document Edit Pro AI</title>
        <meta name="description" content="Press resources, fast facts, founder bio, and media assets for Document Edit Pro AI." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/press" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Press & Media</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          A privacy-first, free-forever document toolkit. Built in the open. Trusted by creators worldwide.
        </p>

        <Card className="p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Fast facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</div>
                <div className="font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3">About the founder</h2>
          <p className="text-muted-foreground">
            Aman Vishwakarma is an indie builder focused on accessible, private-by-default productivity tools. He
            started Document Edit Pro AI to remove paywalls and file-size limits from the everyday document tools
            people actually need.
          </p>
        </Card>

        <Card className="p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Quote className="w-4 h-4" /> Boilerplate</h2>
          <p className="text-muted-foreground italic">
            "Document Edit Pro AI is a free-forever suite of 60+ PDF, image, and AI tools that runs in your browser —
            so your files never leave your device. No file size limits. No watermarks. No tracking pixels on your
            documents."
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Logo & brand assets</h3>
            <p className="text-sm text-muted-foreground mb-4">Wordmark, color palette, typography.</p>
            <Button asChild variant="outline"><Link to="/brand"><Download className="w-4 h-4 mr-2" />Open brand kit</Link></Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Media contact</h3>
            <p className="text-sm text-muted-foreground mb-4">For interviews, partnerships, and press.</p>
            <Button asChild><a href="mailto:documentai999@gmail.com"><Mail className="w-4 h-4 mr-2" />documentai999@gmail.com</a></Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
