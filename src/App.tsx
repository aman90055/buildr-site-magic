import { lazy, Suspense } from "react";
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
import FloatingBackNav from "@/components/FloatingBackNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExitIntentOffer from "@/components/ExitIntentOffer";
import CookieConsent from "@/components/CookieConsent";

// Eager: LCP route + 404 (small)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy: every other route (route-level code splitting)
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PDFMerge = lazy(() => import("./pages/PDFMerge"));
const PDFSplit = lazy(() => import("./pages/PDFSplit"));
const PDFCompress = lazy(() => import("./pages/PDFCompress"));
const PDFConvert = lazy(() => import("./pages/PDFConvert"));
const ImageToPDF = lazy(() => import("./pages/ImageToPDF"));
const PDFToImage = lazy(() => import("./pages/PDFToImage"));
const EditPDF = lazy(() => import("./pages/EditPDF"));
const ProtectPDF = lazy(() => import("./pages/ProtectPDF"));
const OCR = lazy(() => import("./pages/OCR"));
const RemovePages = lazy(() => import("./pages/tools/RemovePages"));
const ExtractPages = lazy(() => import("./pages/tools/ExtractPages"));
const OrganizePDF = lazy(() => import("./pages/tools/OrganizePDF"));
const ScanToPDF = lazy(() => import("./pages/tools/ScanToPDF"));
const ReversePDF = lazy(() => import("./pages/tools/ReversePDF"));
const RepairPDF = lazy(() => import("./pages/tools/RepairPDF"));
const WordToPDF = lazy(() => import("./pages/tools/WordToPDF"));
const PowerPointToPDF = lazy(() => import("./pages/tools/PowerPointToPDF"));
const ExcelToPDF = lazy(() => import("./pages/tools/ExcelToPDF"));
const HTMLToPDF = lazy(() => import("./pages/tools/HTMLToPDF"));
const SVGToPDF = lazy(() => import("./pages/tools/SVGToPDF"));
const MarkdownToPDF = lazy(() => import("./pages/tools/MarkdownToPDF"));
const TextToPDF = lazy(() => import("./pages/tools/TextToPDF"));
const PDFToWord = lazy(() => import("./pages/tools/PDFToWord"));
const PDFToPowerPoint = lazy(() => import("./pages/tools/PDFToPowerPoint"));
const PDFToExcel = lazy(() => import("./pages/tools/PDFToExcel"));
const PDFToPDFA = lazy(() => import("./pages/tools/PDFToPDFA"));
const PDFToText = lazy(() => import("./pages/tools/PDFToText"));
const PDFToHTML = lazy(() => import("./pages/tools/PDFToHTML"));
const PDFToPNG = lazy(() => import("./pages/tools/PDFToPNG"));
const PDFToSVG = lazy(() => import("./pages/tools/PDFToSVG"));
const PDFToEPUB = lazy(() => import("./pages/tools/PDFToEPUB"));
const RotatePDF = lazy(() => import("./pages/tools/RotatePDF"));
const AddPageNumbers = lazy(() => import("./pages/tools/AddPageNumbers"));
const AddWatermark = lazy(() => import("./pages/tools/AddWatermark"));
const CropPDF = lazy(() => import("./pages/tools/CropPDF"));
const FlattenPDF = lazy(() => import("./pages/tools/FlattenPDF"));
const GrayscalePDF = lazy(() => import("./pages/tools/GrayscalePDF"));
const PDFMetadata = lazy(() => import("./pages/tools/PDFMetadata"));
const UnlockPDF = lazy(() => import("./pages/tools/UnlockPDF"));
const SignPDF = lazy(() => import("./pages/tools/SignPDF"));
const RedactPDF = lazy(() => import("./pages/tools/RedactPDF"));
const ComparePDF = lazy(() => import("./pages/tools/ComparePDF"));
const ImageCompress = lazy(() => import("./pages/tools/ImageCompress"));
const ImageResize = lazy(() => import("./pages/tools/ImageResize"));
const ImageCrop = lazy(() => import("./pages/tools/ImageCrop"));
const PNGToJPG = lazy(() => import("./pages/tools/PNGToJPG"));
const JPGToPNG = lazy(() => import("./pages/tools/JPGToPNG"));
const WebPToJPG = lazy(() => import("./pages/tools/WebPToJPG"));
const JPGToWebP = lazy(() => import("./pages/tools/JPGToWebP"));
const ImageRotate = lazy(() => import("./pages/tools/ImageRotate"));
const RemoveBackground = lazy(() => import("./pages/tools/RemoveBackground"));
const ImageToText = lazy(() => import("./pages/tools/ImageToText"));
const PhotoTextEdit = lazy(() => import("./pages/tools/PhotoTextEdit"));
const AIImageEnhance = lazy(() => import("./pages/tools/AIImageEnhance"));
const AISummarizer = lazy(() => import("./pages/tools/AISummarizer"));
const AITranslator = lazy(() => import("./pages/tools/AITranslator"));
const AIGrammarCheck = lazy(() => import("./pages/tools/AIGrammarCheck"));
const AIRewriter = lazy(() => import("./pages/tools/AIRewriter"));
const AIDataExtractor = lazy(() => import("./pages/tools/AIDataExtractor"));
const AICoverLetter = lazy(() => import("./pages/tools/AICoverLetter"));
const AIEmailWriter = lazy(() => import("./pages/tools/AIEmailWriter"));
const AIBlogWriter = lazy(() => import("./pages/tools/AIBlogWriter"));
const AICodeExplainer = lazy(() => import("./pages/tools/AICodeExplainer"));
const AIMathSolver = lazy(() => import("./pages/tools/AIMathSolver"));
const AIIdeaGenerator = lazy(() => import("./pages/tools/AIIdeaGenerator"));
const AIHashtagGenerator = lazy(() => import("./pages/tools/AIHashtagGenerator"));
const AIYouTubeTitles = lazy(() => import("./pages/tools/AIYouTubeTitles"));
const AITweetGenerator = lazy(() => import("./pages/tools/AITweetGenerator"));
const AIResumeAnalyzer = lazy(() => import("./pages/tools/AIResumeAnalyzer"));
const ResumeBuilder = lazy(() => import("./pages/tools/ResumeBuilder"));
const GuideEditPDFFree = lazy(() => import("./pages/GuideEditPDFFree"));
const Launch = lazy(() => import("./pages/Launch"));
const InvoiceGenerator = lazy(() => import("./pages/tools/InvoiceGenerator"));
const CertificateMaker = lazy(() => import("./pages/tools/CertificateMaker"));
const LetterWriter = lazy(() => import("./pages/tools/LetterWriter"));
const ReferAndEarn = lazy(() => import("./pages/ReferAndEarn"));
const Premium = lazy(() => import("./pages/Premium"));
const AdminPayments = lazy(() => import("./pages/AdminPayments"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminContacts = lazy(() => import("./pages/AdminContacts"));
const AdminPremium = lazy(() => import("./pages/AdminPremium"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Changelog = lazy(() => import("./pages/Changelog"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const Disclaimer = lazy(() => import("./pages/legal/Disclaimer"));
const DMCA = lazy(() => import("./pages/legal/DMCA"));
const Refund = lazy(() => import("./pages/legal/Refund"));
const Editorial = lazy(() => import("./pages/legal/Editorial"));
const AIUsage = lazy(() => import("./pages/legal/AIUsage"));
const Accessibility = lazy(() => import("./pages/legal/Accessibility"));
const Brand = lazy(() => import("./pages/Brand"));
const Press = lazy(() => import("./pages/Press"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const Workspace = lazy(() => import("./pages/Workspace"));
const AIHub = lazy(() => import("./pages/AIHub"));
const AITool = lazy(() => import("./pages/AITool"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Growth = lazy(() => import("./pages/Growth"));
const SocialKit = lazy(() => import("./pages/SocialKit"));
const Careers = lazy(() => import("./pages/Careers"));
const Internships = lazy(() => import("./pages/Internships"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Tools = lazy(() => import("./pages/Tools"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Loading" />
  </div>
);

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
            <CookieConsent />
            <FloatingBackNav />
            <Breadcrumbs />

            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tools" element={<Tools />} />
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
                <Route path="/merge" element={<PDFMerge />} />
                <Route path="/split" element={<PDFSplit />} />
                <Route path="/compress" element={<PDFCompress />} />
                <Route path="/convert" element={<PDFConvert />} />
                <Route path="/image-to-pdf" element={<ImageToPDF />} />
                <Route path="/pdf-to-image" element={<PDFToImage />} />
                <Route path="/edit-pdf" element={<EditPDF />} />
                <Route path="/protect-pdf" element={<ProtectPDF />} />
                <Route path="/ocr" element={<OCR />} />
                <Route path="/remove-pages" element={<RemovePages />} />
                <Route path="/extract-pages" element={<ExtractPages />} />
                <Route path="/organize-pdf" element={<OrganizePDF />} />
                <Route path="/scan-to-pdf" element={<ScanToPDF />} />
                <Route path="/reverse-pdf" element={<ReversePDF />} />
                <Route path="/repair-pdf" element={<RepairPDF />} />
                <Route path="/word-to-pdf" element={<WordToPDF />} />
                <Route path="/powerpoint-to-pdf" element={<PowerPointToPDF />} />
                <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
                <Route path="/html-to-pdf" element={<HTMLToPDF />} />
                <Route path="/svg-to-pdf" element={<SVGToPDF />} />
                <Route path="/markdown-to-pdf" element={<MarkdownToPDF />} />
                <Route path="/text-to-pdf" element={<TextToPDF />} />
                <Route path="/pdf-to-word" element={<PDFToWord />} />
                <Route path="/pdf-to-powerpoint" element={<PDFToPowerPoint />} />
                <Route path="/pdf-to-excel" element={<PDFToExcel />} />
                <Route path="/pdf-to-pdfa" element={<PDFToPDFA />} />
                <Route path="/pdf-to-text" element={<PDFToText />} />
                <Route path="/pdf-to-html" element={<PDFToHTML />} />
                <Route path="/pdf-to-png" element={<PDFToPNG />} />
                <Route path="/pdf-to-svg" element={<PDFToSVG />} />
                <Route path="/pdf-to-epub" element={<PDFToEPUB />} />
                <Route path="/rotate-pdf" element={<RotatePDF />} />
                <Route path="/add-page-numbers" element={<AddPageNumbers />} />
                <Route path="/add-watermark" element={<AddWatermark />} />
                <Route path="/crop-pdf" element={<CropPDF />} />
                <Route path="/flatten-pdf" element={<FlattenPDF />} />
                <Route path="/grayscale-pdf" element={<GrayscalePDF />} />
                <Route path="/pdf-metadata" element={<PDFMetadata />} />
                <Route path="/unlock-pdf" element={<UnlockPDF />} />
                <Route path="/sign-pdf" element={<SignPDF />} />
                <Route path="/redact-pdf" element={<RedactPDF />} />
                <Route path="/compare-pdf" element={<ComparePDF />} />
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
                <Route path="/photo-text-edit" element={<PhotoTextEdit />} />
                <Route path="/ai-image-enhance" element={<AIImageEnhance />} />
                <Route path="/ai-summarizer" element={<AISummarizer />} />
                <Route path="/ai-translator" element={<AITranslator />} />
                <Route path="/ai-grammar-check" element={<AIGrammarCheck />} />
                <Route path="/ai-rewriter" element={<AIRewriter />} />
                <Route path="/ai-data-extractor" element={<AIDataExtractor />} />
                <Route path="/ai-cover-letter" element={<AICoverLetter />} />
                <Route path="/ai-email-writer" element={<AIEmailWriter />} />
                <Route path="/ai-blog-writer" element={<AIBlogWriter />} />
                <Route path="/ai-code-explainer" element={<AICodeExplainer />} />
                <Route path="/ai-math-solver" element={<AIMathSolver />} />
                <Route path="/ai-idea-generator" element={<AIIdeaGenerator />} />
                <Route path="/ai-hashtag-generator" element={<AIHashtagGenerator />} />
                <Route path="/ai-youtube-titles" element={<AIYouTubeTitles />} />
                <Route path="/ai-tweet-generator" element={<AITweetGenerator />} />
                <Route path="/ai-resume-analyzer" element={<AIResumeAnalyzer />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/invoice-generator" element={<InvoiceGenerator />} />
                <Route path="/certificate-maker" element={<CertificateMaker />} />
                <Route path="/letter-writer" element={<LetterWriter />} />
                <Route path="/refer" element={<ReferAndEarn />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
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
                <Route path="/ai-hub" element={<AIHub />} />
                <Route path="/ai/:slug" element={<AITool />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/growth" element={<Growth />} />
                <Route path="/social-kit" element={<SocialKit />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/internships" element={<Internships />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/guides/how-to-edit-pdf-free" element={<GuideEditPDFFree />} />
                <Route path="/launch" element={<Launch />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
