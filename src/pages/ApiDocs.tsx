import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Key, Zap, BookOpen } from "lucide-react";

const endpoints = [
  { method: "POST", path: "/v1/pdf/compress", desc: "Compress a PDF (multipart/form-data: file)" },
  { method: "POST", path: "/v1/pdf/merge", desc: "Merge multiple PDFs into one" },
  { method: "POST", path: "/v1/pdf/split", desc: "Split a PDF by page ranges" },
  { method: "POST", path: "/v1/pdf/convert", desc: "Convert between PDF and Word/Excel/Image" },
  { method: "POST", path: "/v1/ocr", desc: "Extract text from an image or PDF" },
  { method: "POST", path: "/v1/ai/summarize", desc: "AI summary of a document" },
];

const sample = `curl -X POST https://api.docunova-ai.com/v1/pdf/compress \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@input.pdf" \\
  -F "quality=80" \\
  --output compressed.pdf`;

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Developer API — Document Edit Pro AI</title>
        <meta name="description" content="REST API for PDF, image, and AI document tools. API keys, endpoints, rate limits, and SDKs." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/api-docs" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="text-sm text-muted-foreground">Developer Platform · Beta</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Build with our document API</h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Programmatic access to 60+ PDF, image, OCR, and AI tools. Simple REST. JSON in, files or JSON out.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="p-5"><Key className="w-5 h-5 text-primary mb-2" /><h3 className="font-semibold">API keys</h3><p className="text-sm text-muted-foreground">Generate per-project keys with scoped permissions.</p></Card>
          <Card className="p-5"><Zap className="w-5 h-5 text-primary mb-2" /><h3 className="font-semibold">Rate limits</h3><p className="text-sm text-muted-foreground">60 req/min on Free · 1000 req/min on Pro.</p></Card>
          <Card className="p-5"><BookOpen className="w-5 h-5 text-primary mb-2" /><h3 className="font-semibold">SDKs</h3><p className="text-sm text-muted-foreground">Node, Python, and Go (coming soon).</p></Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Quickstart</h2>
        <Card className="p-0 overflow-hidden mb-10">
          <pre className="bg-zinc-950 text-zinc-100 p-5 text-sm overflow-x-auto"><code>{sample}</code></pre>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
        <Card className="overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr><th className="text-left p-3">Method</th><th className="text-left p-3">Path</th><th className="text-left p-3">Description</th></tr>
            </thead>
            <tbody>
              {endpoints.map((e) => (
                <tr key={e.path} className="border-t">
                  <td className="p-3"><span className="inline-block px-2 py-0.5 rounded bg-green-500/10 text-green-600 text-xs font-mono">{e.method}</span></td>
                  <td className="p-3 font-mono text-xs">{e.path}</td>
                  <td className="p-3 text-muted-foreground">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/5 to-cyan-500/5 border-primary/20">
          <h3 className="text-xl font-semibold mb-2">Request early access</h3>
          <p className="text-muted-foreground mb-4">The API is in private beta. Email us with your use case and expected volume.</p>
          <Button asChild><a href="mailto:support@documenteditpro.ai?subject=API%20early%20access">Request API key</a></Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
