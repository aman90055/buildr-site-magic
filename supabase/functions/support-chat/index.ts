import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders as baseCors } from "npm:@supabase/supabase-js@2/cors";
import { createOpenAI } from "npm:@ai-sdk/openai@2";
import { stepCountIs, streamText, tool, convertToModelMessages, type UIMessage } from "npm:ai@5";
import { z } from "npm:zod@3.25.76";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "../_shared/run-id.ts";
import { searchHelpDocs } from "./helpDocs.ts";

const corsHeaders = {
  ...baseCors,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const BodySchema = z.object({
  threadId: z.string().uuid(),
  message: z.object({
    id: z.string().min(1).max(100),
    role: z.literal("user"),
    parts: z.array(z.object({ type: z.literal("text"), text: z.string().min(1).max(4000) })).min(1).max(5),
  }),
});

const esc = (t: string) => t.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]!));

const SYSTEM = `You are Nova, the support assistant for Docunova (docunova.online), a free browser-based PDF tools site.
Rules:
- For any product question, call searchHelpDocs first and answer ONLY from what it returns. Link the article path (e.g. /merge).
- For questions about the user's own plan, payments or past jobs, call getMyAccount and report exactly what it returns. Never guess dates, amounts or statuses.
- Never invent features, prices, policies, refund terms or timelines.
- Call handOffToHuman when: the docs and account data don't answer the question; the user asks for a refund, reports a charge or payment problem not resolved by the data, reports a bug you can't solve, asks for a person, or is upset. After handing off, tell the user a person has been emailed and will reply to their account email.
- Keep answers short, friendly and plain. Reply in the user's language.`;

async function sendHandoffEmail(opts: { userEmail: string; threadId: string; reason: string; summary: string; transcript: string }) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key || !key.startsWith("re_")) return { sent: false, error: "email not configured" };
  const owner = Deno.env.get("CONTACT_OWNER_EMAIL") || "documentai999@gmail.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Docunova Support <onboarding@resend.dev>",
      to: [owner],
      reply_to: opts.userEmail,
      subject: `[Support handoff] ${opts.reason.slice(0, 80)}`,
      html: `<div style="font-family:sans-serif;max-width:640px"><h2>Support chat needs a person</h2>
<p><b>User:</b> ${esc(opts.userEmail)}<br/><b>Thread:</b> ${opts.threadId}</p>
<p><b>Reason:</b> ${esc(opts.reason)}</p><p><b>Summary:</b> ${esc(opts.summary)}</p>
<h3>Recent messages</h3><pre style="white-space:pre-wrap;background:#f6f7f9;padding:12px;border-radius:6px">${esc(opts.transcript)}</pre>
<p>Reply to this email to answer the user directly.</p></div>`,
    }),
  });
  if (!res.ok) {
    console.error("handoff email failed", res.status, await res.text());
    return { sent: false, error: "email provider error" };
  }
  return { sent: true };
}

