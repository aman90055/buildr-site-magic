import { Link } from "react-router-dom";
import { Check, X, Sparkles, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const plans = [
  {
    name: "Free",
    icon: Rocket,
    price: "₹0",
    period: "forever",
    tagline: "Everything you need to get started",
    cta: "Start Free",
    href: "/auth?next=/merge",
    highlight: false,
    color: "from-brand-blue to-brand-cyan",
    features: [
      "100+ PDF, AI & document tools",
      "Unlimited file size",
      "Client-side processing (private)",
      "OCR, summarization, translation",
      "Community support",
    ],
  },
  {
    name: "Pro",
    icon: Sparkles,
    price: "₹299",
    period: "/month",
    tagline: "For power users & professionals",
    cta: "Upgrade to Pro",
    href: "/premium",
    highlight: true,
    color: "from-brand-ai to-brand-purple",
    features: [
      "Everything in Free",
      "Priority AI processing (2× faster)",
      "Batch operations (up to 100 files)",
      "Advanced OCR (50+ languages)",
      "Cloud workspace + version history",
      "No ads, priority email support",
    ],
  },
  {
    name: "Business",
    icon: Crown,
    price: "₹999",
    period: "/month",
    tagline: "For teams & organizations",
    cta: "Contact Sales",
    href: "/enterprise",
    highlight: false,
    color: "from-brand-orange to-brand-pink",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "SSO & role-based access",
      "API access (10k calls/month)",
      "Custom branding & white-label",
      "Dedicated account manager",
    ],
  },
];

const comparisonRows: { label: string; free: string | boolean; pro: string | boolean; business: string | boolean }[] = [
  { label: "Tool access", free: "100+", pro: "100+", business: "100+ · API" },
  { label: "Max file size", free: "Unlimited", pro: "Unlimited", business: "Unlimited" },
  { label: "Batch processing", free: "5 files", pro: "100 files", business: "Unlimited" },
  { label: "AI credits / month", free: "50", pro: "5,000", business: "50,000" },
  { label: "OCR languages", free: "10", pro: "50+", business: "50+" },
  { label: "Team seats", free: false, pro: "1", business: "10 (add-ons)" },
  { label: "API access", free: false, pro: false, business: true },
  { label: "White-label", free: false, pro: false, business: true },
  { label: "Priority support", free: false, pro: true, business: true },
  { label: "SLA 99.9%", free: false, pro: false, business: true },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (value === true) return <Check className="w-5 h-5 text-brand-green mx-auto" aria-label="Included" />;
  if (value === false) return <X className="w-5 h-5 text-muted-foreground/40 mx-auto" aria-label="Not included" />;
  return <span className="text-sm text-foreground">{value}</span>;
};

const PricingSection = () => {
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "The Docunova AI Suite",
    description: "100+ free PDF, AI, image & document tools. Free forever plan with paid Pro & Business tiers.",
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.replace(/[^\d]/g, "") || "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      description: p.tagline,
    })),
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 relative overflow-hidden" aria-labelledby="pricing-heading">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(pricingSchema)}</script>
      </Helmet>

      {/* Background glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary/10 via-brand-ai/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-primary/20 text-xs font-medium text-primary mb-4">
            Simple, transparent pricing
          </div>
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
            Free for everyone. <span className="bg-gradient-to-r from-primary via-brand-ai to-accent bg-clip-text text-transparent">Pro when you need more.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Start with our free forever plan. Upgrade any time — cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col ${
                plan.highlight
                  ? "glass-card border-2 border-primary/50 shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.4)] md:scale-105"
                  : "glass-card border border-border/60"
              } transition-all duration-500 hover:-translate-y-1`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-brand-ai text-white shadow-md">
                  Most Popular
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5 shadow-lg`}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-display font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className={`mt-8 w-full h-12 rounded-xl font-display font-semibold ${
                  plan.highlight
                    ? "bg-gradient-ai text-white shadow-cta hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6)]"
                    : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                } transition-all duration-300`}
              >
                <Link to={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <h3 className="text-center text-2xl sm:text-3xl font-display font-bold mb-8 text-foreground">
            Compare plans in detail
          </h3>
          <div className="glass-card rounded-2xl border border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border/60">
                  <tr>
                    <th className="text-left px-5 py-4 font-display font-semibold text-foreground">Feature</th>
                    <th className="px-5 py-4 font-display font-semibold text-foreground text-center">Free</th>
                    <th className="px-5 py-4 font-display font-semibold text-primary text-center">Pro</th>
                    <th className="px-5 py-4 font-display font-semibold text-foreground text-center">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-transparent" : "bg-secondary/20"}>
                      <td className="px-5 py-3.5 text-foreground/90">{row.label}</td>
                      <td className="px-5 py-3.5 text-center"><Cell value={row.free} /></td>
                      <td className="px-5 py-3.5 text-center bg-primary/5"><Cell value={row.pro} /></td>
                      <td className="px-5 py-3.5 text-center"><Cell value={row.business} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Prices in INR. GST applicable for Indian customers. Cancel or switch plans anytime — no lock-in.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
