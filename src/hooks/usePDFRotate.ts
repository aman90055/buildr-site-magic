import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type RotationDegrees = 90 | 180 | 270;

export const usePDFRotate = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const rotateFile = useCallback(async (file: File, rotation: RotationDegrees, pageNumbers?: number[]) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setProgress(40);

      const pages = pdfDoc.getPages();
      const pagesToRotate = pageNumbers || pages.map((_, i) => i + 1);

      pagesToRotate.forEach((pageNum) => {
        if (pageNum >= 1 && pageNum <= pages.length) {
          const page = pages[pageNum - 1];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        }
      });
      setProgress(60);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(80);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `rotated_${Date.now()}.pdf`;
        const filePath = `${user.id}/rotate/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob);
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "rotate",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: `PDF rotated ${rotation}° successfully.`,
      });
    } catch (error) {
      console.error("Rotate error:", error);
      toast({
        title: "Error",
        description: "Failed to rotate PDF.",
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

  return { rotateFile, isProcessing, progress, downloadUrl, reset };
};
