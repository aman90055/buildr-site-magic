import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PopularTools from "@/components/PopularTools";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Free PDF Tools Online - Merge, Split, Compress & Convert PDFs | AI-Powered</title>
        <meta name="description" content="Best free online PDF tools 2026: merge, split, compress, convert, OCR & edit PDFs instantly. AI-powered, fast, secure. No signup needed. 50+ tools available. Made in India." />
        <link rel="canonical" href="https://documents-edit-in.lovable.app/" />
        <meta property="og:title" content="Free PDF Tools Online - 50+ AI-Powered PDF Tools" />
        <meta property="og:description" content="Merge, split, compress, convert PDFs instantly. Free AI-powered tools, no signup. Trusted by millions." />
        <meta property="og:url" content="https://documents-edit-in.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Tools Online - 50+ AI-Powered PDF Tools" />
        <meta name="twitter:description" content="Merge, split, compress, convert PDFs instantly. Free AI-powered tools, no signup needed." />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <PopularTools />
          <Features />
          <Stats />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
