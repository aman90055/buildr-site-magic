import { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type WatermarkPosition = "center" | "diagonal" | "top" | "bottom";

export const usePDFWatermark = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const addWatermark = useCallback(async (
    file: File,
    text: string,
    position: WatermarkPosition = "center",
    opacity: number = 0.3,
    fontSize: number = 48
  ) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      setProgress(40);

      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x: number, y: number;

        switch (position) {
          case "diagonal":
            x = width / 2;
            y = height / 2;
            page.drawText(text, {
              x, y, size: fontSize, font,
              color: rgb(0.5, 0.5, 0.5),
              opacity,
              rotate: degrees(-45),
            });
            return;
          case "top":
            x = (width - textWidth) / 2;
            y = height - 60;
            break;
          case "bottom":
            x = (width - textWidth) / 2;
            y = 40;
            break;
          default:
            x = (width - textWidth) / 2;
            y = height / 2;
        }

        page.drawText(text, {
          x, y, size: fontSize, font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
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
        const fileName = `watermarked_${Date.now()}.pdf`;
        const filePath = `${user.id}/watermark/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob);
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "add_watermark",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: "Watermark added successfully.",
      });
    } catch (error) {
      console.error("Add watermark error:", error);
      toast({
        title: "Error",
        description: "Failed to add watermark.",
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

  return { addWatermark, isProcessing, progress, downloadUrl, reset };
};
