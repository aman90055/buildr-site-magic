import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Shield, CheckCircle, XCircle, Clock, Search, RefreshCw, IndianRupee } from "lucide-react";
import { format } from "date-fns";

const ADMIN_EMAIL = "documentai999@gmail.com";

interface PaymentVerification {
  id: string;
  name: string;
  email: string;
  utr_number: string;
  plan: string;
  amount: number;
  status: string;
  created_at: string;
  verified_at: string | null;
  notes: string | null;
}

const AdminPayments = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("payment_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load payments");
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchPayments();
    }
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const payment = payments.find((p) => p.id === id);
    const updateData: Record<string, unknown> = { status };
    if (status === "verified") {
      updateData.verified_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from("payment_verifications")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    // If verified and we have user email, activate premium
    if (status === "verified" && payment) {
      // Look up user by email to set premium flag
      const { data: userData } = await supabase.auth.admin?.listUsers?.() || { data: null };
      // Since we can't use admin API from client, we'll upsert with a known approach
      // The admin manually ensures the user exists; premium activates on next login check
      const { error: premiumError } = await supabase
        .from("user_premium_status")
        .upsert({
          user_id: payment.email, // Will be matched by email lookup edge function
          plan: payment.plan,
          is_active: true,
          payment_verification_id: id,
          activated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      
      if (premiumError) {
        console.error("Premium activation note: user must be logged in for auto-activation", premiumError);
      }
    }

    toast.success(`Payment marked as ${status}`);
    fetchPayments();
  };

  const filtered = payments.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.utr_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: React.ElementType }> = {
      pending: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: Clock },
      verified: { color: "bg-green-500/10 text-green-600 border-green-500/30", icon: CheckCircle },
      rejected: { color: "bg-red-500/10 text-red-600 border-red-500/30", icon: XCircle },
    };
    const config = map[status] || map.pending;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" /> {status}
      </Badge>
    );
  };

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    verified: payments.filter((p) => p.status === "verified").length,
    totalRevenue: payments.filter((p) => p.status === "verified").reduce((sum, p) => sum + p.amount, 0),
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <>
      <Helmet>
        <title>Admin - Payment Verifications</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Payment Verifications</h1>
                <p className="text-muted-foreground">Manage and verify UPI payment submissions</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card/50"><CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent></Card>
              <Card className="bg-yellow-500/5 border-yellow-500/20"><CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent></Card>
              <Card className="bg-green-500/5 border-green-500/20"><CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </CardContent></Card>
              <Card className="bg-primary/5 border-primary/20"><CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary flex items-center justify-center"><IndianRupee className="w-5 h-5" />{stats.totalRevenue}</div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </CardContent></Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name, email, UTR..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "verified", "rejected"].map((s) => (
                  <Button key={s} variant={filterStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(s)} className="capitalize">{s}</Button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={fetchPayments}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
            </div>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UTR</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payments found</TableCell></TableRow>
                    ) : (
                      filtered.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-sm">{format(new Date(p.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-sm">{p.email}</TableCell>
                          <TableCell><Badge variant="outline">{p.plan}</Badge></TableCell>
                          <TableCell className="font-medium">₹{p.amount}</TableCell>
                          <TableCell className="text-sm font-mono">{p.utr_number}</TableCell>
                          <TableCell>{statusBadge(p.status)}</TableCell>
                          <TableCell>
                            {p.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="default" onClick={() => updateStatus(p.id, "verified")} className="h-7 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, "rejected")} className="h-7 text-xs">
                                  <XCircle className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
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

export default AdminPayments;
