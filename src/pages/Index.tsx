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
import PartnerLogos from "@/components/PartnerLogos";
import AnimatedStatsSection from "@/components/AnimatedStatsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import PromoCards from "@/components/ads/PromoCards";
import WorkflowStrip from "@/components/WorkflowStrip";
import PricingSection from "@/components/PricingSection";


const Index = () => {
  return (
    <>
      <Helmet>
        <title>Free PDF Editor — 100+ PDF, AI & Document Tools</title>
        <meta name="description" content="Free online PDF editor: merge, split, compress, convert to Word/Excel, OCR, e-sign, watermark & AI summarize. 100+ tools, no signup." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/" />
        <meta name="keywords" content="free PDF editor online, merge PDF, split PDF, compress PDF, PDF to Word, PDF to Excel, OCR online, e-sign PDF, AI PDF summarizer, watermark PDF, edit PDF free, image to PDF" />
        <meta property="og:title" content="Free PDF Editor — 100+ PDF, AI & Document Tools" />
        <meta property="og:description" content="One platform for PDFs, AI, documents & productivity. 100+ free tools. Fast, secure, mobile-ready." />
        <meta property="og:url" content="https://docunova-ai.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Docunova AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Editor — 100+ Tools" />
        <meta name="twitter:description" content="PDFs, AI, documents & productivity in one workspace. 100+ free tools." />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <WorkflowStrip />
          <PartnerLogos />
          <PopularTools />
          <AnimatedStatsSection />
          <Features />
          <PricingSection />
          <PromoCards className="py-12" location="home_features" />
          <HomeSections />
          <TestimonialsCarousel />
          <HomeContent />
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
