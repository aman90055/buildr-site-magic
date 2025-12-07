import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AIChatWidget from "@/components/AIChatWidget";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
// Optimize PDF
import RepairPDF from "./pages/tools/RepairPDF";
// Convert to PDF
import WordToPDF from "./pages/tools/WordToPDF";
import PowerPointToPDF from "./pages/tools/PowerPointToPDF";
import ExcelToPDF from "./pages/tools/ExcelToPDF";
import HTMLToPDF from "./pages/tools/HTMLToPDF";
// Convert from PDF
import PDFToWord from "./pages/tools/PDFToWord";
import PDFToPowerPoint from "./pages/tools/PDFToPowerPoint";
import PDFToExcel from "./pages/tools/PDFToExcel";
import PDFToPDFA from "./pages/tools/PDFToPDFA";
// Edit PDF
import RotatePDF from "./pages/tools/RotatePDF";
import AddPageNumbers from "./pages/tools/AddPageNumbers";
import AddWatermark from "./pages/tools/AddWatermark";
import CropPDF from "./pages/tools/CropPDF";
// Security
import UnlockPDF from "./pages/tools/UnlockPDF";
import SignPDF from "./pages/tools/SignPDF";
import RedactPDF from "./pages/tools/RedactPDF";
import ComparePDF from "./pages/tools/ComparePDF";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AIChatWidget />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
            {/* Optimize PDF */}
            <Route path="/repair-pdf" element={<RepairPDF />} />
            {/* Convert to PDF */}
            <Route path="/word-to-pdf" element={<WordToPDF />} />
            <Route path="/powerpoint-to-pdf" element={<PowerPointToPDF />} />
            <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
            <Route path="/html-to-pdf" element={<HTMLToPDF />} />
            {/* Convert from PDF */}
            <Route path="/pdf-to-word" element={<PDFToWord />} />
            <Route path="/pdf-to-powerpoint" element={<PDFToPowerPoint />} />
            <Route path="/pdf-to-excel" element={<PDFToExcel />} />
            <Route path="/pdf-to-pdfa" element={<PDFToPDFA />} />
            {/* Edit PDF */}
            <Route path="/rotate-pdf" element={<RotatePDF />} />
            <Route path="/add-page-numbers" element={<AddPageNumbers />} />
            <Route path="/add-watermark" element={<AddWatermark />} />
            <Route path="/crop-pdf" element={<CropPDF />} />
            {/* Security */}
            <Route path="/unlock-pdf" element={<UnlockPDF />} />
            <Route path="/sign-pdf" element={<SignPDF />} />
            <Route path="/redact-pdf" element={<RedactPDF />} />
            <Route path="/compare-pdf" element={<ComparePDF />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
