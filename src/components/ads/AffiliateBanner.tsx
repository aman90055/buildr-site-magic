import { ExternalLink } from "lucide-react";

interface AffiliateItem {
  name: string;
  description: string;
  url: string;
  cta: string;
  color: string;
  icon: string;
}

const affiliates: AffiliateItem[] = [
  {
    name: "Adobe Acrobat Pro",
    description: "Professional PDF editing & conversion. Get 7-day free trial!",
    url: "https://www.adobe.com/acrobat.html",
    cta: "Try Free →",
    color: "from-red-500/20 to-red-600/10 border-red-500/20",
    icon: "📄",
  },
  {
    name: "Canva Pro",
    description: "Design stunning documents, presentations & social media graphics.",
    url: "https://www.canva.com/pro/",
    cta: "Start Free →",
    color: "from-purple-500/20 to-blue-500/10 border-purple-500/20",
    icon: "🎨",
  },
  {
    name: "Notion",
    description: "All-in-one workspace for docs, notes & project management.",
    url: "https://www.notion.so/",
    cta: "Get Free →",
    color: "from-gray-500/20 to-gray-600/10 border-gray-500/20",
    icon: "📝",
  },
  {
    name: "Grammarly",
    description: "AI-powered writing assistant. Fix grammar, spelling & tone instantly.",
    url: "https://www.grammarly.com/",
    cta: "Try Free →",
    color: "from-green-500/20 to-green-600/10 border-green-500/20",
    icon: "✍️",
  },
];

interface AffiliateBannerProps {
  variant?: "horizontal" | "compact" | "sidebar";
  maxItems?: number;
  className?: string;
}

const AffiliateBanner = ({ variant = "horizontal", maxItems = 2, className = "" }: AffiliateBannerProps) => {
  // Rotate affiliates based on day to show variety
  const dayIndex = new Date().getDate() % affiliates.length;
  const items = affiliates.slice(dayIndex, dayIndex + maxItems).concat(
    affiliates.slice(0, Math.max(0, maxItems - (affiliates.length - dayIndex)))
  );

  if (variant === "compact") {
    const item = items[0];
    return (
      <div className={`${className}`}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`block rounded-xl border bg-gradient-to-r ${item.color} p-3 transition-all hover:scale-[1.01] hover:shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
            </div>
            <span className="text-xs font-medium text-primary whitespace-nowrap flex items-center gap-1">
              {item.cta} <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
        <p className="text-[10px] text-muted-foreground/50 mt-1 text-right">Sponsored</p>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`space-y-3 ${className}`}>
        <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">Recommended Tools</p>
        {items.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`block rounded-xl border bg-gradient-to-br ${item.color} p-4 transition-all hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2">
                  {item.cta} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
        <p className="text-[10px] text-muted-foreground/50 text-center">Sponsored</p>
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`${className}`}>
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-3 text-center">Recommended Tools</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`flex items-center gap-4 rounded-xl border bg-gradient-to-r ${item.color} p-4 transition-all hover:scale-[1.01] hover:shadow-lg`}
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <span className="text-xs font-medium text-primary whitespace-nowrap flex items-center gap-1">
                {item.cta} <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">Sponsored</p>
      </div>
    </div>
  );
};

export default AffiliateBanner;
