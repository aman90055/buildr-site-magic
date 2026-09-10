import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw, Send, Mail, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  delivery_status: "pending" | "sent" | "failed" | "retrying";
  provider_error: any;
  attempts: number | null;
  last_attempt_at: string | null;
  next_retry_at: string | null;
  sent_at: string | null;
  created_at: string;
}

const statusVariant = (s: ContactRow["delivery_status"]) => {
  switch (s) {
    case "sent": return "default" as const;
    case "failed": return "destructive" as const;
    case "retrying": return "secondary" as const;
    default: return "outline" as const;
  }
};

const AdminContacts = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user, authLoading, navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    setRows((data as ContactRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const runRetry = async () => {
    setRetrying(true);
    try {
      const { data, error } = await supabase.functions.invoke("retry-failed-emails", { body: {} });
      if (error) throw error;
      if (data?.skipped) {
        toast.warning("Skipped: RESEND_API_KEY is missing or invalid");
      } else {
        toast.success(`Retry complete: ${data?.processed ?? 0} message(s) processed`);
      }
      await load();
    } catch (e: any) {
      toast.error(e.message || "Retry failed");
    } finally {
      setRetrying(false);
    }
  };

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md"><CardContent className="p-6 text-center">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">Admin only.</p>
          <Button asChild className="mt-4"><Link to="/">Home</Link></Button>
        </CardContent></Card>
      </div>
    );
  }

  const filtered = statusFilter === "all" ? rows : rows.filter(r => r.delivery_status === statusFilter);
  const stats = {
    total: rows.length,
    sent: rows.filter(r => r.delivery_status === "sent").length,
    failed: rows.filter(r => r.delivery_status === "failed").length,
    pending: rows.filter(r => r.delivery_status === "pending" || r.delivery_status === "retrying").length,
  };

  return (
    <>
      <Helmet><title>Contact Messages • Admin</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/admin"><ArrowLeft className="w-4 h-4 mr-1" /> Admin</Link>
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Mail className="w-7 h-7" /> Contact Submissions</h1>
            <p className="text-muted-foreground">View saved messages and email delivery status</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button onClick={runRetry} disabled={retrying}>
              <Send className={`w-4 h-4 mr-2 ${retrying ? "animate-pulse" : ""}`} /> Run Retry Queue
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total },
            { label: "Sent", value: stats.sent },
            { label: "Pending / Retry", value: stats.pending },
            { label: "Failed", value: stats.failed },
          ].map(s => (
            <Card key={s.label}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="retrying">Retrying</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Received</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Last Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {loading ? "Loading..." : "No messages"}
                  </TableCell></TableRow>
                )}
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">{format(new Date(r.created_at), "MMM d, HH:mm")}</TableCell>
                    <TableCell>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate" title={r.message}>{r.subject}</TableCell>
                    <TableCell><Badge variant={statusVariant(r.delivery_status)}>{r.delivery_status}</Badge></TableCell>
                    <TableCell>{r.attempts ?? 0}</TableCell>
                    <TableCell className="max-w-[260px] truncate text-xs text-destructive" title={JSON.stringify(r.provider_error)}>
                      {r.provider_error?.message || r.provider_error?.name || ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default AdminContacts;
