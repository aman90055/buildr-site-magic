import { Link } from "react-router-dom";
import { ArrowRight, FileText, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLIC_PDF_START_PATH } from "@/lib/homeAccess";

const access = [
  { icon: FileText, title: "Core PDF tools — free", text: "Merge, split, compress and organise PDFs without signing in or paying. No app-defined file-size cap or daily processing quota. Browser memory and supported file formats still apply." },
  { icon: Brain, title: "AI helpers — usage limits apply", text: "AI requests have tool-specific input and request limits, not an unlimited allowance. Availability depends on the online service. Submitted text or images are sent for processing; they do not stay only on your device." },
  { icon: Heart, title: "Support is optional", text: "You do not need a subscription or donation to use core PDF tools. Donations support the project; they do not promise extra AI credits, faster processing, team seats or API access." },
];

const PricingSection = () => (
  <section id="pricing" className="py-16 sm:py-20" aria-labelledby="pricing-heading">
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-display font-bold text-foreground">Free PDF tools. Clear access limits.</h2>
      <div className="grid gap-8 md:grid-cols-3 mt-10">
        {access.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border-t border-border pt-6">
            <Icon className="h-6 w-6 text-primary mb-4" />
            <h3 className="text-xl font-display font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
      <Button asChild size="lg" className="mt-8">
        <Link to={PUBLIC_PDF_START_PATH}>Start Free<ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </div>
  </section>
);

export default PricingSection;
