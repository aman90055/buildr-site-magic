import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ReferralWidget from "@/components/ReferralWidget";
import DailyCheckinWidget from "@/components/DailyCheckinWidget";
import {
  LayoutDashboard, FileText, Clock, CheckCircle2, XCircle, Loader2,
  Merge, Scissors, FileDown, ImageIcon, FileImage, ScanText, Pencil,
  Lock, RotateCw, Hash, Droplets, Trash2, FileOutput, ExternalLink,
  Star, Bell, Key, Settings as SettingsIcon, Copy, Trash, LogOut,
  Plus, Heart, History as HistoryIcon,
} from "lucide-react";

const jobTypeIcons: Record<string, React.ElementType> = {
  merge: Merge, split: Scissors, compress: FileDown, convert: FileImage,
  "image-to-pdf": ImageIcon, "pdf-to-image": FileImage, ocr: ScanText,
  edit: Pencil, protect: Lock, rotate: RotateCw, "page-numbers": Hash,
  watermark: Droplets, "remove-pages": Trash2, "extract-pages": FileOutput,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock, processing: Loader2, completed: CheckCircle2, failed: XCircle,
};

const POPULAR_TOOLS = [
  { slug: "/merge", label: "Merge PDF", icon: Merge },
  { slug: "/split", label: "Split PDF", icon: Scissors },
  { slug: "/compress", label: "Compress PDF", icon: FileDown },
  { slug: "/convert", label: "Convert PDF", icon: FileImage },
  { slug: "/ocr", label: "OCR", icon: ScanText },
  { slug: "/protect", label: "Protect PDF", icon: Lock },
  { slug: "/edit", label: "Edit PDF", icon: Pencil },
  { slug: "/image-to-pdf", label: "Image to PDF", icon: ImageIcon },
];

