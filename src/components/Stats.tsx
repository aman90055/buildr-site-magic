import { FileText, Laptop, BadgeIndianRupee, UserX } from "lucide-react";
import { TOOL_COUNT } from "@/lib/toolRegistry";

/**
 * Only verifiable facts about the product — no traffic, accuracy or uptime claims.
 */
const stats = [
  { value: String(TOOL_COUNT), label: "Tools available", icon: FileText, color: "text-brand-blue" },
  { value: "In-browser", label: "PDF & image processing", icon: Laptop, color: "text-brand-ai" },
  { value: "₹0", label: "Cost to use every tool", icon: BadgeIndianRupee, color: "text-brand-green" },
  { value: "No signup", label: "Required for PDF tools", icon: UserX, color: "text-brand-orange" },
];

const Stats = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ai-subtle" />
      <div className="container relative mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <h2 className="text-center text-2xl sm:text-3xl font-display font-bold tracking-tight mb-8">
            What Docunova actually gives you
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">
            We don't publish user or usage statistics. AI tools (OCR, chat, translation, image
            generation) send your input to our AI provider for processing — every other tool runs
            entirely on your device.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
