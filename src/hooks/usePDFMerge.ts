import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { pdfWorker } from "@/lib/pdfWorkerClient";
import { useProgress } from "@/hooks/useProgress";

export const usePDFMerge = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { progress, eta, start, update, finish, cancel } = useProgress();
  const abortRef = useRef<AbortSignal | null>(null);

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
    abortRef.current = start();

    try {
      // Read all files as ArrayBuffer in parallel
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));

      // Run merge in Web Worker — UI stays responsive
      const merged = await pdfWorker.run(
        { op: "merge", payload: { files: buffers } },
        { onProgress: update, signal: abortRef.current }
      );

      const blob = new Blob([new Uint8Array(merged)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Optional: log job for authenticated users
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `merged_${Date.now()}.pdf`;
        const filePath = `${user.id}/merged/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob, {
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

      finish();
      toast({
        title: "Success!",
        description: `Successfully merged ${files.length} PDF files.`,
      });
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        toast({ title: "Cancelled", description: "Merge cancelled." });
      } else {
        console.error("Error merging PDFs:", error);
        toast({
          title: "Error",
          description: "Failed to merge PDF files. Please try again.",
          variant: "destructive",
        });
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
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return {
    mergeFiles,
    isProcessing,
    progress,
    eta,
    downloadUrl,
    reset,
    cancel,
  };
};
