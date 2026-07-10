import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LucideIcon, Loader2, Volume2, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AIBadge from "@/components/AIBadge";

interface AITextToolProps {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  gradient: string;
  systemPrompt: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  actionLabel: string;
  extraInput?: React.ReactNode;
  getFullPrompt?: (text: string) => string;
  speakLang?: string;
}

const AITextTool = ({
  title, description, metaTitle, metaDescription, icon: Icon, gradient,
  systemPrompt, inputLabel, inputPlaceholder, outputLabel, actionLabel,
  extraInput, getFullPrompt,
}: AITextToolProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) { toast({ title: "Error", description: "Please enter some text.", variant: "destructive" }); return; }
    setIsProcessing(true);
    setOutput("");
    try {
      const prompt = getFullPrompt ? getFullPrompt(input) : input;
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ];

      // Call ai-chat with a streaming SSE response and accumulate deltas.
      const { data: { session } } = await supabase.auth.getSession();
      const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
      const ANON = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON,
          Authorization: `Bearer ${session?.access_token || ANON}`,
        },
        body: JSON.stringify({ messages, type: "chat" }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        if (res.status === 429) throw new Error("Rate limit reached. Please wait a minute and try again.");
        if (res.status === 402) throw new Error("AI credits exhausted. Please contact the site owner.");
        throw new Error(errText || `AI error (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      let buf = "";
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta?.content || json?.choices?.[0]?.message?.content || "";
            if (delta) {
              full += delta;
              setOutput(full);
            }
          } catch { /* ignore partial chunks */ }
        }
      }

      if (!full) setOutput("No response received.");
      else toast({ title: "Done!" });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err?.message || "AI processing failed. Please try again.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <>
      <Helmet><title>{metaTitle}</title><meta name="description" content={metaDescription} /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <AIBadge variant="default" glow />
              <div className={`w-16 h-16 mx-auto my-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}><Icon className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="space-y-6">
              {extraInput}
              <div className="space-y-2">
                <Label>{inputLabel}</Label>
                <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={inputPlaceholder} rows={8} />
              </div>
              <Button onClick={handleProcess} disabled={isProcessing || !input.trim()} className="w-full" size="lg">
                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : actionLabel}
              </Button>
              {output && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>{outputLabel}</Label><Button variant="ghost" size="sm" onClick={handleCopy}>Copy</Button></div>
                  <div className="p-4 bg-muted/50 rounded-xl whitespace-pre-wrap text-sm text-foreground">{output}</div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AITextTool;
