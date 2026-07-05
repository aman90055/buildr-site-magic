import { Helmet } from "react-helmet-async";
import { Linkedin, Facebook, Twitter, Instagram, MessageCircle, Send, Hash, Camera, Share2, Briefcase, Users, Image as ImageIcon, FileText, Globe, GraduationCap } from "lucide-react";

const linkedinFeatures = [
  { name: "Company Page", icon: Briefcase, desc: "Optimized company presence with logo, banner, story" },
  { name: "Careers Page", icon: Users, desc: "Open roles, culture, perks — built-in ATS-ready" },
  { name: "Product Showcase", icon: Globe, desc: "Showcase all 100+ tools as LinkedIn Product Pages" },
  { name: "Founder Profile", icon: Users, desc: "Founder thought-leadership content templates" },
  { name: "Employee Profiles", icon: Users, desc: "Team highlight pages with auto-banners" },
  { name: "Open Graph Preview", icon: ImageIcon, desc: "Perfect link preview for every page" },
  { name: "Auto Social Banners", icon: Camera, desc: "Auto-generated banners for every tool page" },
  { name: "Shareable Case Studies", icon: FileText, desc: "One-click share customer success stories" },
  { name: "'Built with' Branding", icon: Share2, desc: "Embed badge in user-generated documents" },
  { name: "Hiring Page", icon: Briefcase, desc: "Standalone hiring funnel with applications" },
  { name: "Internship Page", icon: GraduationCap, desc: "Student internship program & application form" },
  { name: "Portfolio Showcase", icon: ImageIcon, desc: "Highlight customer portfolios & user wins" },
];

const socials = [
  { name: "LinkedIn", icon: Linkedin, gradient: "from-blue-600 to-sky-600", desc: "Professional posts, articles, OG previews" },
  { name: "Facebook", icon: Facebook, gradient: "from-blue-500 to-indigo-600", desc: "Page posts with Open Graph metadata" },
  { name: "X (Twitter)", icon: Twitter, gradient: "from-slate-700 to-slate-900", desc: "Twitter cards, threads, share buttons" },
  { name: "Instagram", icon: Instagram, gradient: "from-pink-500 via-rose-500 to-orange-500", desc: "Story templates + carousel exports" },
  { name: "Threads", icon: MessageCircle, gradient: "from-slate-800 to-black", desc: "Auto-formatted thread snippets" },
  { name: "Reddit", icon: Hash, gradient: "from-orange-500 to-red-600", desc: "Community-friendly post templates" },
  { name: "WhatsApp", icon: MessageCircle, gradient: "from-green-500 to-emerald-600", desc: "Share-to-WhatsApp deep links" },
  { name: "Telegram", icon: Send, gradient: "from-sky-500 to-blue-600", desc: "Telegram preview cards + share" },
  { name: "Discord", icon: Hash, gradient: "from-indigo-500 to-purple-600", desc: "Rich embeds for Discord channels" },
  { name: "Pinterest", icon: ImageIcon, gradient: "from-red-500 to-rose-600", desc: "Pin-ready images for every tool" },
];

const SocialKit = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>LinkedIn & Social Optimization Kit — The Docunova AI Suite</title>
        <meta name="description" content="Auto-generated social banners, LinkedIn pages, Open Graph previews, and optimized sharing for 10 social networks." />
        <link rel="canonical" href="/social-kit" />
      </Helmet>

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 mb-6">
              <Share2 className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold tracking-wider uppercase">Social & LinkedIn Kit</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-4">
              Look <span className="bg-gradient-to-r from-blue-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">premium</span> everywhere
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Auto-generated banners, link previews, LinkedIn pages and optimized sharing for every major platform.
            </p>
          </div>

          {/* LinkedIn Optimization */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center shadow-lg">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">LinkedIn Optimization</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {linkedinFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.name} className="group rounded-2xl p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-blue-400/60 hover:to-sky-400/60 transition-all hover:-translate-y-1">
                    <div className="rounded-[14px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 h-full">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center mb-3 shadow ring-1 ring-white/30">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                      </div>
                      <div className="font-display font-semibold text-foreground mb-1">{f.name}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Media Optimization */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">Optimized for 10 networks</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="group relative rounded-2xl p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-pink-400/60 hover:to-orange-400/60 transition-all hover:-translate-y-1">
                    <div className="rounded-[14px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-4 h-full text-center">
                      <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-lg ring-1 ring-white/30 group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                      </div>
                      <div className="font-display font-semibold text-foreground text-sm mb-1">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialKit;