interface ApiKey { id: string; name: string; key: string; createdAt: string }

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [prefs, setPrefs] = useState({ emailNotifs: true, marketingEmails: false });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Load localStorage data per user
  useEffect(() => {
    if (!user) return;
    const k = `dep:${user.id}`;
    try {
      setFavorites(JSON.parse(localStorage.getItem(`${k}:favs`) || "[]"));
      setApiKeys(JSON.parse(localStorage.getItem(`${k}:apikeys`) || "[]"));
      setPrefs(JSON.parse(localStorage.getItem(`${k}:prefs`) || JSON.stringify({ emailNotifs: true, marketingEmails: false })));
    } catch { /* noop */ }
  }, [user]);

  const persist = (suffix: string, value: unknown) => {
    if (!user) return;
    localStorage.setItem(`dep:${user.id}:${suffix}`, JSON.stringify(value));
  };

  const toggleFav = (slug: string) => {
    const next = favorites.includes(slug) ? favorites.filter(s => s !== slug) : [...favorites, slug];
    setFavorites(next); persist("favs", next);
  };

  const createApiKey = () => {
    if (!newKeyName.trim()) { toast.error("Enter a name for the key"); return; }
    const key: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      key: `dep_${crypto.randomUUID().replace(/-/g, "")}`,
      createdAt: new Date().toISOString(),
    };
    const next = [key, ...apiKeys];
    setApiKeys(next); persist("apikeys", next); setNewKeyName("");
    toast.success("API key created");
  };

  const deleteKey = (id: string) => {
    const next = apiKeys.filter(k => k.id !== id);
    setApiKeys(next); persist("apikeys", next);
    toast.success("Key revoked");
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard");
  };

  const updatePrefs = (patch: Partial<typeof prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next); persist("prefs", next);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const { data: pdfJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["pdf-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("pdf_jobs").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const stats = {
    total: pdfJobs?.length || 0,
    completed: pdfJobs?.filter((j) => j.status === "completed").length || 0,
    pending: pdfJobs?.filter((j) => j.status === "pending" || j.status === "processing").length || 0,
    failed: pdfJobs?.filter((j) => j.status === "failed").length || 0,
  };

  // Derive notifications from recent jobs
  const notifications = (pdfJobs || []).slice(0, 10).map((j) => ({
    id: j.id,
    title: j.status === "completed" ? `${j.job_type} completed` : j.status === "failed" ? `${j.job_type} failed` : `${j.job_type} ${j.status}`,
    desc: j.error_message || `${Array.isArray(j.input_files) ? j.input_files.length : 0} file(s) processed`,
    date: j.created_at,
    status: j.status,
  }));

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  const formatDate = (s: string) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const getJobTypeLabel = (t: string) => t.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <>
      <Helmet>
        <title>Dashboard | Document Edit Pro AI</title>
        <meta name="description" content="View your PDF processing history, manage favorites, API keys, notifications, and account settings." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Page Header */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-ai flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Welcome back</h1>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Sign out</Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full flex-wrap h-auto justify-start gap-1 bg-card/50 backdrop-blur p-1">
                <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" />Overview</TabsTrigger>
                <TabsTrigger value="history" className="gap-2"><HistoryIcon className="w-4 h-4" />History</TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2"><Heart className="w-4 h-4" />Favorites</TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />Notifications</TabsTrigger>
                <TabsTrigger value="api" className="gap-2"><Key className="w-4 h-4" />API Keys</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2"><SettingsIcon className="w-4 h-4" />Settings</TabsTrigger>
              </TabsList>

              {/* OVERVIEW */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Jobs", value: stats.total, icon: FileText, color: "text-muted-foreground" },
                    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-500/60", num: "text-green-500" },
                    { label: "In Progress", value: stats.pending, icon: Clock, color: "text-blue-500/60", num: "text-blue-500" },
                    { label: "Failed", value: stats.failed, icon: XCircle, color: "text-destructive/60", num: "text-destructive" },
                  ].map((s) => (
                    <Card key={s.label} className="glass-card border-border/40">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                            <p className={`text-2xl font-display font-bold ${s.num || ""}`}>{s.value}</p>
                          </div>
                          <s.icon className={`w-8 h-8 ${s.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <DailyCheckinWidget />
                  <ReferralWidget />
                </div>

                {/* Quick actions */}
                <Card className="glass-card border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />Quick Tools</CardTitle>
                    <CardDescription>Jump straight into your most-used tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {POPULAR_TOOLS.slice(0, 8).map((t) => (
                        <Link key={t.slug} to={t.slug} className="group flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all">
                          <t.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-center">{t.label}</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* HISTORY */}
              <TabsContent value="history">
                <Card className="glass-card border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HistoryIcon className="w-5 h-5" />Document History</CardTitle>
                    <CardDescription>All your processed documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {jobsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
                            <Skeleton className="h-6 w-20" />
                          </div>
                        ))}
                      </div>
                    ) : pdfJobs && pdfJobs.length > 0 ? (
                      <div className="space-y-3">
                        {pdfJobs.map((job) => {
                          const IconComponent = jobTypeIcons[job.job_type] || FileText;
                          const StatusIcon = statusIcons[job.status] || Clock;
                          const inputFiles = Array.isArray(job.input_files) ? job.input_files : [];
                          return (
                            <div key={job.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{getJobTypeLabel(job.job_type)}</span>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[job.status]}`}>
                                    <StatusIcon className={`w-3 h-3 mr-1 ${job.status === "processing" ? "animate-spin" : ""}`} />
                                    {job.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {inputFiles.length > 0 ? `${inputFiles.length} file${inputFiles.length > 1 ? "s" : ""}` : "No files"} • {formatDate(job.created_at)}
                                </p>
                                {job.error_message && <p className="text-xs text-destructive mt-1 truncate">Error: {job.error_message}</p>}
                              </div>
                              {job.output_file && <Button variant="ghost" size="sm" className="flex-shrink-0"><ExternalLink className="w-4 h-4" /></Button>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No history yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start processing PDFs to see them here</p>
                        <Button asChild><Link to="/merge">Get Started</Link></Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAVORITES */}
              <TabsContent value="favorites">
                <Card className="glass-card border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-brand-pink" />Favorite Tools</CardTitle>
                    <CardDescription>Star tools for one-click access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {POPULAR_TOOLS.map((t) => {
                        const isFav = favorites.includes(t.slug);
                        return (
                          <div key={t.slug} className="relative group">
                            <Link to={t.slug} className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all">
                              <t.icon className="w-6 h-6 text-primary mb-2" />
                              <span className="text-xs font-medium text-center">{t.label}</span>
                            </Link>
                            <button
                              onClick={() => toggleFav(t.slug)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-all"
                              aria-label={isFav ? "Unfavorite" : "Favorite"}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? "fill-brand-orange text-brand-orange" : "text-muted-foreground"}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {favorites.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-3">Your favorites ({favorites.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {favorites.map((slug) => {
                            const t = POPULAR_TOOLS.find(p => p.slug === slug);
                            if (!t) return null;
                            return (
                              <Link key={slug} to={slug} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium">
                                <t.icon className="w-3.5 h-3.5" />{t.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* NOTIFICATIONS */}
              <TabsContent value="notifications">
                <Card className="glass-card border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle>
                    <CardDescription>Recent activity on your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notifications.length > 0 ? (
                      <div className="space-y-2">
                        {notifications.map((n) => {
                          const Icon = statusIcons[n.status] || Clock;
                          return (
                            <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${statusColors[n.status]}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium capitalize">{n.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                                <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDate(n.date)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API KEYS */}
              <TabsContent value="api">
                <Card className="glass-card border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" />API Keys</CardTitle>
                    <CardDescription>Create personal API keys for programmatic access. Keys are stored locally on this device.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input placeholder="Key name (e.g. Production)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
                      <Button onClick={createApiKey} className="bg-gradient-ai hover:opacity-90"><Plus className="w-4 h-4 mr-2" />Create Key</Button>
                    </div>
                    {apiKeys.length > 0 ? (
                      <div className="space-y-2">
                        {apiKeys.map((k) => (
                          <div key={k.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Key className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{k.name}</p>
                              <p className="text-xs font-mono text-muted-foreground truncate">{k.key}</p>
                              <p className="text-[10px] text-muted-foreground/70">Created {formatDate(k.createdAt)}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyKey(k.key)} aria-label="Copy key"><Copy className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteKey(k.id)} aria-label="Delete key" className="text-destructive hover:text-destructive"><Trash className="w-4 h-4" /></Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">No API keys yet. Create one above.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SETTINGS */}
              <TabsContent value="settings">
                <Card className="glass-card border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><SettingsIcon className="w-5 h-5" />Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>User ID</Label>
                      <Input value={user.id} disabled className="font-mono text-xs" />
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Email notifications</Label>
                          <p className="text-xs text-muted-foreground">Job completion and account alerts</p>
                        </div>
                        <Switch checked={prefs.emailNotifs} onCheckedChange={(v) => updatePrefs({ emailNotifs: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Marketing emails</Label>
                          <p className="text-xs text-muted-foreground">Product updates and tips</p>
                        </div>
                        <Switch checked={prefs.marketingEmails} onCheckedChange={(v) => updatePrefs({ marketingEmails: v })} />
                      </div>
                    </div>
                    <div className="border-t pt-4 flex flex-wrap gap-2">
                      <Button asChild variant="outline"><Link to="/premium">Manage Premium</Link></Button>
                      <Button asChild variant="outline"><Link to="/refer">Refer & Earn</Link></Button>
                      <Button variant="destructive" onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Sign out</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
