import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Share2, Lock, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  job_type: string | null;
  status: string | null;
  output_file: string | null;
  created_at: string;
}

export default function Workspace() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthed(false); setLoading(false); return; }
      setAuthed(true);
      const { data } = await supabase
        .from("pdf_jobs")
        .select("id, job_type, status, output_file, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      setJobs((data as Job[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Cloud Workspace — Document Edit Pro AI</title>
        <meta name="description" content="Your private cloud workspace: recent files, shared folders, version history, and expiring share links." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/workspace" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cloud Workspace</h1>
            <p className="text-muted-foreground">Your recent files, shared folders, and secure share links.</p>
          </div>
          <Button asChild><Link to="/dashboard">Open dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="p-5"><Folder className="w-5 h-5 text-primary mb-2" /><h3 className="font-semibold">Shared folders</h3><p className="text-sm text-muted-foreground">Group related files and invite teammates.</p></Card>
          <Card className="p-5"><Clock className="w-5 h-5 text-primary mb-2" /><h3 className="font-semibold">Version history</h3><p className="text-sm text-muted-foreground">Restore any previous version from the last 30 days.</p></Card>
          <Card className="p-5"><Share2 className="w-5 h-5 text-primary mb-2" /><h3 className="font-semibold">Expiring share links</h3><p className="text-sm text-muted-foreground">Password-protected links with auto-expiry.</p></Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent files</h2>
        {authed === false ? (
          <Card className="p-8 text-center">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="mb-4 text-muted-foreground">Sign in to access your private workspace.</p>
            <Button asChild><Link to="/auth">Sign in</Link></Button>
          </Card>
        ) : loading ? (
          <Card className="p-6 text-muted-foreground">Loading…</Card>
        ) : jobs.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No files yet. Use any tool to get started.</Card>
        ) : (
          <Card className="divide-y">
            {jobs.map((j) => (
              <div key={j.id} className="p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{j.file_name || "Untitled"}</div>
                  <div className="text-xs text-muted-foreground">{j.tool_type} · {new Date(j.created_at).toLocaleString()}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-muted">{j.status}</span>
              </div>
            ))}
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
