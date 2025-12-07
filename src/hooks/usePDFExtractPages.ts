import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePDFExtractPages = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const extractPages = useCallback(async (file: File, pageNumbers: number[]) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      setProgress(40);

      const validPages = pageNumbers
        .filter((n) => n >= 1 && n <= sourcePdf.getPageCount())
        .map((n) => n - 1);

      const copiedPages = await newPdf.copyPages(sourcePdf, validPages);
      copiedPages.forEach((page) => newPdf.addPage(page));
      setProgress(60);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(80);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `extracted_${Date.now()}.pdf`;
        const filePath = `${user.id}/extract/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob);
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "extract_pages",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: `Extracted ${validPages.length} pages successfully.`,
      });
    } catch (error) {
      console.error("Extract pages error:", error);
      toast({
        title: "Error",
        description: "Failed to extract pages.",
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

  return { extractPages, isProcessing, progress, downloadUrl, reset };
};
