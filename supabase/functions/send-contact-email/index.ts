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

    const OWNER_EMAIL = Deno.env.get("CONTACT_OWNER_EMAIL") || "aman9005573@gmail.com";

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

    // Send confirmation email to the user
    const confirmHtml = `<!DOCTYPE html><html><head><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;background:#f3f4f6;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);color:white;padding:32px 24px;text-align:center}.header h1{margin:0;font-size:24px;font-weight:700}.content{padding:32px 24px}.content p{color:#4b5563;font-size:15px;margin:0 0 16px}.message-box{background:#f9fafb;border-left:4px solid #6366f1;padding:16px;border-radius:6px;margin:20px 0;color:#374151;white-space:pre-wrap;font-size:14px}.footer{background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb}</style></head><body><div class="container"><div class="header"><h1>✅ Message Received!</h1></div><div class="content"><p>Hi <strong>${escapeHtml(name)}</strong>,</p><p>Thank you for reaching out to <strong>PDF Tools</strong>! We've received your message and our team will get back to you within <strong>24 hours</strong>.</p><p><strong>Your message summary:</strong></p><p style="margin:0 0 6px"><strong>Subject:</strong> ${escapeHtml(subject)}</p><div class="message-box">${escapeHtml(message)}</div><p>Meanwhile, feel free to explore our <strong>100% free</strong> tools at <a href="https://document-edit-in.lovable.app" style="color:#6366f1">document-edit-in.lovable.app</a></p><p style="color:#9ca3af;font-size:13px;margin-top:30px">If you didn't send this message, please ignore this email.</p></div><div class="footer"><p>PDF Tools • Made in India 🇮🇳 with ❤️</p><p>Managed by Aman Vishwakarma</p></div></div></body></html>`;

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
      console.error("Contact confirmation email error:", errText);
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
