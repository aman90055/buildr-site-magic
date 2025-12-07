import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAIImageGenerate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-generate-image", {
        body: { prompt },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setGeneratedImage(data.imageUrl);
      
      toast({
        title: "Image Generated",
        description: "AI image created successfully!",
      });
      
      return data.imageUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedImage(null);
  }, []);

  return { generateImage, isGenerating, generatedImage, reset };
};
