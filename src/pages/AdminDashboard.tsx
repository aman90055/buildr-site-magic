import { Helmet } from "react-helmet-async";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Shield, IndianRupee, TrendingUp, Users, Crown, Mail, RefreshCw, Search,
  Calendar, Activity, ArrowUpRight, Download, Settings as SettingsIcon,
} from "lucide-react";
import { format, subMonths, startOfMonth, startOfDay, subDays, differenceInCalendarDays } from "date-fns";
import {
  SETTINGS_KEYS, isAdsEnabled, isExitIntentEnabled, exitIntentCooldownDays,
  setBool, setNum,
} from "@/lib/siteSettings";

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string;
  premium: { plan: string; is_active: boolean; expires_at: string | null } | null;
}

interface PaymentRow {
  id: string;
  amount: number;
  plan: string;
  status: string;
  created_at: string;
  email: string;
}

type RangePreset = "7d" | "30d" | "mtd" | "ltd" | "custom";

const toCSV = (rows: Record<string, unknown>[]): string => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
};

const downloadFile = (name: string, content: string, type = "text/csv") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");

  // Date range
  const [preset, setPreset] = useState<RangePreset>("30d");
  const [fromDate, setFromDate] = useState<string>(format(subDays(new Date(), 29), "yyyy-MM-dd"));
  const [toDate, setToDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  // Settings UI state (synced from localStorage)
  const [adsOn, setAdsOn] = useState(isAdsEnabled());
  const [exitOn, setExitOn] = useState(isExitIntentEnabled());
  const [cooldown, setCooldown] = useState(exitIntentCooldownDays());

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!data) {
        setIsAdmin(false);
        toast.error("Admin access required");
        navigate("/");
      } else {
        setIsAdmin(true);
      }
    })();
  }, [user, authLoading, navigate]);

  const fetchAll = async () => {
    setLoading(true);
    const [paymentsRes, usersRes] = await Promise.all([
      supabase.from("payment_verifications").select("id, amount, plan, status, created_at, email").order("created_at", { ascending: false }),
      supabase.functions.invoke("admin-users-list", { method: "GET" }),
    ]);

    if (paymentsRes.error) toast.error("Failed to load payments");
    else setPayments(paymentsRes.data || []);

    if (usersRes.error) toast.error("Failed to load users: " + usersRes.error.message);
    else setUsers((usersRes.data as { users: AuthUser[] })?.users || []);

    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  // Apply preset → from/to
  useEffect(() => {
    const now = new Date();
    if (preset === "7d") {
      setFromDate(format(subDays(now, 6), "yyyy-MM-dd"));
      setToDate(format(now, "yyyy-MM-dd"));
    } else if (preset === "30d") {
      setFromDate(format(subDays(now, 29), "yyyy-MM-dd"));
      setToDate(format(now, "yyyy-MM-dd"));
    } else if (preset === "mtd") {
      setFromDate(format(startOfMonth(now), "yyyy-MM-dd"));
      setToDate(format(now, "yyyy-MM-dd"));
    } else if (preset === "ltd") {
      setFromDate("2024-01-01");
      setToDate(format(now, "yyyy-MM-dd"));
    }
  }, [preset]);

  const stats = useMemo(() => {
    const verified = payments.filter((p) => p.status === "verified");
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const thisMonthRev = verified
      .filter((p) => new Date(p.created_at) >= thisMonthStart)
      .reduce((s, p) => s + p.amount, 0);
    const lastMonthRev = verified
      .filter((p) => {
        const d = new Date(p.created_at);
        return d >= lastMonthStart && d < thisMonthStart;
      })
      .reduce((s, p) => s + p.amount, 0);

    const totalRev = verified.reduce((s, p) => s + p.amount, 0);
    const activePremium = users.filter((u) => u.premium?.is_active).length;
    const totalUsers = users.length;
    const conversionRate = totalUsers > 0 ? ((activePremium / totalUsers) * 100).toFixed(1) : "0";
    const growth = lastMonthRev > 0 ? (((thisMonthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(0) : "—";

    // Range-filtered revenue & daily breakdown
    const from = startOfDay(new Date(fromDate));
    const to = startOfDay(new Date(toDate));
    const dayCount = Math.max(1, differenceInCalendarDays(to, from) + 1);

    const rangeVerified = verified.filter((p) => {
      const d = new Date(p.created_at);
      return d >= from && d <= new Date(to.getTime() + 24 * 3600 * 1000);
    });
    const rangeRev = rangeVerified.reduce((s, p) => s + p.amount, 0);
    const rangeTxns = rangeVerified.length;

    const daily: { label: string; date: string; revenue: number }[] = [];
    for (let i = 0; i < dayCount; i++) {
      const day = new Date(from.getTime() + i * 24 * 3600 * 1000);
      const next = new Date(day.getTime() + 24 * 3600 * 1000);
      const rev = verified
        .filter((p) => {
          const d = new Date(p.created_at);
          return d >= day && d < next;
        })
        .reduce((s, p) => s + p.amount, 0);
      daily.push({ label: format(day, "dd MMM"), date: format(day, "yyyy-MM-dd"), revenue: rev });
    }

    return {
      totalRev, thisMonthRev, lastMonthRev, growth, totalUsers,
      activePremium, conversionRate,
      pendingPayments: payments.filter((p) => p.status === "pending").length,
      rangeRev, rangeTxns, daily,
    };
  }, [payments, users, fromDate, toDate]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.email?.toLowerCase().includes(q));
  }, [users, search]);

  const exportUsersCSV = () => {
    if (filteredUsers.length === 0) return toast.error("No users to export");
    const rows = filteredUsers.map((u) => ({
      email: u.email || "",
      provider: u.provider,
      signup_date: u.created_at ? format(new Date(u.created_at), "yyyy-MM-dd HH:mm") : "",
      last_sign_in: u.last_sign_in_at ? format(new Date(u.last_sign_in_at), "yyyy-MM-dd HH:mm") : "",
      plan: u.premium?.is_active ? u.premium.plan : "free",
      plan_expires: u.premium?.expires_at ? format(new Date(u.premium.expires_at), "yyyy-MM-dd") : "",
    }));
    downloadFile(`users-${format(new Date(), "yyyy-MM-dd")}.csv`, toCSV(rows));
    toast.success(`Exported ${rows.length} users`);
  };

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!isAdmin) return null;

  const maxRev = Math.max(...stats.daily.map((m) => m.revenue), 1);

  return (
    <>
      <Helmet>
        <title>Owner Dashboard — Revenue & Users</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                  <p className="text-muted-foreground">Revenue, conversions & user insights</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
                <Link to="/admin/payments">
                  <Button size="sm" variant="default">
                    Payments <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> MTD Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{stats.thisMonthRev.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last month: ₹{stats.lastMonthRev.toLocaleString()}
                    {stats.growth !== "—" && (
                      <span className={`ml-2 ${Number(stats.growth) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {Number(stats.growth) >= 0 ? "↑" : "↓"} {Math.abs(Number(stats.growth))}%
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> LTD Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{stats.totalRev.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">All-time verified</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stats.pendingPayments} pending payments</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Crown className="w-4 h-4" /> Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.conversionRate}%</div>
                  <div className="text-xs text-muted-foreground mt-1">{stats.activePremium} premium users</div>
                </CardContent>
              </Card>
            </div>

            {/* Date range filter + daily chart */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Daily Revenue
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["7d", "30d", "mtd", "ltd"] as RangePreset[]).map((p) => (
                      <Button
                        key={p}
                        size="sm"
                        variant={preset === p ? "default" : "outline"}
                        onClick={() => setPreset(p)}
                      >
                        {p.toUpperCase()}
                      </Button>
                    ))}
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => { setFromDate(e.target.value); setPreset("custom"); }}
                      className="w-[150px]"
                    />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => { setToDate(e.target.value); setPreset("custom"); }}
                      className="w-[150px]"
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Range: <span className="font-semibold text-foreground">₹{stats.rangeRev.toLocaleString()}</span> across {stats.rangeTxns} transactions
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-48 overflow-x-auto">
                  {stats.daily.map((m) => (
                    <div key={m.date} className="flex-1 min-w-[18px] flex flex-col items-center gap-1" title={`${m.label}: ₹${m.revenue}`}>
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-primary to-primary/60 hover:opacity-80 transition-all"
                        style={{ height: `${(m.revenue / maxRev) * 100}%`, minHeight: "3px" }}
                      />
                      {stats.daily.length <= 31 && (
                        <div className="text-[10px] text-muted-foreground -rotate-45 origin-top-left whitespace-nowrap mt-2">
                          {m.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Site Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" /> Site Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="font-semibold">AdSense ads</Label>
                    <p className="text-xs text-muted-foreground">Show or hide all ad slots</p>
                  </div>
                  <Switch
                    checked={adsOn}
                    onCheckedChange={(v) => { setAdsOn(v); setBool(SETTINGS_KEYS.adsEnabled, v); toast.success(`Ads ${v ? "enabled" : "disabled"}`); }}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="font-semibold">Exit-intent popup</Label>
                    <p className="text-xs text-muted-foreground">Show offer on leave</p>
                  </div>
                  <Switch
                    checked={exitOn}
                    onCheckedChange={(v) => { setExitOn(v); setBool(SETTINGS_KEYS.exitIntentEnabled, v); toast.success(`Exit-intent ${v ? "enabled" : "disabled"}`); }}
                  />
                </div>
                <div>
                  <Label className="font-semibold">Cooldown (days)</Label>
                  <p className="text-xs text-muted-foreground mb-2">Frequency cap per visitor</p>
                  <Input
                    type="number"
                    min={0}
                    max={90}
                    value={cooldown}
                    onChange={(e) => {
                      const n = Math.max(0, Math.min(90, Number(e.target.value) || 0));
                      setCooldown(n);
                      setNum(SETTINGS_KEYS.exitIntentCooldownDays, n);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Users list */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Registered Users ({filteredUsers.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button size="sm" variant="outline" onClick={exportUsersCSV}>
                      <Download className="w-4 h-4 mr-1" /> Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Sign-in</TableHead>
                      <TableHead>Plan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading users...</TableCell></TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{u.provider}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {format(new Date(u.created_at), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {u.last_sign_in_at ? format(new Date(u.last_sign_in_at), "dd MMM, HH:mm") : "—"}
                          </TableCell>
                          <TableCell>
                            {u.premium?.is_active ? (
                              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 border">
                                <Crown className="w-3 h-3 mr-1" /> {u.premium.plan}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">Free</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;
