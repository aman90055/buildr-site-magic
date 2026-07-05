import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Cloud, HardDrive, FolderOpen, Box, FileText, Sheet, Calendar, Mail, Inbox, MessageSquare, Hash, StickyNote, ListChecks, Zap, Workflow, Webhook, ArrowRight } from "lucide-react";

type Integration = { name: string; description: string; icon: any; gradient: string; status: "live" | "beta" | "soon"; category: string };

const integrations: Integration[] = [
  { name: "Google Drive", description: "Import / export PDFs directly from Drive", icon: HardDrive, gradient: "from-yellow-400 to-green-500", status: "soon", category: "Cloud Storage" },
  { name: "Microsoft OneDrive", description: "Sync files with OneDrive & SharePoint", icon: Cloud, gradient: "from-blue-500 to-cyan-500", status: "soon", category: "Cloud Storage" },
  { name: "Dropbox", description: "Save and open files from Dropbox", icon: FolderOpen, gradient: "from-blue-600 to-indigo-600", status: "soon", category: "Cloud Storage" },
  { name: "Box", description: "Enterprise file storage integration", icon: Box, gradient: "from-sky-500 to-blue-600", status: "soon", category: "Cloud Storage" },
  { name: "Google Docs", description: "Convert Docs ↔ PDF in one click", icon: FileText, gradient: "from-blue-500 to-indigo-500", status: "soon", category: "Productivity" },
  { name: "Google Sheets", description: "Import tables, export to PDF", icon: Sheet, gradient: "from-emerald-500 to-green-600", status: "soon", category: "Productivity" },
  { name: "Google Calendar", description: "Auto-attach signed PDFs to events", icon: Calendar, gradient: "from-blue-500 to-purple-500", status: "soon", category: "Productivity" },
  { name: "Gmail", description: "Send generated documents from your inbox", icon: Mail, gradient: "from-red-500 to-rose-500", status: "soon", category: "Communication" },
  { name: "Outlook", description: "Send via Outlook & Microsoft 365", icon: Inbox, gradient: "from-blue-600 to-sky-500", status: "soon", category: "Communication" },
  { name: "Slack", description: "Post completed jobs to channels", icon: MessageSquare, gradient: "from-purple-500 to-pink-500", status: "soon", category: "Communication" },
  { name: "Discord", description: "Notify your community in Discord", icon: Hash, gradient: "from-indigo-500 to-violet-600", status: "soon", category: "Communication" },
  { name: "Notion", description: "Embed PDFs into Notion pages", icon: StickyNote, gradient: "from-slate-700 to-slate-500", status: "soon", category: "Productivity" },
  { name: "Trello", description: "Attach files to cards automatically", icon: ListChecks, gradient: "from-sky-500 to-blue-600", status: "soon", category: "Productivity" },
  { name: "Zapier", description: "5,000+ apps via Zapier automation", icon: Zap, gradient: "from-orange-500 to-amber-500", status: "soon", category: "Automation" },
  { name: "Make", description: "Visual automation flows", icon: Workflow, gradient: "from-purple-500 to-fuchsia-500", status: "soon", category: "Automation" },
  { name: "Webhooks", description: "Real-time events to any endpoint", icon: Webhook, gradient: "from-cyan-500 to-blue-500", status: "beta", category: "Developer" },
];

const statusStyles: Record<string, string> = {
  live: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  beta: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  soon: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

const Integrations = () => {
  const categories = Array.from(new Set(integrations.map((i) => i.category)));
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Integrations — Connect Document Edit Pro with your stack</title>
        <meta name="description" content="Google Drive, OneDrive, Dropbox, Gmail, Slack, Notion, Zapier and more — connect The Docunova AI Suite to the tools you already use." />
        <link rel="canonical" href="/integrations" />
      </Helmet>

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 mb-6">
              <Cloud className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold tracking-wider uppercase">Integrations Hub</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-4">
              Connect <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">every tool</span> in your stack
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              16+ integrations across cloud storage, productivity, communication, automation and developer tooling. Join the waitlist for early access.
            </p>
            <Link to="/newsletter" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Get notified <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categories.map((cat) => (
            <div key={cat} className="mb-12">
              <h2 className="font-display font-semibold text-xl mb-5 text-foreground">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {integrations.filter((i) => i.category === cat).map((it) => {
                  const Icon = it.icon;
                  return (
                    <div key={it.name} className="group relative rounded-[22px] p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0 hover:from-blue-400/60 hover:via-purple-400/40 hover:to-cyan-400/60 transition-all duration-500 hover:-translate-y-1.5">
                      <div className="relative h-full rounded-[20px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-5 overflow-hidden">
                        <div className={`pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${it.gradient} opacity-0 group-hover:opacity-25 blur-3xl transition-opacity duration-500`} />
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${it.gradient} flex items-center justify-center shadow-lg ring-1 ring-white/30`}>
                            <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${statusStyles[it.status]}`}>{it.status}</span>
                        </div>
                        <div className="font-display font-semibold text-foreground mb-1">{it.name}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{it.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Integrations;
