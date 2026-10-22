import { useState, useCallback } from "react";
import { pdfWorker } from "@/lib/pdfWorkerClient";
import { toast } from "@/hooks/use-toast";

export const usePDFProtect = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const protectFile = useCallback(async (file: File, password: string) => {
    if (!password || password.length < 4) {
      toast({
        title: "Error",
        description: "Password must be at least 4 characters",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    try {
      const pdfBytes = await pdfWorker.run({ op: "password", payload: { file: await file.arrayBuffer(), password, mode: "protect" } }, { onProgress: setProgress });
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "PDF Protected!",
        description: "Your PDF now requires your password to open (AES-256).",
      });
    } catch (error) {
      console.error("Error protecting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to protect PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setProgress(0);
  }, [downloadUrl]);

  return { protectFile, isProcessing, progress, downloadUrl, reset };
};