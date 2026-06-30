import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Palette, Type, Image as ImageIcon } from "lucide-react";

const palette = [
  { name: "Electric Blue", hex: "#3B82F6" },
  { name: "Cyan Glow", hex: "#06B6D4" },
  { name: "Midnight Indigo", hex: "#0F172A" },
  { name: "Snow", hex: "#F8FAFC" },
];

export default function Brand() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Brand Kit — Document Edit Pro AI</title>
        <meta name="description" content="Official brand guidelines, logos, colors, and typography for Document Edit Pro AI." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/brand" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Brand Kit</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Everything you need to talk about Document Edit Pro AI — logos, colors, type, and voice.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Logo</h2>
          <Card className="p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Document Edit Pro AI
            </div>
            <Button asChild><a href="/og-image.png" download><Download className="w-4 h-4 mr-2" />Download Logo Pack</a></Button>
          </Card>
          <p className="text-sm text-muted-foreground mt-3">Use clear-space equal to the cap-height of "D". Don't recolor, stretch, or rotate the wordmark.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {palette.map((c) => (
              <Card key={c.hex} className="overflow-hidden">
                <div className="h-24" style={{ background: c.hex }} />
                <div className="p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.hex}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Type className="w-5 h-5" /> Typography</h2>
          <Card className="p-6 space-y-3">
            <p className="text-3xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Space Grotesk — Headlines</p>
            <p className="text-base" style={{ fontFamily: "Inter, sans-serif" }}>Inter — Body copy and UI.</p>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Voice & Tone</h2>
          <Card className="p-6 text-muted-foreground">
            <p>Confident, clear, and helpful. We say "Free forever" instead of "no cost". We say "your file never leaves your device" instead of "client-side processing".</p>
          </Card>
        </section>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Media inquiries? <Link to="/press" className="text-primary underline">Visit our Press page</Link> or <Link to="/contact" className="text-primary underline">contact us</Link>.
        </div>
      </main>
      <Footer />
    </div>
  );
}
