import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

export interface PageInfo {
  index: number;
  id: string;
}

export const usePDFOrganize = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const loadPDF = useCallback(async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      return count;
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to load PDF",
        variant: "destructive",
      });
      return 0;
    }
  }, []);

  const reorganizePages = useCallback(async (file: File, newOrder: number[]) => {
    setIsProcessing(true);
    setProgress(20);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);

      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      setProgress(60);

      for (let i = 0; i < newOrder.length; i++) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [newOrder[i]]);
        newPdf.addPage(copiedPage);
        setProgress(60 + (i / newOrder.length) * 30);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);

      toast({
        title: "Success!",
        description: "PDF pages reorganized successfully",
      });
    } catch (error) {
      console.error("Error reorganizing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to reorganize PDF",
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
    setPageCount(0);
  }, [downloadUrl]);

  return { loadPDF, reorganizePages, isProcessing, progress, downloadUrl, pageCount, reset };
};