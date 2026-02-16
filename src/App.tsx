import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import AIChatWidget from "@/components/AIChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PDFMerge from "./pages/PDFMerge";
import PDFSplit from "./pages/PDFSplit";
import PDFCompress from "./pages/PDFCompress";
import PDFConvert from "./pages/PDFConvert";
import ImageToPDF from "./pages/ImageToPDF";
import PDFToImage from "./pages/PDFToImage";
import EditPDF from "./pages/EditPDF";
import ProtectPDF from "./pages/ProtectPDF";
import OCR from "./pages/OCR";
// Organize PDF
import RemovePages from "./pages/tools/RemovePages";
import ExtractPages from "./pages/tools/ExtractPages";
import OrganizePDF from "./pages/tools/OrganizePDF";
import ScanToPDF from "./pages/tools/ScanToPDF";
import ReversePDF from "./pages/tools/ReversePDF";
// Optimize PDF
import RepairPDF from "./pages/tools/RepairPDF";
// Convert to PDF
import WordToPDF from "./pages/tools/WordToPDF";
import PowerPointToPDF from "./pages/tools/PowerPointToPDF";
import ExcelToPDF from "./pages/tools/ExcelToPDF";
import HTMLToPDF from "./pages/tools/HTMLToPDF";
import SVGToPDF from "./pages/tools/SVGToPDF";
import MarkdownToPDF from "./pages/tools/MarkdownToPDF";
import TextToPDF from "./pages/tools/TextToPDF";
// Convert from PDF
import PDFToWord from "./pages/tools/PDFToWord";
import PDFToPowerPoint from "./pages/tools/PDFToPowerPoint";
import PDFToExcel from "./pages/tools/PDFToExcel";
import PDFToPDFA from "./pages/tools/PDFToPDFA";
import PDFToText from "./pages/tools/PDFToText";
import PDFToHTML from "./pages/tools/PDFToHTML";
import PDFToPNG from "./pages/tools/PDFToPNG";
import PDFToSVG from "./pages/tools/PDFToSVG";
import PDFToEPUB from "./pages/tools/PDFToEPUB";
// Edit PDF
import RotatePDF from "./pages/tools/RotatePDF";
import AddPageNumbers from "./pages/tools/AddPageNumbers";
import AddWatermark from "./pages/tools/AddWatermark";
import CropPDF from "./pages/tools/CropPDF";
import FlattenPDF from "./pages/tools/FlattenPDF";
import GrayscalePDF from "./pages/tools/GrayscalePDF";
import PDFMetadata from "./pages/tools/PDFMetadata";
// Security
import UnlockPDF from "./pages/tools/UnlockPDF";
import SignPDF from "./pages/tools/SignPDF";
import RedactPDF from "./pages/tools/RedactPDF";
import ComparePDF from "./pages/tools/ComparePDF";
// Image Tools
import ImageCompress from "./pages/tools/ImageCompress";
import ImageResize from "./pages/tools/ImageResize";
import ImageCrop from "./pages/tools/ImageCrop";
import PNGToJPG from "./pages/tools/PNGToJPG";
import JPGToPNG from "./pages/tools/JPGToPNG";
import WebPToJPG from "./pages/tools/WebPToJPG";
import JPGToWebP from "./pages/tools/JPGToWebP";
import ImageRotate from "./pages/tools/ImageRotate";
import RemoveBackground from "./pages/tools/RemoveBackground";
import ImageToText from "./pages/tools/ImageToText";
import AIImageEnhance from "./pages/tools/AIImageEnhance";
// AI Tools
import AISummarizer from "./pages/tools/AISummarizer";
import AITranslator from "./pages/tools/AITranslator";
import AIGrammarCheck from "./pages/tools/AIGrammarCheck";
import AIRewriter from "./pages/tools/AIRewriter";
import AIDataExtractor from "./pages/tools/AIDataExtractor";
// Document Tools
import ResumeBuilder from "./pages/tools/ResumeBuilder";
import InvoiceGenerator from "./pages/tools/InvoiceGenerator";
import CertificateMaker from "./pages/tools/CertificateMaker";
import LetterWriter from "./pages/tools/LetterWriter";
// Referral
import ReferAndEarn from "./pages/ReferAndEarn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AIChatWidget />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* Core Tools */}
              <Route path="/merge" element={<PDFMerge />} />
              <Route path="/split" element={<PDFSplit />} />
              <Route path="/compress" element={<PDFCompress />} />
              <Route path="/convert" element={<PDFConvert />} />
              <Route path="/image-to-pdf" element={<ImageToPDF />} />
              <Route path="/pdf-to-image" element={<PDFToImage />} />
              <Route path="/edit-pdf" element={<EditPDF />} />
              <Route path="/protect-pdf" element={<ProtectPDF />} />
              <Route path="/ocr" element={<OCR />} />
              {/* Organize PDF */}
              <Route path="/remove-pages" element={<RemovePages />} />
              <Route path="/extract-pages" element={<ExtractPages />} />
              <Route path="/organize-pdf" element={<OrganizePDF />} />
              <Route path="/scan-to-pdf" element={<ScanToPDF />} />
              <Route path="/reverse-pdf" element={<ReversePDF />} />
              {/* Optimize PDF */}
              <Route path="/repair-pdf" element={<RepairPDF />} />
              {/* Convert to PDF */}
              <Route path="/word-to-pdf" element={<WordToPDF />} />
              <Route path="/powerpoint-to-pdf" element={<PowerPointToPDF />} />
              <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
              <Route path="/html-to-pdf" element={<HTMLToPDF />} />
              <Route path="/svg-to-pdf" element={<SVGToPDF />} />
              <Route path="/markdown-to-pdf" element={<MarkdownToPDF />} />
              <Route path="/text-to-pdf" element={<TextToPDF />} />
              {/* Convert from PDF */}
              <Route path="/pdf-to-word" element={<PDFToWord />} />
              <Route path="/pdf-to-powerpoint" element={<PDFToPowerPoint />} />
              <Route path="/pdf-to-excel" element={<PDFToExcel />} />
              <Route path="/pdf-to-pdfa" element={<PDFToPDFA />} />
              <Route path="/pdf-to-text" element={<PDFToText />} />
              <Route path="/pdf-to-html" element={<PDFToHTML />} />
              <Route path="/pdf-to-png" element={<PDFToPNG />} />
              <Route path="/pdf-to-svg" element={<PDFToSVG />} />
              <Route path="/pdf-to-epub" element={<PDFToEPUB />} />
              {/* Edit PDF */}
              <Route path="/rotate-pdf" element={<RotatePDF />} />
              <Route path="/add-page-numbers" element={<AddPageNumbers />} />
              <Route path="/add-watermark" element={<AddWatermark />} />
              <Route path="/crop-pdf" element={<CropPDF />} />
              <Route path="/flatten-pdf" element={<FlattenPDF />} />
              <Route path="/grayscale-pdf" element={<GrayscalePDF />} />
              <Route path="/pdf-metadata" element={<PDFMetadata />} />
              {/* Security */}
              <Route path="/unlock-pdf" element={<UnlockPDF />} />
              <Route path="/sign-pdf" element={<SignPDF />} />
              <Route path="/redact-pdf" element={<RedactPDF />} />
              <Route path="/compare-pdf" element={<ComparePDF />} />
              {/* Image Tools */}
              <Route path="/compress-image" element={<ImageCompress />} />
              <Route path="/resize-image" element={<ImageResize />} />
              <Route path="/crop-image" element={<ImageCrop />} />
              <Route path="/png-to-jpg" element={<PNGToJPG />} />
              <Route path="/jpg-to-png" element={<JPGToPNG />} />
              <Route path="/webp-to-jpg" element={<WebPToJPG />} />
              <Route path="/jpg-to-webp" element={<JPGToWebP />} />
              <Route path="/rotate-image" element={<ImageRotate />} />
              <Route path="/remove-background" element={<RemoveBackground />} />
              <Route path="/image-to-text" element={<ImageToText />} />
              <Route path="/ai-image-enhance" element={<AIImageEnhance />} />
              {/* AI Tools */}
              <Route path="/ai-summarizer" element={<AISummarizer />} />
              <Route path="/ai-translator" element={<AITranslator />} />
              <Route path="/ai-grammar-check" element={<AIGrammarCheck />} />
              <Route path="/ai-rewriter" element={<AIRewriter />} />
              <Route path="/ai-data-extractor" element={<AIDataExtractor />} />
              {/* Document Tools */}
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/invoice-generator" element={<InvoiceGenerator />} />
              <Route path="/certificate-maker" element={<CertificateMaker />} />
              <Route path="/letter-writer" element={<LetterWriter />} />
              {/* Referral */}
              <Route path="/refer" element={<ReferAndEarn />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
