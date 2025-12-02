import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePDFMerge = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const mergeFiles = async (files: File[]) => {
    if (files.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Copy all pages from the source PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // Add each page to the merged document
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        // Update progress
        setProgress(((i + 1) / totalFiles) * 80);
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      setProgress(90);

      // Create a blob and download URL
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Only log to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const fileName = `merged_${Date.now()}.pdf`;
        const filePath = `${user.id}/merged/${fileName}`;

        await supabase.storage
          .from("pdfs")
          .upload(filePath, blob, {
            contentType: "application/pdf",
            upsert: false,
          });

        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "merge",
          status: "completed",
          input_files: files.map((f) => f.name),
          output_file: filePath,
        });
      }

      setProgress(100);

      toast({
        title: "Success!",
        description: `Successfully merged ${files.length} PDF files.`,
      });
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast({
        title: "Error",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive",
      });

      // Log failed job only if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "merge",
          status: "failed",
          input_files: files.map((f) => f.name),
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
    mergeFiles,
    isProcessing,
    progress,
    downloadUrl,
    reset,
  };
};
