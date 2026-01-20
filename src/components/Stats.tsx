import { Brain, FileText, Users, Zap } from "lucide-react";

const stats = [
  { value: "2M+", label: "PDFs Processed", icon: FileText, color: "text-brand-blue" },
  { value: "99.9%", label: "AI Accuracy", icon: Brain, color: "text-brand-ai" },
  { value: "150+", label: "Countries", icon: Users, color: "text-brand-green" },
  { value: "<1s", label: "Avg. Process Time", icon: Zap, color: "text-brand-orange" }
];

const Stats = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-ai-subtle" />
      
      <div className="container relative mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
