import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { CompressionLevel } from "@/pages/PDFCompress";

export const usePDFCompress = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const compressFile = async (file: File, level: CompressionLevel) => {
    setIsProcessing(true);
    setProgress(0);
    setOriginalSize(file.size);

    try {
      // Load the source PDF
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const sourcePdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });
      setProgress(40);

      // Create a new optimized PDF by copying pages
      const compressedPdf = await PDFDocument.create();
      const pages = sourcePdf.getPages();
      
      // Copy all pages to a new document (this removes unused objects)
      const copiedPages = await compressedPdf.copyPages(
        sourcePdf,
        pages.map((_, i) => i)
      );
      
      copiedPages.forEach((page) => compressedPdf.addPage(page));
      setProgress(60);

      // Get compression options based on level
      const compressionOptions = getCompressionOptions(level);

      // Save with compression options
      const compressedBytes = await compressedPdf.save({
        useObjectStreams: compressionOptions.useObjectStreams,
        addDefaultPage: false,
      });
      setProgress(80);

      // Create a blob and download URL
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setCompressedSize(blob.size);
      setProgress(90);

      // Only log to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const fileName = `compressed_${Date.now()}.pdf`;
        const filePath = `${user.id}/compress/${fileName}`;

        await supabase.storage
          .from("pdfs")
          .upload(filePath, blob, {
            contentType: "application/pdf",
            upsert: false,
          });

        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "compress",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);

      const reduction = Math.round((1 - blob.size / file.size) * 100);
      toast({
        title: "Success!",
        description: `PDF compressed successfully. Size reduced by ${reduction}%.`,
      });
    } catch (error) {
      console.error("Error compressing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to compress PDF file. Please try again.",
        variant: "destructive",
      });

      // Log failed job only if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "compress",
          status: "failed",
          input_files: [file.name],
          error_message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getCompressionOptions = (level: CompressionLevel) => {
    // Level 1-100: higher = more compression
    return {
      useObjectStreams: level > 30,
    };
  };

  const reset = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setProgress(0);
    setOriginalSize(null);
    setCompressedSize(null);
  };

  return {
    compressFile,
    isProcessing,
    progress,
    downloadUrl,
    originalSize,
    compressedSize,
    reset,
  };
};