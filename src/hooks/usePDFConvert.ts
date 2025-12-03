import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ConversionType } from "@/pages/PDFConvert";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const usePDFConvert = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const convertFile = async (file: File, type: ConversionType) => {
    setIsProcessing(true);
    setProgress(0);
    setImageUrls([]);
    setExtractedText(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(10);

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      setProgress(20);

      if (type === "images") {
        await convertToImages(pdf, numPages);
      } else {
        await extractText(pdf, numPages);
      }

      // Log to database if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: `convert_${type}`,
          status: "completed",
          input_files: [file.name],
        });
      }

      toast({
        title: "Success!",
        description: type === "images" 
          ? `Converted ${numPages} pages to images.`
          : "Text extracted successfully.",
      });
    } catch (error) {
      console.error("Error converting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to convert PDF file. Please try again.",
        variant: "destructive",
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("pdf_jobs").insert({
          user_id: user.id,
          job_type: `convert_${type}`,
          status: "failed",
          input_files: [file.name],
          error_message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToImages = async (pdf: pdfjsLib.PDFDocumentProxy, numPages: number) => {
    const urls: string[] = [];
    const scale = 2; // Higher scale for better quality

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Failed to get canvas context");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const dataUrl = canvas.toDataURL("image/png");
      urls.push(dataUrl);

      setProgress(20 + Math.round((i / numPages) * 70));
    }

    setImageUrls(urls);
    setProgress(100);
  };

  const extractText = async (pdf: pdfjsLib.PDFDocumentProxy, numPages: number) => {
    let fullText = "";

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      
      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      
      setProgress(20 + Math.round((i / numPages) * 70));
    }

    setExtractedText(fullText.trim());
    setProgress(100);
  };

  const reset = () => {
    imageUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setImageUrls([]);
    setExtractedText(null);
    setProgress(0);
  };

  return {
    convertFile,
    isProcessing,
    progress,
    imageUrls,
    extractedText,
    reset,
  };
};