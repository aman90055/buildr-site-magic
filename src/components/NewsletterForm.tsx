import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletter } from "@/hooks/useNewsletter";
import { Sparkles, Loader2 } from "lucide-react";

interface NewsletterFormProps {
  variant?: "default" | "compact";
  className?: string;
}

const NewsletterForm = ({ variant = "default", className = "" }: NewsletterFormProps) => {
  const { email, setEmail, error, isSubmitting, subscribe } = useNewsletter();

  if (variant === "compact") {
    return (
      <form onSubmit={subscribe} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-10 ${error ? "border-destructive" : ""}`}
            disabled={isSubmitting}
          />
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={subscribe} className={className}>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 ${error ? "border-destructive" : ""}`}
            disabled={isSubmitting}
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-12">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Subscribe
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterForm;