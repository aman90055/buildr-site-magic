import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PopularTools from "@/components/PopularTools";
import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";
import AdSlot from "@/components/ads/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";


const Index = () => {
  return (
    <>
      <Helmet>
        <title>Free PDF Tools Online — Merge, Split & Compress | Docunova</title>
        <meta name="description" content="Merge, split, compress and convert PDFs in your browser for free, with no sign-in and no file-size cap. Also includes OCR, image tools and AI helpers." />
        <link rel="canonical" href="https://docunova.online/" />
        <meta name="keywords" content="Docunova AI Suite, free PDF editor online, merge PDF, split PDF, compress PDF, PDF to Word, PDF to Excel, OCR online, e-sign PDF, AI PDF summarizer, watermark PDF, edit PDF free, image to PDF" />
        <meta property="og:title" content="Free PDF Tools Online — Merge, Split & Compress | Docunova" />
        <meta property="og:description" content="Merge, split, compress and convert PDFs in your browser for free, with no sign-in and no file-size cap. Also includes OCR, image tools and AI helpers." />
        <meta property="og:url" content="https://docunova.online/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Tools Online — Merge, Split & Compress | Docunova" />
        <meta name="twitter:description" content="Merge, split, compress and convert PDFs in your browser for free, with no sign-in and no file-size cap. Also includes OCR, image tools and AI helpers." />
      </Helmet>
      <div className="home-workspace min-h-screen">
        <Header />
        <main className="pt-[70px]">
          <Hero />
          <PopularTools />
          <HomeContent />
          <AdSlot config={AD_SLOTS.midContent} className="max-w-5xl mx-auto px-4 py-6" />
          <AdSlot config={AD_SLOTS.footer} className="max-w-5xl mx-auto px-4 py-6" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
