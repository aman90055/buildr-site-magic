import { Brain, Sparkles, FileText, Image, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompressionAnalysis } from "@/hooks/useAICompressionAnalysis";

interface AICompressionAnalysisProps {
  analysis: CompressionAnalysis | null;
  isAnalyzing: boolean;
  onApplyRecommendation: (level: number) => void;
  disabled?: boolean;
}

const AICompressionAnalysis = ({
  analysis,
  isAnalyzing,
  onApplyRecommendation,
  disabled,
}: AICompressionAnalysisProps) => {
  if (isAnalyzing) {
    return (
      <div className="glass-card rounded-xl p-6 border border-brand-ai/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center animate-pulse-glow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              AI Analysis
              <Loader2 className="w-4 h-4 animate-spin text-brand-ai" />
            </h3>
            <p className="text-sm text-muted-foreground">Analyzing PDF content...</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-ai animate-shimmer" style={{ width: "60%" }} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Detecting content type and optimal settings
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl p-6 border border-brand-ai/30 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Recommendation</h3>
            <p className="text-sm text-muted-foreground">{analysis.contentType}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gradient-ai">{analysis.recommendedLevel}%</div>
          <p className="text-xs text-muted-foreground">Optimal Level</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Text</span>
          </div>
          <p className={`text-sm font-semibold ${analysis.hasText ? "text-accent" : "text-muted-foreground"}`}>
            {analysis.hasText ? "Detected" : "None"}
          </p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Image className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Images</span>
          </div>
          <p className={`text-sm font-semibold ${analysis.hasImages ? "text-accent" : "text-muted-foreground"}`}>
            {analysis.hasImages ? "Detected" : "None"}
          </p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Reduction</span>
          </div>
          <p className="text-sm font-semibold text-accent">{analysis.estimatedReduction}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 bg-muted/30 rounded-lg p-3">
        💡 {analysis.reasoning}
      </p>

      <Button
        onClick={() => onApplyRecommendation(analysis.recommendedLevel)}
        disabled={disabled}
        className="w-full bg-gradient-ai hover:opacity-90 transition-opacity font-semibold"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Apply AI Recommendation
      </Button>
    </div>
  );
};

export default AICompressionAnalysis;
