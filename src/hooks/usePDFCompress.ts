import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { compressPDF, type CompressSettings } from "@/lib/pdfCompressEngine";

export const usePDFCompress = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [method, setMethod] = useState<"lossless" | "rasterized" | null>(null);

  const compressFile = async (file: File, settings: CompressSettings) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusLabel("Preparing document");
    setOriginalSize(file.size);

    try {
      const result = await compressPDF(file, settings, (p, label) => {
        setProgress(p);
        if (label) setStatusLabel(label);
      });

      // Never hand back something bigger than the original.
      const finalBytes =
        result.bytes.byteLength < file.size
          ? result.bytes
          : new Uint8Array(await file.arrayBuffer());
      const usedOriginal = finalBytes.byteLength >= file.size;

      const blob = new Blob([finalBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setCompressedSize(blob.size);
      setMethod(usedOriginal ? "lossless" : result.method);
      setStatusLabel("Done");

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const filePath = `${user.id}/compress/compressed_${Date.now()}.pdf`;
        await supabase.storage
          .from("pdfs")
          .upload(filePath, blob, { contentType: "application/pdf", upsert: false });
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: "compress",
          status: "completed",
          input_files: [file.name],
          output_file: filePath,
        });
      }

      setProgress(100);
      const reduction = Math.max(0, Math.round((1 - blob.size / file.size) * 100));
      toast({
        title: usedOriginal ? "Already optimized" : "Compressed!",
        description: usedOriginal
          ? "This PDF is already as small as it can get without quality loss."
          : `Size reduced by ${reduction}%${
              settings.targetKB ? ` (target ${settings.targetKB} KB)` : ""
            }.`,
      });
    } catch (error) {
      console.error("Error compressing PDF:", error);
      toast({
        title: "Compression failed",
        description:
          error instanceof Error ? error.message : "Could not compress this PDF. Please try again.",
        variant: "destructive",
      });

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

  const reset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
    setStatusLabel("");
    setOriginalSize(null);
    setCompressedSize(null);
    setMethod(null);
  };

  return {
    compressFile,
    isProcessing,
    progress,
    statusLabel,
    downloadUrl,
    originalSize,
    compressedSize,
    method,
    reset,
  };
};
