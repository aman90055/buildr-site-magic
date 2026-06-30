import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function checkRateLimit(supabase: any, identifier: string, functionName: string, limit: number, windowMs: number): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();
  const { count } = await supabase.from("rate_limits").select("*", { count: "exact", head: true }).eq("identifier", identifier).eq("function_name", functionName).gte("window_start", windowStart);
  if ((count || 0) >= limit) return false;
  await supabase.from("rate_limits").insert({ identifier, function_name: functionName, window_start: new Date().toISOString() });
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const identifier = req.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(supabase, identifier, "send-contact-email", 3, 60000)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Field length exceeded" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const OWNER_EMAIL = Deno.env.get("CONTACT_OWNER_EMAIL") || "support@documenteditpro.ai";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Document Editor <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: `[Contact Form] ${subject}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p><strong>Message:</strong></p><div style="white-space:pre-wrap;padding:12px;background:#f9fafb;border-radius:6px">${escapeHtml(message)}</div></div>`,
      }),
    });

    const responseData = await emailResponse.json();
    if (!emailResponse.ok) {
      console.error("Resend error (owner):", emailResponse.status, JSON.stringify(responseData));
      return new Response(JSON.stringify({ error: "Failed to send email", details: responseData }), { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Confirmation to user (will only deliver once Resend domain is verified; safely ignore errors in sandbox)
    try {
      const confirmHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><h2>✅ Message Received</h2><p>Hi <strong>${escapeHtml(name)}</strong>,</p><p>Thanks for reaching out. We've received your message and will reply within 24 hours.</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><div style="white-space:pre-wrap;padding:12px;background:#f9fafb;border-radius:6px;border-left:4px solid #6366f1">${escapeHtml(message)}</div><p style="color:#6b7280;font-size:12px;margin-top:24px">PDF Tools — Managed by Aman Vishwakarma</p></div>`;
      const confirmRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PDF Tools <onboarding@resend.dev>",
          to: [email],
          subject: `✅ We received your message: ${subject}`,
          html: confirmHtml,
        }),
      });
      if (!confirmRes.ok) {
        const errText = await confirmRes.text();
        console.warn("Confirmation email skipped (likely sandbox mode):", errText);
      }
    } catch (e) {
      console.warn("Confirmation email error:", e);
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
