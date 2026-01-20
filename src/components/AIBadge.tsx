import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  className?: string;
  variant?: "default" | "small" | "inline";
  glow?: boolean;
}

const AIBadge = ({ className, variant = "default", glow = true }: AIBadgeProps) => {
  const baseClasses = "inline-flex items-center gap-1.5 font-display font-semibold bg-gradient-ai text-white rounded-full";
  
  const variants = {
    default: "px-3 py-1.5 text-xs",
    small: "px-2 py-1 text-[10px]",
    inline: "px-2 py-0.5 text-[10px]",
  };

  return (
    <span 
      className={cn(
        baseClasses,
        variants[variant],
        glow && "pulse-glow",
        className
      )}
    >
      <Sparkles className={cn(
        "animate-pulse-subtle",
        variant === "default" ? "w-3.5 h-3.5" : "w-3 h-3"
      )} />
      <span>AI</span>
    </span>
  );
};

export default AIBadge;
