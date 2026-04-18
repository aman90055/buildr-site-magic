import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "documentai999@gmail.com";

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function checkRateLimit(
  supabase: any,
  identifier: string,
  functionName: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();
  const { count } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("function_name", functionName)
    .gte("window_start", windowStart);
  if ((count || 0) >= limit) return false;
  await supabase.from("rate_limits").insert({
    identifier,
    function_name: functionName,
    window_start: new Date().toISOString(),
  });
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const identifier = req.headers.get("x-forwarded-for") || "unknown";
    if (!(await checkRateLimit(supabase, identifier, "send-newsletter-notification", 10, 60000))) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, source } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get total subscriber count for context
    const { count: totalCount } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const safeEmail = escapeHtml(email);
    const safeSource = escapeHtml(source || "Website");
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const html = `<!DOCTYPE html><html><head><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;background:#f3f4f6;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);color:white;padding:32px 24px;text-align:center}.header h1{margin:0;font-size:24px;font-weight:700}.header p{margin:8px 0 0;opacity:0.9;font-size:14px}.content{padding:32px 24px}.badge{display:inline-block;background:#ecfdf5;color:#065f46;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:20px}.field{margin-bottom:20px;padding:16px;background:#f9fafb;border-radius:8px;border-left:4px solid #6366f1}.label{font-weight:600;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}.value{font-size:16px;color:#111827;font-weight:500;word-break:break-all}.stats{background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);padding:20px;border-radius:8px;text-align:center;margin-top:20px}.stats-number{font-size:32px;font-weight:700;color:#92400e;margin:0}.stats-label{font-size:13px;color:#78350f;margin:4px 0 0}.footer{background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb}</style></head><body><div class="container"><div class="header"><h1>🎉 New Newsletter Subscriber!</h1><p>Someone just joined your mailing list</p></div><div class="content"><div class="badge">✨ NEW SUBSCRIBER</div><div class="field"><div class="label">📧 Email Address</div><div class="value">${safeEmail}</div></div><div class="field"><div class="label">🌐 Source</div><div class="value">${safeSource}</div></div><div class="field"><div class="label">🕒 Subscribed At</div><div class="value">${timestamp}</div></div><div class="stats"><p class="stats-number">${totalCount || 1}</p><p class="stats-label">Total Active Subscribers</p></div></div><div class="footer"><p>PDF Tools Newsletter • Made in India 🇮🇳</p><p>This is an automated notification from your platform.</p></div></div></body></html>`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PDF Tools Newsletter <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🎉 New Subscriber: ${email}`,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send notification" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Newsletter notification error:", error);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
