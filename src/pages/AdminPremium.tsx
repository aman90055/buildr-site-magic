import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { Helmet } from "react-helmet-async";

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
  email: string | null;
  action: string;
  rule: string;
  plan: string | null;
  previous_plan: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminPremium() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<PremiumRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("lifetime");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" as any })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user, authLoading]);

  const refresh = async () => {
    setLoading(true);
    const [{ data: list }, { data: log }] = await Promise.all([
      supabase.rpc("admin_list_premium"),
      supabase.from("premium_audit_log").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setRows((list as PremiumRow[]) || []);
    setAudit((log as AuditRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  const grant = async () => {
    if (!email) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("admin_grant_premium_by_email", {
      _email: email.trim(), _plan: plan, _notes: "Granted via admin panel",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    const res = data as any;
    if (!res?.success) toast.error(res?.error || "Failed");
    else toast.success(`Granted ${plan} to ${email}`);
    setEmail("");
    refresh();
  };

  const revoke = async (targetEmail: string) => {
    if (!confirm(`Revoke premium for ${targetEmail}?`)) return;
    const { data, error } = await supabase.rpc("admin_revoke_premium_by_email", {
      _email: targetEmail, _notes: "Revoked via admin panel",
    });
    if (error) return toast.error(error.message);
    const res = data as any;
    if (!res?.success) toast.error(res?.error || "Failed");
    else toast.success(`Revoked ${targetEmail}`);
    refresh();
  };

  if (authLoading || isAdmin === null) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin" /></div>;
  }
  if (!isAdmin) {
    return <div className="max-w-2xl mx-auto p-10 text-center">
      <h1 className="text-2xl font-bold mb-2">Admin only</h1>
      <p className="text-muted-foreground">You need admin role to access this page.</p>
    </div>;
  }

  return (
    <>
      <Helmet><title>Premium Access Admin — Docunova AI</title></Helmet>
      <div className="container mx-auto py-8 space-y-6 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Premium Access Management</h1>
          <p className="text-muted-foreground">Grant, revoke, and audit premium access by email.</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Grant premium by email</CardTitle></CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <Input placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="h-10 rounded-md border bg-background px-3">
              <option value="lifetime">Lifetime</option>
              <option value="enterprise">Enterprise</option>
              <option value="pro">Pro</option>
              <option value="basic">Basic</option>
            </select>
            <Button onClick={grant} disabled={busy || !email}>
              {busy ? <Loader2 className="animate-spin h-4 w-4" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Grant
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Current premium users ({rows.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Loader2 className="animate-spin" /> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Activated</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.user_id}>
                        <TableCell className="font-mono text-sm">{r.email || r.user_id.slice(0, 8)}</TableCell>
                        <TableCell><Badge>{r.plan}</Badge></TableCell>
                        <TableCell>{r.is_active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell>{new Date(r.activated_at).toLocaleDateString()}</TableCell>
                        <TableCell>{r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—"}</TableCell>
                        <TableCell className="text-right">
                          {r.is_active && r.email && (
                            <Button size="sm" variant="outline" onClick={() => revoke(r.email!)}>
                              <ShieldX className="h-3 w-3 mr-1" /> Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Audit log (last 100)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{a.email || "—"}</TableCell>
                      <TableCell><Badge variant={a.action === "granted" || a.action === "plan_changed" ? "default" : a.action === "revoked" ? "destructive" : "secondary"}>{a.action}</Badge></TableCell>
                      <TableCell className="text-xs">{a.rule}</TableCell>
                      <TableCell className="text-xs">{a.previous_plan ? `${a.previous_plan} → ` : ""}{a.plan || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{a.notes || ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