const textOf = (m: UIMessage) =>
  m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return json({ error: "Please sign in to use support chat." }, 401);
  const { data: userData } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (!user) return json({ error: "Please sign in to use support chat." }, 401);

  // Rate limit: 15 messages / minute per user
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await admin.from("rate_limits").select("*", { count: "exact", head: true })
    .eq("identifier", user.id).eq("function_name", "support-chat").gte("window_start", since);
  if ((count ?? 0) >= 15) return json({ error: "Too many messages. Please wait a minute." }, 429);
  await admin.from("rate_limits").insert({ identifier: user.id, function_name: "support-chat" });

  let body: z.infer<typeof BodySchema>;
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid request" }, 400);
    body = parsed.data;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { data: thread } = await admin.from("support_threads").select("*").eq("id", body.threadId).maybeSingle();
  if (!thread || thread.user_id !== user.id) return json({ error: "Conversation not found" }, 404);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "Support chat is not configured." }, 500);

  const { data: rows, error: histErr } = await admin.from("support_messages").select("message")
    .eq("thread_id", thread.id).order("created_at").limit(60);
  if (histErr) return json({ error: "Could not load conversation." }, 500);

  const userMsg = body.message as UIMessage;
  const { error: saveErr } = await admin.from("support_messages").upsert(
    { thread_id: thread.id, user_id: user.id, role: "user", message_id: userMsg.id, message: userMsg },
    { onConflict: "thread_id,message_id" },
  );
  if (saveErr) return json({ error: "Could not save your message." }, 500);

  const history = [...(rows ?? []).map((r) => r.message as UIMessage).filter((m) => m.id !== userMsg.id), userMsg];
  const threadUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (thread.title === "New conversation") threadUpdate.title = textOf(userMsg).slice(0, 60) || "New conversation";
  await admin.from("support_threads").update(threadUpdate).eq("id", thread.id);

  const userEmail = user.email ?? "";
  const tools = {
    searchHelpDocs: tool({
      description: "Search Docunova help articles. Use for any product, privacy, tool or policy question.",
      inputSchema: z.object({ query: z.string().min(2).max(200) }),
      execute: async ({ query }) => {
        const results = searchHelpDocs(query);
        return { results, found: results.length > 0 };
      },
    }),
    getMyAccount: tool({
      description: "Get the signed-in user's premium status, submitted payment verifications and recent PDF jobs.",
      inputSchema: z.object({}),
      execute: async () => {
        const [premium, payments, jobs] = await Promise.all([
          admin.from("user_premium_status").select("plan,is_active,activated_at,expires_at").eq("user_id", user.id).maybeSingle(),
          userEmail
            ? admin.from("payment_verifications").select("plan,amount,status,created_at,verified_at,utr_number")
              .ilike("email", userEmail).order("created_at", { ascending: false }).limit(5)
            : Promise.resolve({ data: [] }),
          admin.from("pdf_jobs").select("job_type,status,error_message,created_at").eq("user_id", user.id)
            .order("created_at", { ascending: false }).limit(10),
        ]);
        return {
          email: userEmail,
          premium: premium.data ?? { plan: "free", is_active: false },
          payments: (payments.data ?? []).map((p: any) => ({ ...p, utr_number: p.utr_number ? `…${String(p.utr_number).slice(-4)}` : null })),
          recentJobs: jobs.data ?? [],
        };
      },
    }),
    handOffToHuman: tool({
      description: "Escalate this conversation to a human by email when you are not sure or the user needs a person.",
      inputSchema: z.object({ reason: z.string().min(3).max(200), summary: z.string().min(3).max(1000) }),
      execute: async ({ reason, summary }) => {
        const transcript = history.slice(-10).map((m) => `${m.role}: ${textOf(m)}`).join("\n").slice(0, 6000);
        const email = await sendHandoffEmail({ userEmail, threadId: thread.id, reason, summary, transcript });
        await admin.from("support_threads").update({
          status: "handed_off", handoff_reason: reason, handoff_at: new Date().toISOString(),
        }).eq("id", thread.id);
        return email.sent
          ? { handedOff: true, emailSent: true }
          : { handedOff: true, emailSent: false, note: "Ask the user to also email documentai999@gmail.com." };
      },
    }),
  };

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: SYSTEM,
    messages: convertToModelMessages(history),
    tools,
    stopWhen: stepCountIs(6),
    abortSignal: req.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: history,
    generateMessageId: () => crypto.randomUUID(),
    sendReasoning: false,
    onError: (error: any) => {
      console.error("support-chat stream error", error);
      const status = error?.statusCode ?? error?.status;
      if (status === 402) return "Support chat is temporarily unavailable (AI credits exhausted). Please email documentai999@gmail.com.";
      if (status === 429) return "Support is busy right now. Please try again in a minute.";
      return "Something went wrong. Please try again or email documentai999@gmail.com.";
    },
    onFinish: async ({ responseMessage }) => {
      if (!responseMessage?.parts?.length) return;
      const { error } = await admin.from("support_messages").upsert(
        { thread_id: thread.id, user_id: user.id, role: "assistant", message_id: responseMessage.id, message: responseMessage },
        { onConflict: "thread_id,message_id" },
      );
      if (error) console.error("assistant message save failed", error.message);
    },
  });

  return withLovableAiGatewayRunIdHeader(response, runIdFetch, corsHeaders);
});
