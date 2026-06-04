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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Shield, IndianRupee, TrendingUp, Users, Crown, Mail, RefreshCw, Search,
  Calendar, CheckCircle, Activity, ArrowUpRight,
} from "lucide-react";
import { format, subMonths, startOfMonth } from "date-fns";

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

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");

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

    // 6-month monthly chart data
    const months: { label: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = startOfMonth(subMonths(now, i));
      const end = startOfMonth(subMonths(now, i - 1));
      const rev = verified
        .filter((p) => {
          const d = new Date(p.created_at);
          return d >= start && d < end;
        })
        .reduce((s, p) => s + p.amount, 0);
      months.push({ label: format(start, "MMM"), revenue: rev });
    }

    return {
      totalRev,
      thisMonthRev,
      lastMonthRev,
      growth,
      totalUsers,
      activePremium,
      conversionRate,
      pendingPayments: payments.filter((p) => p.status === "pending").length,
      months,
    };
  }, [payments, users]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.email?.toLowerCase().includes(q));
  }, [users, search]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!isAdmin) return null;

  const maxRev = Math.max(...stats.months.map((m) => m.revenue), 1);

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
                    <IndianRupee className="w-4 h-4" /> This Month
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
                    <TrendingUp className="w-4 h-4" /> Total Revenue
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

            {/* Monthly chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Revenue — Last 6 months
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-48">
                  {stats.months.map((m) => (
                    <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-medium">₹{m.revenue.toLocaleString()}</div>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-all hover:opacity-80"
                        style={{ height: `${(m.revenue / maxRev) * 100}%`, minHeight: "4px" }}
                      />
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
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
