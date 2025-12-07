import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePDFRemovePages = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const removePages = useCallback(async (file: File, pagesToRemove: number[]) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const totalPages = sourcePdf.getPageCount();
      setProgress(40);

      const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i)
        .filter((i) => !pagesToRemove.includes(i + 1));

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));
      setProgress(60);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(80);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `removed_${Date.now()}.pdf`;
        const filePath = `${user.id}/remove/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob);
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "remove_pages",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: `Removed ${pagesToRemove.length} pages successfully.`,
      });
    } catch (error) {
      console.error("Remove pages error:", error);
      toast({
        title: "Error",
        description: "Failed to remove pages.",
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

  return { removePages, isProcessing, progress, downloadUrl, reset };
};
