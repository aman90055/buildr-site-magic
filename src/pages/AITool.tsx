import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Loader2, Sparkles, Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAITool, AI_TOOLS } from "@/lib/aiTools";

const AITool = () => {
  const { slug } = useParams();
  const tool = slug ? getAITool(slug) : undefined;
  const [input, setInput] = useState("");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!tool) return <Navigate to="/ai-hub" replace />;

  const Icon = tool.icon;

  const handleRun = async () => {
    if (!input.trim()) {
      toast.error("Please enter some input");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { tool: tool.slug, input: input.trim(), extra: extra.trim() || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setOutput(data?.output || "No response");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const related = AI_TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{tool.name} — {tool.tagline}</title>
        <meta name="description" content={tool.description} />
        <link rel="canonical" href={`/ai/${tool.slug}`} />
      </Helmet>

      <section className="relative py-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <Link to="/ai-hub" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to AI Ecosystem
          </Link>

          <div className="flex items-start gap-4 mb-10">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-xl ring-1 ring-white/40 dark:ring-white/10 shrink-0`}>
              <Icon className="w-8 h-8 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" /> {tool.tagline}
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight">{tool.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{tool.description}</p>
            </div>
          </div>

          <div className="rounded-[22px] p-[1.5px] bg-gradient-to-br from-white/40 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/0">
            <div className="rounded-[20px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 p-6 md:p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]">
              <div className="space-y-5">
                <div>
                  <Label htmlFor="input" className="mb-2 block">Input</Label>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={tool.placeholder}
                    rows={8}
                    className="resize-y bg-background/60 backdrop-blur"
                  />
                </div>
                {tool.extraLabel && (
                  <div>
                    <Label htmlFor="extra" className="mb-2 block">{tool.extraLabel}</Label>
                    <Input
                      id="extra"
                      value={extra}
                      onChange={(e) => setExtra(e.target.value)}
                      placeholder={tool.extraPlaceholder}
                      className="bg-background/60 backdrop-blur"
                    />
                  </div>
                )}
                <Button onClick={handleRun} disabled={loading} size="lg" className={`w-full md:w-auto bg-gradient-to-r ${tool.gradient} text-white border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all`}>
                  {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</>) : (<><Sparkles className="w-4 h-4 mr-2" /> {tool.cta}</>)}
                </Button>
              </div>

              {output && (
                <div className="mt-8 pt-8 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-semibold text-lg">Result</h2>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyOutput}>
                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadOutput}>
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl bg-background/40 backdrop-blur p-5 border border-border/40">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-14">
            <h3 className="font-display font-semibold text-xl mb-5">Related AI tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => {
                const RI = r.icon;
                return (
                  <Link key={r.slug} to={`/ai/${r.slug}`} className="group rounded-2xl p-4 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 hover:border-primary/40 hover:-translate-y-1 transition-all">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-2`}>
                      <RI className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{r.name}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AITool;
