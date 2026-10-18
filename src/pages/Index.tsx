import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PopularTools from "@/components/PopularTools";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import HomeSections from "@/components/HomeSections";
import HomeContent from "@/components/HomeContent";
import AdSlot from "@/components/ads/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import AnimatedStatsSection from "@/components/AnimatedStatsSection";
import PromoCards from "@/components/ads/PromoCards";
import WorkflowStrip from "@/components/WorkflowStrip";
import PricingSection from "@/components/PricingSection";


const Index = () => {
  return (
    <>
      <Helmet>
        <title>Docunova — Free PDF Tools & AI Document Helpers</title>
        <meta name="description" content="Merge, split and compress PDFs free without signing in. Core PDF tools have no file-size cap. Explore image tools and AI helpers with separate usage limits." />
        <link rel="canonical" href="https://docunova.online/" />
        <meta name="keywords" content="Docunova AI Suite, free PDF editor online, merge PDF, split PDF, compress PDF, PDF to Word, PDF to Excel, OCR online, e-sign PDF, AI PDF summarizer, watermark PDF, edit PDF free, image to PDF" />
        <meta property="og:title" content="Docunova — Free PDF Tools & AI Document Helpers" />
        <meta property="og:description" content="Free core PDF tools without sign-in or a file-size cap. AI helpers have separate usage and input limits." />
        <meta property="og:url" content="https://docunova.online/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Docunova AI Suite — 74 Tools" />
        <meta name="twitter:description" content="Free core PDF tools without sign-in or a file-size cap. AI helpers have separate usage and input limits." />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <WorkflowStrip />
          <PopularTools />
          <AnimatedStatsSection />
          <Features />
          <PricingSection />
          <PromoCards className="py-12" location="home_features" />
          <HomeSections />
          <HomeContent />
          <AdSlot config={AD_SLOTS.midContent} className="max-w-5xl mx-auto px-4 py-6" />
          <Stats />
          <AdSlot config={AD_SLOTS.footer} className="max-w-5xl mx-auto px-4 py-6" />

          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
