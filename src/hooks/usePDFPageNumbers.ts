import { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type PageNumberPosition = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

export const usePDFPageNumbers = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const addPageNumbers = useCallback(async (
    file: File,
    position: PageNumberPosition = "bottom-center",
    startNumber: number = 1,
    fontSize: number = 12
  ) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      setProgress(40);

      const pages = pdfDoc.getPages();
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = `${startNumber + index}`;
        const textWidth = font.widthOfTextAtSize(pageNumber, fontSize);
        
        let x: number, y: number;
        const margin = 30;

        switch (position) {
          case "bottom-left":
            x = margin; y = margin;
            break;
          case "bottom-right":
            x = width - textWidth - margin; y = margin;
            break;
          case "top-center":
            x = (width - textWidth) / 2; y = height - margin - fontSize;
            break;
          case "top-left":
            x = margin; y = height - margin - fontSize;
            break;
          case "top-right":
            x = width - textWidth - margin; y = height - margin - fontSize;
            break;
          default:
            x = (width - textWidth) / 2; y = margin;
        }

        page.drawText(pageNumber, {
          x, y, size: fontSize, font, color: rgb(0, 0, 0),
        });
      });
      setProgress(60);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(80);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `numbered_${Date.now()}.pdf`;
        const filePath = `${user.id}/page-numbers/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob);
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "add_page_numbers",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: "Page numbers added successfully.",
      });
    } catch (error) {
      console.error("Add page numbers error:", error);
      toast({
        title: "Error",
        description: "Failed to add page numbers.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  }, [downloadUrl]);

  return { addPageNumbers, isProcessing, progress, downloadUrl, reset };
};
