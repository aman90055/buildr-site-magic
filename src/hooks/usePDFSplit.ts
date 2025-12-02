import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePDFSplit = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const splitFile = async (file: File, selectedPages: number[]) => {
    if (selectedPages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one page to extract.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Load the source PDF
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      setProgress(20);

      // Create a new PDF document
      const newPdf = await PDFDocument.create();
      setProgress(30);

      // Copy selected pages (convert to 0-indexed)
      const pageIndices = selectedPages.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      setProgress(60);

      // Add copied pages to new document
      copiedPages.forEach((page) => newPdf.addPage(page));
      setProgress(80);

      // Save the new PDF
      const newPdfBytes = await newPdf.save();
      setProgress(90);

      // Create a blob and download URL
      const blob = new Blob([new Uint8Array(newPdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Only log to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const fileName = `split_${Date.now()}.pdf`;
        const filePath = `${user.id}/split/${fileName}`;

        await supabase.storage
          .from("pdfs")
          .upload(filePath, blob, {
            contentType: "application/pdf",
            upsert: false,
          });

        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "split",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);

      toast({
        title: "Success!",
        description: `Successfully extracted ${selectedPages.length} pages.`,
      });
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to split PDF file. Please try again.",
        variant: "destructive",
      });

      // Log failed job only if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "split",
          status: "failed",
          input_files: [file.name],
          error_message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setProgress(0);
  };

  return {
    splitFile,
    isProcessing,
    progress,
    downloadUrl,
    reset,
  };
};
