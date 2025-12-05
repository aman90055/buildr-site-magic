import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import PDFMerge from "./pages/PDFMerge";
import PDFSplit from "./pages/PDFSplit";
import PDFCompress from "./pages/PDFCompress";
import PDFConvert from "./pages/PDFConvert";
import ImageToPDF from "./pages/ImageToPDF";
import PDFToImage from "./pages/PDFToImage";
import EditPDF from "./pages/EditPDF";
import ProtectPDF from "./pages/ProtectPDF";
import OCR from "./pages/OCR";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/merge" element={<PDFMerge />} />
            <Route path="/split" element={<PDFSplit />} />
            <Route path="/compress" element={<PDFCompress />} />
            <Route path="/convert" element={<PDFConvert />} />
            <Route path="/image-to-pdf" element={<ImageToPDF />} />
            <Route path="/pdf-to-image" element={<PDFToImage />} />
            <Route path="/edit-pdf" element={<EditPDF />} />
            <Route path="/protect-pdf" element={<ProtectPDF />} />
            <Route path="/ocr" element={<OCR />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
