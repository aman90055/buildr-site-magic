import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type AnalyzeAction = "summarize" | "extract-info" | "qa";

export const useAIAnalyze = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const analyze = useCallback(async (text: string, action: AnalyzeAction) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: { text, action },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data.result);
      return data.result;
    } catch (error) {
      console.error("AI analyze error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze document",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { analyze, isAnalyzing, result, reset };
};
