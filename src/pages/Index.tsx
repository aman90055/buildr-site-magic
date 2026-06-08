import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PopularTools from "@/components/PopularTools";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";
import AdSlot from "@/components/ads/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Free PDF Tools Online - Merge, Split, Compress & Convert PDFs | AI-Powered 2026</title>
        <meta name="description" content="Best free online PDF tools 2026: merge, split, compress, convert, OCR & edit PDFs instantly. 50+ AI-powered tools. Fast, secure, no signup. Made in India 🇮🇳. Trusted by millions." />
        <link rel="canonical" href="https://document-edit-in.lovable.app/" />
        <meta name="keywords" content="free PDF tools, merge PDF, split PDF, compress PDF, convert PDF, OCR, PDF editor, AI PDF tools, PDF to Word, Word to PDF, image to PDF, best free PDF tools 2026" />
        <meta property="og:title" content="Free PDF Tools Online - 50+ AI-Powered PDF Tools | 2026" />
        <meta property="og:description" content="Best free PDF tools: merge, split, compress, convert PDFs instantly. AI-powered, no signup. 50+ tools. Made in India." />
        <meta property="og:url" content="https://document-edit-in.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PDF Tools - Free Online PDF Editor" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Tools Online - 50+ AI-Powered PDF Tools" />
        <meta name="twitter:description" content="Merge, split, compress, convert PDFs instantly. Free AI-powered tools, no signup needed. Made in India." />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <PopularTools />
          <Features />
          <HomeContent />
          <Stats />
          {/* Single, modest ad slot well below the fold — AdSense friendlier */}
          <AdSlot config={AD_SLOTS.footer} className="max-w-5xl mx-auto px-4 py-6" />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
