import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { pdfWorker } from "@/lib/pdfWorkerClient";
import { useProgress } from "@/hooks/useProgress";

export const usePDFSplit = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { progress, eta, start, update, finish, cancel } = useProgress();
  const abortRef = useRef<AbortSignal | null>(null);

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
    abortRef.current = start();

    try {
      const buffer = await file.arrayBuffer();

      // Run split in Web Worker — keeps UI smooth even for huge PDFs
      const result = await pdfWorker.run(
        { op: "split", payload: { file: buffer, pages: selectedPages } },
        { onProgress: update, signal: abortRef.current }
      );

      const blob = new Blob([new Uint8Array(result)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `split_${Date.now()}.pdf`;
        const filePath = `${user.id}/split/${fileName}`;
        await supabase.storage.from("pdfs").upload(filePath, blob, {
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

      finish();
      toast({
        title: "Success!",
        description: `Successfully extracted ${selectedPages.length} pages.`,
      });
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        toast({ title: "Cancelled", description: "Split cancelled." });
      } else {
        console.error("Error splitting PDF:", error);
        toast({
          title: "Error",
          description: "Failed to split PDF file. Please try again.",
          variant: "destructive",
        });
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
    splitFile,
    isProcessing,
    progress,
    eta,
    downloadUrl,
    reset,
    cancel,
  };
};
