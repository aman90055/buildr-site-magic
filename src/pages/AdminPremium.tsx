import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Crown, Download, RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
import { format } from "date-fns";

interface PremiumRow {
  user_id: string;
  email: string | null;
  plan: string;
  is_active: boolean;
  activated_at: string;
  expires_at: string | null;
  updated_at: string;
}

interface AuditRow {
  id: string;
  user_id: string | null;
  email: string | null;
  action: string;
  rule: string;
  plan: string | null;
  previous_plan: string | null;
  notes: string | null;
  created_at: string;
}

interface OwnerStatusRow {
  email: string;
  user_id: string | null;
  plan: string | null;
  is_active: boolean | null;
  updated_at: string | null;
  last_action: string | null;
  last_action_at: string | null;
  last_notes: string | null;
}

const actionVariant = (a: string) =>
  a === "granted" || a === "plan_changed" ? "default"
    : a === "revoked" ? "destructive"
    : a === "skipped_conflict" ? "secondary"
    : "outline";

const csvEscape = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const AdminPremium = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<PremiumRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [owners, setOwners] = useState<OwnerStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("lifetime");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");

  // Export controls
  const [exportEmail, setExportEmail] = useState("");
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

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
    const [{ data: list, error: e1 }, { data: log, error: e2 }, { data: own, error: e3 }] = await Promise.all([
      supabase.rpc("admin_list_premium"),
      supabase.from("premium_audit_log").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.rpc("admin_owner_status"),
    ]);
    if (e1) toast.error(e1.message); else setRows((list as any) || []);
    if (e2) toast.error(e2.message); else setAudit((log as any) || []);
    if (e3) toast.error(e3.message); else setOwners((own as any) || []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const grant = async () => {
    if (!email.trim()) { toast.error("Enter an email"); return; }
    setBusy(true);
    const { data, error } = await supabase.rpc("admin_grant_premium_by_email", {
      _email: email.trim(), _plan: plan, _notes: notes || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    const res = data as any;
    if (res?.success) { toast.success(`Granted ${plan} to ${email}`); setEmail(""); setNotes(""); load(); }
    else toast.error(res?.error || "Failed");
  };

  const revoke = async (targetEmail: string) => {
    if (!confirm(`Revoke premium for ${targetEmail}?`)) return;
    const { data, error } = await supabase.rpc("admin_revoke_premium_by_email", {
      _email: targetEmail, _notes: "Revoked from admin panel",
    });
    if (error) return toast.error(error.message);
    const res = data as any;
    if (res?.success) { toast.success(`Revoked ${targetEmail}`); load(); }
    else toast.error(res?.error || "Failed");
  };

  const filtered = rows.filter(r => !filter || r.email?.toLowerCase().includes(filter.toLowerCase()));

  const exportCsv = async () => {
    let q = supabase.from("premium_audit_log").select("*").order("created_at", { ascending: false }).limit(5000);
    if (exportEmail.trim()) q = q.ilike("email", `%${exportEmail.trim()}%`);
    if (exportFrom) q = q.gte("created_at", new Date(exportFrom).toISOString());
    if (exportTo) {
      const end = new Date(exportTo);
      end.setHours(23, 59, 59, 999);
      q = q.lte("created_at", end.toISOString());
    }
    const { data, error } = await q;
    if (error) return toast.error(error.message);
    const list = (data as AuditRow[]) || [];
    if (list.length === 0) { toast.info("No events match those filters"); return; }
    const headers = ["created_at","email","action","rule","plan","previous_plan","user_id","notes"];
    const csv = [
      headers.join(","),
      ...list.map(r => headers.map(h => csvEscape((r as any)[h])).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `premium_audit_${format(new Date(), "yyyyMMdd_HHmm")}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${list.length} events`);
  };

  const ownerRows = useMemo(() => owners, [owners]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md"><CardContent className="p-8 text-center">
            <ShieldX className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h1 className="text-xl font-bold mb-2">Access denied</h1>
            <p className="text-muted-foreground mb-4">Admin only.</p>
            <Button asChild><Link to="/">Home</Link></Button>
          </CardContent></Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet><title>Admin · Premium Management</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2"><Crown className="h-7 w-7 text-yellow-500" />Premium Management</h1>
            <p className="text-muted-foreground">Grant, revoke and audit premium access by email.</p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
        </div>

        {/* Owner status panel */}
        <Card>
          <CardHeader><CardTitle>Owner Premium Status</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {ownerRows.map(o => (
              <Card key={o.email} className="border-yellow-500/30">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm truncate" title={o.email}>{o.email}</span>
                    {o.is_active ? <Badge>Active</Badge> : o.user_id ? <Badge variant="secondary">Inactive</Badge> : <Badge variant="outline">Pending signup</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Plan: <span className="text-foreground font-medium">{o.plan || "—"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated: {o.updated_at ? format(new Date(o.updated_at), "yyyy-MM-dd HH:mm") : "—"}
                  </div>
                  <div className="text-xs pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Last event:</span>
                      {o.last_action ? <Badge variant={actionVariant(o.last_action) as any}>{o.last_action}</Badge> : <span>—</span>}
                    </div>
                    {o.last_action_at && (
                      <div className="text-muted-foreground mt-1">{format(new Date(o.last_action_at), "yyyy-MM-dd HH:mm")}</div>
                    )}
                    {o.last_notes && <div className="text-muted-foreground mt-1 truncate" title={o.last_notes}>{o.last_notes}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Grant Premium</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr,180px,1fr,auto]">
            <Input placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
            <Button onClick={grant} disabled={busy}><ShieldCheck className="h-4 w-4 mr-1" />Grant</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Premium Users ({filtered.length})</CardTitle>
            <Input className="max-w-xs" placeholder="Filter by email…" value={filter} onChange={e => setFilter(e.target.value)} />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Email</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead>
                  <TableHead>Activated</TableHead><TableHead>Expires</TableHead><TableHead>Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filtered.map(r => (
                    <TableRow key={r.user_id}>
                      <TableCell className="font-mono text-sm">{r.email || r.user_id}</TableCell>
                      <TableCell><Badge>{r.plan}</Badge></TableCell>
                      <TableCell>{r.is_active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                      <TableCell className="text-sm">{format(new Date(r.activated_at), "yyyy-MM-dd")}</TableCell>
                      <TableCell className="text-sm">{r.expires_at ? format(new Date(r.expires_at), "yyyy-MM-dd") : "Never"}</TableCell>
                      <TableCell>
                        {r.is_active && r.email && (
                          <Button size="sm" variant="destructive" onClick={() => revoke(r.email!)}>Revoke</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">No records</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Export audit log */}
        <Card>
          <CardHeader><CardTitle>Export Audit Log</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr,180px,180px,auto] items-end">
            <div>
              <Label className="text-xs">Email contains</Label>
              <Input placeholder="e.g. gmail.com" value={exportEmail} onChange={e => setExportEmail(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">From</Label>
              <Input type="date" value={exportFrom} onChange={e => setExportFrom(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <Input type="date" value={exportTo} onChange={e => setExportTo(e.target.value)} />
            </div>
            <Button onClick={exportCsv}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Audit Log (last 200)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>When</TableHead><TableHead>Email</TableHead><TableHead>Action</TableHead>
                  <TableHead>Rule</TableHead><TableHead>Plan</TableHead><TableHead>Prev</TableHead><TableHead>Notes</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {audit.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs whitespace-nowrap">{format(new Date(a.created_at), "yyyy-MM-dd HH:mm")}</TableCell>
                      <TableCell className="font-mono text-xs">{a.email || "—"}</TableCell>
                      <TableCell><Badge variant={actionVariant(a.action) as any}>{a.action}</Badge></TableCell>
                      <TableCell className="text-xs">{a.rule}</TableCell>
                      <TableCell className="text-xs">{a.plan || "—"}</TableCell>
                      <TableCell className="text-xs">{a.previous_plan || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[280px] truncate" title={a.notes || ""}>{a.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {audit.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">No events yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPremium;
