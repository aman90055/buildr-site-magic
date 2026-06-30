import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free Forever",
    price: "₹0",
    cadence: "always",
    desc: "Every core tool, unlimited file size, no signup wall.",
    features: ["100+ tools", "Unlimited file size", "Client-side privacy", "Daily check-in credits"],
    cta: { label: "Start Free", to: "/auth?next=/merge" },
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹199",
    cadence: "/ month",
    desc: "AI quotas, priority processing, premium templates.",
    features: ["Unlimited AI requests", "Priority queue", "Premium templates", "Ad-free experience", "Cloud sync"],
    cta: { label: "Go Pro", to: "/auth?next=/dashboard" },
    highlight: true,
  },
  {
    name: "Teams",
    price: "Custom",
    cadence: "annual",
    desc: "SSO-ready, shared workspaces, audit logs, invoicing.",
    features: ["Shared workspace", "Roles & permissions", "Audit logs", "GST invoices", "Priority support"],
    cta: { label: "Talk to Sales", to: "/enterprise" },
    highlight: false,
  },
];

export default function PricingTeaser() {
  return (
    <section id="pricing" aria-label="Simple pricing" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-border/60 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-ai" />
            Simple pricing, no surprises
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">
            Free forever for the essentials.
            <span className="block bg-gradient-to-r from-primary via-brand-ai to-accent bg-clip-text text-transparent">
              Pro when you scale.
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Core PDF tools stay 100% free. Upgrade only for advanced AI and team features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-6 sm:p-8 glass-card border transition-all duration-300 hover:-translate-y-1 ${
                t.highlight
                  ? "border-primary/50 shadow-[0_30px_90px_-40px_hsl(var(--primary)/0.55)]"
                  : "border-border/60"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-gradient-ai text-white shadow-lg">
                  Most popular
                </span>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-display font-bold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.cadence}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>

              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-brand-green shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className={`mt-7 w-full rounded-2xl font-display ${
                  t.highlight ? "bg-gradient-ai hover:opacity-90" : ""
                }`}
                variant={t.highlight ? "default" : "outline"}
              >
                <Link to={t.cta.to}>
                  {t.cta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
