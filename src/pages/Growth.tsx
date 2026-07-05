import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Users, DollarSign, Award, Sparkles, GraduationCap, BookOpen, Rocket, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

const programs = [
  { slug: "/refer", name: "Referral Program", tagline: "Earn credits for every friend", description: "Share your link and earn credits for every new sign-up. Both you and your friend get rewards.", icon: Users, gradient: "from-blue-500 to-indigo-600", benefits: ["Unique referral code", "Credits for each signup", "Bonus on first payment", "Lifetime tracking"], cta: "Open Referral Dashboard" },
  { slug: "/affiliate", name: "Affiliate Dashboard", tagline: "Up to 30% recurring commission", description: "Promote The Docunova AI Suite to your audience and earn recurring commissions on every paid plan.", icon: DollarSign, gradient: "from-emerald-500 to-green-600", benefits: ["30% recurring revenue", "Real-time analytics", "Custom links + assets", "Monthly payouts"], cta: "Become an Affiliate" },
  { slug: "/ambassador", name: "Ambassador Program", tagline: "For top community leaders", description: "Elite tier for power-users and creators who want to shape the product and access exclusive perks.", icon: Award, gradient: "from-purple-500 to-fuchsia-600", benefits: ["Exclusive roadmap access", "Free Pro for life", "Co-marketing", "Direct line to founders"], cta: "Apply Now" },
  { slug: "/creators", name: "Creator Program", tagline: "Tools + revenue for creators", description: "YouTubers, bloggers and educators get free Pro, custom links and revenue share for tutorials.", icon: Sparkles, gradient: "from-pink-500 to-rose-600", benefits: ["Free Pro plan", "Custom UTM links", "Revenue share", "Featured placement"], cta: "Join as Creator" },
  { slug: "/students", name: "Student Program", tagline: "100% free Pro for students", description: "Verified students get full Pro access free of charge. Build your portfolio with premium tools.", icon: GraduationCap, gradient: "from-cyan-500 to-blue-600", benefits: ["Free Pro plan", "Education resources", "Internship matching", "Student showcase"], cta: "Verify Student Status" },
  { slug: "/education", name: "Education Discounts", tagline: "Up to 70% off for schools", description: "Special pricing for schools, colleges and bootcamps. Bulk licensing for entire institutions.", icon: BookOpen, gradient: "from-teal-500 to-emerald-600", benefits: ["Up to 70% off", "Bulk licensing", "Training materials", "Dedicated support"], cta: "Get Education Pricing" },
  { slug: "/startups", name: "Startup Program", tagline: "Free Pro for 12 months", description: "Early-stage startups (<$1M funding) get one full year of Pro free + onboarding support.", icon: Rocket, gradient: "from-orange-500 to-red-500", benefits: ["12 months free Pro", "Founder community", "Startup credits", "Priority support"], cta: "Apply for Startups" },
  { slug: "/enterprise", name: "Enterprise Sales Portal", tagline: "Custom plans for 100+ seats", description: "SSO, audit logs, dedicated infrastructure, custom contracts and 24/7 priority support.", icon: Building2, gradient: "from-slate-700 to-slate-500", benefits: ["SSO + SCIM", "99.99% SLA", "Custom contracts", "Dedicated CSM"], cta: "Contact Sales" },
];

const Growth = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Business Growth Programs — Affiliates, Students, Startups & more</title>
        <meta name="description" content="Referral, Affiliate, Ambassador, Creator, Student, Education, Startup and Enterprise programs from The Docunova AI Suite." />
        <link rel="canonical" href="/growth" />
      </Helmet>

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 mb-6">
              <Rocket className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold tracking-wider uppercase">Business Growth</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-4">
              Grow <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">together</span> with us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Eight programs designed to reward our community — from solo referrers to global enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.slug} className="group relative rounded-[24px] p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-blue-400/60 hover:via-purple-400/40 hover:to-cyan-400/60 transition-all duration-500 hover:-translate-y-1">
                  <div className="relative h-full rounded-[22px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 p-7 overflow-hidden shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]">
                    <div className={`pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg ring-1 ring-white/40 dark:ring-white/10 shrink-0`}>
                        <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">{p.tagline}</div>
                        <h3 className="font-display font-bold text-xl text-foreground">{p.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.description}</p>
                    <ul className="space-y-2 mb-6">
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                    <Link to={p.slug} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${p.gradient} text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all`}>
                      {p.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Growth;
