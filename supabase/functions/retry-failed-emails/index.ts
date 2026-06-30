import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const MAX_ATTEMPTS = 5;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const isValidKey =
    typeof RESEND_API_KEY === "string" &&
    RESEND_API_KEY.startsWith("re_") &&
    RESEND_API_KEY.length >= 20 &&
    !/\s/.test(RESEND_API_KEY);

  if (!isValidKey) {
    return new Response(
      JSON.stringify({ skipped: true, reason: "RESEND_API_KEY missing or malformed" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const OWNER_EMAIL = Deno.env.get("CONTACT_OWNER_EMAIL") || "documentai999@gmail.com";
  const now = new Date().toISOString();

  const { data: queue, error } = await supabase
    .from("contact_messages")
    .select("id,name,email,subject,message,attempts")
    .in("delivery_status", ["failed", "retrying", "pending"])
    .lt("attempts", MAX_ATTEMPTS)
    .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const results: Array<{ id: string; status: string }> = [];

  for (const row of queue ?? []) {
    const attempts = (row.attempts ?? 0) + 1;
    const attemptedAt = new Date().toISOString();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Document Editor <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        reply_to: row.email,
        subject: `[Contact Form • retry ${attempts}] ${row.subject}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><h2>Retried Contact Message</h2><p><strong>Name:</strong> ${escapeHtml(row.name)}</p><p><strong>Email:</strong> ${escapeHtml(row.email)}</p><p><strong>Subject:</strong> ${escapeHtml(row.subject)}</p><div style="white-space:pre-wrap;padding:12px;background:#f9fafb;border-radius:6px">${escapeHtml(row.message)}</div></div>`,
      }),
    });

    const body = await res.json().catch(() => ({}));

    if (res.ok) {
      await supabase
        .from("contact_messages")
        .update({
          delivery_status: "sent",
          provider_error: null,
          attempts,
          last_attempt_at: attemptedAt,
          sent_at: attemptedAt,
          next_retry_at: null,
        })
        .eq("id", row.id);
      results.push({ id: row.id, status: "sent" });
    } else {
      const exhausted = attempts >= MAX_ATTEMPTS;
      // Exponential backoff: 2^attempts minutes (max 24h)
      const backoffMs = Math.min(Math.pow(2, attempts) * 60_000, 24 * 60 * 60_000);
      const nextRetry = new Date(Date.now() + backoffMs).toISOString();
      await supabase
        .from("contact_messages")
        .update({
          delivery_status: exhausted ? "failed" : "retrying",
          provider_error: body,
          attempts,
          last_attempt_at: attemptedAt,
          next_retry_at: exhausted ? null : nextRetry,
        })
        .eq("id", row.id);
      results.push({ id: row.id, status: exhausted ? "failed" : "retrying" });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
