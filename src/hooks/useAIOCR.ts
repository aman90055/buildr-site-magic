import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAIOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const processImage = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    setProgress(10);
    setExtractedText(null);

    try {
      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke("ai-ocr", {
        body: { imageData },
      });

      setProgress(80);

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setExtractedText(data.text);
      setProgress(100);
      
      toast({
        title: "OCR Complete",
        description: "Text extracted successfully!",
      });
      
      return data.text;
    } catch (error) {
      console.error("OCR error:", error);
      toast({
        title: "OCR Failed",
        description: error instanceof Error ? error.message : "Failed to extract text",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setExtractedText(null);
    setProgress(0);
  }, []);

  return { processImage, isProcessing, progress, extractedText, reset };
};
