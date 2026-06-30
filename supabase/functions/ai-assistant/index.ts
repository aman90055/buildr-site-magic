import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  "document-chat": "You are a document chat assistant. Answer questions about the provided document content clearly and cite specific sections when relevant.",
  "ocr-clean": "You are an OCR cleanup specialist. Fix scanning artifacts, restore paragraph structure, preserve tables, and return clean readable text.",
  "translate": "You are a professional translator. Translate the user's text into the requested target language while preserving tone, formatting, and meaning.",
  "resume-builder": "You are an expert resume writer. Generate an ATS-friendly, achievement-focused resume in clean markdown using strong action verbs and quantified results.",
  "resume-analyzer": "You are a senior recruiter. Analyze the provided resume and return: 1) Overall score /100, 2) Strengths, 3) Weaknesses, 4) Missing keywords, 5) Specific improvements. Use markdown headings.",
  "cover-letter": "You are an expert career coach. Write a tailored, confident cover letter (≤350 words) matching the candidate to the job. Markdown formatted.",
  "contract-review": "You are a contract lawyer. Identify risky clauses, missing protections, ambiguous terms, and suggested redlines. Use a markdown table for findings with columns: Clause | Risk | Suggested Fix.",
  "invoice-generator": "You generate professional invoices in clean markdown with line items, totals, tax, terms, and payment info based on the user's input.",
  "proposal-generator": "You are a senior consultant. Generate a polished client proposal: Executive Summary, Scope, Deliverables, Timeline, Pricing, Terms. Markdown.",
  "meeting-notes": "You are a meeting notes assistant. From the transcript/notes, extract: Summary, Decisions, Action Items (with owners + due dates), Open Questions. Markdown.",
  "research-assistant": "You are a research assistant. Provide a structured, well-cited analysis of the user's topic with overview, key findings, sources to read, and follow-up questions.",
  "writing-assistant": "You are a master writing assistant. Improve clarity, flow, tone, and impact of the user's text. Return the improved version plus a short bullet list of changes.",
  "email-writer": "You write professional emails. Match the requested tone, keep it concise, include a clear subject line and call to action.",
  "grammar-checker": "You are a grammar and style editor. Return the corrected text in markdown, then a bullet list of changes (grammar, clarity, tone).",
  "prompt-generator": "You are a prompt engineering expert. Generate a high-quality, structured prompt (with role, context, instructions, constraints, output format) for the user's described task.",
};

const requestSchema = z.object({
  tool: z.string().min(1).max(64),
  input: z.string().min(1, "Input required").max(20000, "Input too long (max 20k chars)"),
  extra: z.string().max(2000).optional(),
});

async function checkRateLimit(supabase: any, identifier: string, fn: string, limit: number, windowMs: number) {
  const windowStart = new Date(Date.now() - windowMs).toISOString();
  const { count } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("function_name", fn)
    .gte("window_start", windowStart);
  if ((count || 0) >= limit) return false;
  await supabase.from("rate_limits").insert({ identifier, function_name: fn, window_start: new Date().toISOString() });
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const identifier = req.headers.get("x-forwarded-for") || "unknown";
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = data?.user?.id || null;
    }
    const rateKey = userId || identifier;
    const limit = userId ? 30 : 5;
    if (!(await checkRateLimit(supabase, rateKey, "ai-assistant", limit, 60000))) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const v = requestSchema.safeParse(body);
    if (!v.success) {
      return new Response(JSON.stringify({ error: "Invalid input", details: v.error.errors.map(e => e.message) }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { tool, input, extra } = v.data;
    const systemPrompt = SYSTEM_PROMPTS[tool];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: "Unknown tool" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const userContent = extra ? `${input}\n\n---\nAdditional context: ${extra}` : input;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return new Response(JSON.stringify({ error: "AI rate limit. Retry shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`Gateway ${resp.status}`);
    }

    const data = await resp.json();
    const output = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ output }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("ai-assistant error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
