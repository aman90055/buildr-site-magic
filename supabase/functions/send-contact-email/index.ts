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

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function getProviderMessage(details: any): string {
  const message = typeof details?.message === "string" ? details.message.toLowerCase() : "";
  if (message.includes("api key") || message.includes("invalid")) {
    return "Your message was saved, but email delivery needs a valid mail API key.";
  }
  return "Your message was saved, but email delivery is temporarily unavailable.";
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
      return jsonResponse({ error: "Rate limit exceeded. Please try again later." }, 429);
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ error: "Invalid email format" }, 400);
    }

    if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 2000) {
      return jsonResponse({ error: "Field length exceeded" }, 400);
    }

    const { data: savedMessage, error: saveError } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
        delivery_status: "pending",
      })
      .select("id")
      .single();

    if (saveError) {
      console.error("Contact message save error:", saveError.message);
      return jsonResponse({ error: "Could not save your message. Please email documentai999@gmail.com directly." }, 500);
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    // Resend keys always start with "re_" and are ~30+ chars. Reject missing/malformed keys early.
    const isValidResendKey = typeof RESEND_API_KEY === "string"
      && RESEND_API_KEY.startsWith("re_")
      && RESEND_API_KEY.length >= 20
      && !/\s/.test(RESEND_API_KEY);

    if (!isValidResendKey) {
      console.error("RESEND_API_KEY missing or malformed:", {
        present: !!RESEND_API_KEY,
        length: RESEND_API_KEY?.length ?? 0,
        startsWithRe: RESEND_API_KEY?.startsWith("re_") ?? false,
      });
      await supabase
        .from("contact_messages")
        .update({ delivery_status: "failed", provider_error: { reason: "RESEND_API_KEY missing or malformed" } })
        .eq("id", savedMessage.id);
      return jsonResponse({
        success: true,
        queued: true,
        message: "Message saved successfully. Email delivery is not configured yet.",
      }, 202);
    }

    const OWNER_EMAIL = Deno.env.get("CONTACT_OWNER_EMAIL") || "documentai999@gmail.com";

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
      await supabase
        .from("contact_messages")
        .update({ delivery_status: "failed", provider_error: responseData })
        .eq("id", savedMessage.id);

      return jsonResponse({
        success: true,
        queued: true,
        message: getProviderMessage(responseData),
      }, 202);
    }

    await supabase
      .from("contact_messages")
      .update({ delivery_status: "sent", provider_error: null })
      .eq("id", savedMessage.id);

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

    return jsonResponse({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return jsonResponse({ error: "Failed to send email" }, 500);
  }
};

serve(handler);
