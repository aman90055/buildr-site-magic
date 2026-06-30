import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import AIChatWidget from "@/components/AIChatWidget";
import InstallPrompt from "@/components/InstallPrompt";
import ScrollToTop from "@/components/ScrollToTop";
import ExitIntentOffer from "@/components/ExitIntentOffer";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
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
import Premium from "./pages/Premium";
import AdminPayments from "./pages/AdminPayments";
import AdminDashboard from "./pages/AdminDashboard";
import ToolIconManager from "./pages/admin/ToolIconManager";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import Roadmap from "./pages/Roadmap";
import Changelog from "./pages/Changelog";
import HelpCenter from "./pages/HelpCenter";
import Newsletter from "./pages/Newsletter";
import Terms from "./pages/legal/Terms";
import Cookies from "./pages/legal/Cookies";
import Disclaimer from "./pages/legal/Disclaimer";
import DMCA from "./pages/legal/DMCA";
import Refund from "./pages/legal/Refund";
import Editorial from "./pages/legal/Editorial";
import AIUsage from "./pages/legal/AIUsage";
import Accessibility from "./pages/legal/Accessibility";
import Brand from "./pages/Brand";
import Press from "./pages/Press";
import Enterprise from "./pages/Enterprise";
import ApiDocs from "./pages/ApiDocs";
import Workspace from "./pages/Workspace";
import AIHub from "./pages/AIHub";
import AITool from "./pages/AITool";
import Integrations from "./pages/Integrations";
import Growth from "./pages/Growth";
import SocialKit from "./pages/SocialKit";
import Careers from "./pages/Careers";
import Internships from "./pages/Internships";
import Portfolio from "./pages/Portfolio";
import CaseStudies from "./pages/CaseStudies";
// Developer Tools
import UUIDGenerator from "./pages/tools/dev/UUIDGenerator";
import HashGenerator from "./pages/tools/dev/HashGenerator";
import JWTDecoder from "./pages/tools/dev/JWTDecoder";
import URLEncoder from "./pages/tools/dev/URLEncoder";
import RegexTester from "./pages/tools/dev/RegexTester";
import MinifyBeautify from "./pages/tools/dev/MinifyBeautify";
import TimestampConverter from "./pages/tools/dev/TimestampConverter";
import PasswordGenerator from "./pages/tools/dev/PasswordGenerator";
import LoremIpsum from "./pages/tools/dev/LoremIpsum";
import Base64Tool from "./pages/tools/dev/Base64";
import JSONFormatter from "./pages/tools/dev/JSONFormatter";
// Utility Tools
import EMICalculator from "./pages/tools/util/EMICalculator";
import GSTCalculator from "./pages/tools/util/GSTCalculator";
import AgeCalculator from "./pages/tools/util/AgeCalculator";
import PercentageCalculator from "./pages/tools/util/PercentageCalculator";
import UnitConverter from "./pages/tools/util/UnitConverter";
import CurrencyConverter from "./pages/tools/util/CurrencyConverter";
import TimezoneConverter from "./pages/tools/util/TimezoneConverter";
import TextCounter from "./pages/tools/util/TextCounter";
import TextCase from "./pages/tools/util/TextCase";
// File Tools
import ZipExtractor from "./pages/tools/file/ZipExtractor";
import FileCompressor from "./pages/tools/file/FileCompressor";
import FileRename from "./pages/tools/file/FileRename";
import ChecksumViewer from "./pages/tools/file/ChecksumViewer";
// Office / Data Tools
import ExcelViewer from "./pages/tools/office/ExcelViewer";
import WordViewer from "./pages/tools/office/WordViewer";
import PPTViewer from "./pages/tools/office/PPTViewer";
import CSVViewer from "./pages/tools/office/CSVViewer";
import JsonCsvXml from "./pages/tools/office/JsonCsvXml";
import JsonValidator from "./pages/tools/office/JsonValidator";
// Social Tools
import SocialBioGenerator from "./pages/tools/social/SocialBioGenerator";
import UsernameGenerator from "./pages/tools/social/UsernameGenerator";
import HashtagGenerator from "./pages/tools/social/HashtagGenerator";
import SocialLinksHub from "./pages/tools/social/SocialLinksHub";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AIChatWidget />
            <InstallPrompt />
            <ExitIntentOffer />
            
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/dmca" element={<DMCA />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/editorial-policy" element={<Editorial />} />
              <Route path="/ai-usage-policy" element={<AIUsage />} />
              <Route path="/accessibility" element={<Accessibility />} />
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
              <Route path="/premium" element={<Premium />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/tool-icons" element={<ToolIconManager />} />
              {/* Category landing pages */}
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/brand" element={<Brand />} />
              <Route path="/press" element={<Press />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/workspace" element={<Workspace />} />
              {/* Global SaaS Modules */}
              <Route path="/ai-hub" element={<AIHub />} />
              <Route path="/ai/:slug" element={<AITool />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/growth" element={<Growth />} />
              <Route path="/social-kit" element={<SocialKit />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              {/* Developer Tools */}
              <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />
              <Route path="/tools/hash-generator" element={<HashGenerator />} />
              <Route path="/tools/jwt-decoder" element={<JWTDecoder />} />
              <Route path="/tools/url-encoder" element={<URLEncoder />} />
              <Route path="/tools/regex-tester" element={<RegexTester />} />
              <Route path="/tools/minify-beautify" element={<MinifyBeautify />} />
              <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
              <Route path="/tools/password-generator" element={<PasswordGenerator />} />
              <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
              <Route path="/tools/base64" element={<Base64Tool />} />
              <Route path="/tools/json-formatter" element={<JSONFormatter />} />
              {/* Utility Tools */}
              <Route path="/tools/emi-calculator" element={<EMICalculator />} />
              <Route path="/tools/gst-calculator" element={<GSTCalculator />} />
              <Route path="/tools/age-calculator" element={<AgeCalculator />} />
              <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
              <Route path="/tools/unit-converter" element={<UnitConverter />} />
              <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
              <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
              <Route path="/tools/text-counter" element={<TextCounter />} />
              <Route path="/tools/text-case" element={<TextCase />} />
              {/* File Tools */}
              <Route path="/tools/zip-extractor" element={<ZipExtractor />} />
              <Route path="/tools/file-compressor" element={<FileCompressor />} />
              <Route path="/tools/file-rename" element={<FileRename />} />
              <Route path="/tools/checksum-viewer" element={<ChecksumViewer />} />
              {/* Office / Data Tools */}
              <Route path="/tools/excel-viewer" element={<ExcelViewer />} />
              <Route path="/tools/word-viewer" element={<WordViewer />} />
              <Route path="/tools/ppt-viewer" element={<PPTViewer />} />
              <Route path="/tools/csv-viewer" element={<CSVViewer />} />
              <Route path="/tools/json-csv-xml" element={<JsonCsvXml />} />
              <Route path="/tools/json-validator" element={<JsonValidator />} />
              {/* Social Tools */}
              <Route path="/tools/bio-generator" element={<SocialBioGenerator />} />
              <Route path="/tools/username-generator" element={<UsernameGenerator />} />
              <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
              <Route path="/tools/social-links-hub" element={<SocialLinksHub />} />
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
