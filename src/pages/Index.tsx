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


const Index = () => {
  return (
    <>
      <Helmet>
        <title>Document Edit Pro AI — 100+ Free PDF, AI & Productivity Tools</title>
        <meta name="description" content="One platform for PDFs, AI, documents, images & productivity. 100+ free tools — edit, convert, summarize, sign & collaborate. Fast, secure, mobile-ready." />
        <link rel="canonical" href="https://document-edit-in.lovable.app/" />
        <meta name="keywords" content="document edit pro AI, free PDF tools, AI PDF chat, document summarizer, PDF converter, image tools, invoice generator, productivity tools" />
        <meta property="og:title" content="Document Edit Pro AI — 100+ Free PDF, AI & Productivity Tools" />
        <meta property="og:description" content="One platform for PDFs, AI, documents, images & productivity. 100+ free tools. Fast, secure, mobile-ready." />
        <meta property="og:url" content="https://document-edit-in.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Document Edit Pro AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Document Edit Pro AI — 100+ Free Tools" />
        <meta name="twitter:description" content="PDFs, AI, documents, images & productivity in one workspace. 100+ free tools." />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <PartnerLogos />
          <PopularTools />
          <AnimatedStatsSection />
          <Features />
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
