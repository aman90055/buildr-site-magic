import { useEffect } from "react";
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
import {
  LayoutDashboard, FileText, Clock, CheckCircle2, XCircle, Loader2,
  Merge, Scissors, FileDown, ImageIcon, FileImage, ScanText, Pencil,
  Lock, RotateCw, Hash, Droplets, Trash2, FileOutput, ExternalLink
} from "lucide-react";

const jobTypeIcons: Record<string, React.ElementType> = {
  merge: Merge,
  split: Scissors,
  compress: FileDown,
  convert: FileImage,
  "image-to-pdf": ImageIcon,
  "pdf-to-image": FileImage,
  ocr: ScanText,
  edit: Pencil,
  protect: Lock,
  rotate: RotateCw,
  "page-numbers": Hash,
  watermark: Droplets,
  "remove-pages": Trash2,
  "extract-pages": FileOutput,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: pdfJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["pdf-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("pdf_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getJobTypeLabel = (jobType: string) => {
    return jobType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | PDF Tools</title>
        <meta name="description" content="View your PDF processing history and manage your documents." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Jobs</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-blue-500">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-destructive/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent PDF Jobs
                </CardTitle>
                <CardDescription>
                  Your recent PDF processing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
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
                        <div
                          key={job.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {getJobTypeLabel(job.job_type)}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 ${statusColors[job.status]}`}
                              >
                                <StatusIcon className={`w-3 h-3 mr-1 ${job.status === "processing" ? "animate-spin" : ""}`} />
                                {job.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {inputFiles.length > 0
                                ? `${inputFiles.length} file${inputFiles.length > 1 ? "s" : ""}`
                                : "No files"}{" "}
                              • {formatDate(job.created_at)}
                            </p>
                            {job.error_message && (
                              <p className="text-xs text-destructive mt-1 truncate">
                                Error: {job.error_message}
                              </p>
                            )}
                          </div>
                          {job.output_file && (
                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No PDF jobs yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start processing your PDFs to see them here
                    </p>
                    <Button asChild>
                      <Link to="/merge">Get Started</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
