import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Rate limit: 3 requests/min per IP ---
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const windowStart = new Date(Date.now() - 60_000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from('rate_limits')
      .select('id, request_count, window_start')
      .eq('identifier', ip)
      .eq('function_name', 'payment-notification')
      .gte('window_start', windowStart)
      .maybeSingle();

    if (recent && recent.request_count >= 3) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (recent) {
      await supabaseAdmin.from('rate_limits').update({ request_count: recent.request_count + 1 }).eq('id', recent.id);
    } else {
      await supabaseAdmin.from('rate_limits').insert({
        identifier: ip, function_name: 'payment-notification', request_count: 1,
      });
    }

    // --- Input validation ---
    const body = await req.json().catch(() => ({}));
    const { name, email, utr_number, plan, amount } = body ?? {};
    const allowedPlans = ['basic', 'pro', 'enterprise'];
    if (
      typeof name !== 'string' || name.length < 1 || name.length > 100 ||
      typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 255 ||
      typeof utr_number !== 'string' || utr_number.length < 4 || utr_number.length > 64 ||
      typeof plan !== 'string' || !allowedPlans.includes(plan) ||
      typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000
    ) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeUtr = escapeHtml(utr_number);
    const safePlan = escapeHtml(plan);
    const safeAmount = escapeHtml(String(amount));

    // Send notification to admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PDF Tools <onboarding@resend.dev>',
        to: ['documentai999@gmail.com'],
        subject: `🔔 New Payment: ${safePlan} Plan - ₹${safeAmount}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6d28d9;">💰 New Payment Verification</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeName}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">UTR Number</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeUtr}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Plan</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safePlan}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Amount</td><td style="padding: 10px; border-bottom: 1px solid #eee;">₹${safeAmount}</td></tr>
            </table>
            <p style="color: #666;">Please verify this payment and activate the user's plan.</p>
          </div>
        `,
      }),
    });

    // Send confirmation to user
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PDF Tools <onboarding@resend.dev>',
        to: [email],
        subject: `✅ Payment Received - ${safePlan} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6d28d9;">Thank You, ${safeName}! 🎉</h2>
            <p>We've received your payment verification for the <strong>${safePlan}</strong> plan (₹${safeAmount}/month).</p>
            <p><strong>UTR:</strong> ${safeUtr}</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;">⏳ Your plan will be activated within <strong>24 hours</strong> after verification.</p>
            </div>
            <p style="color: #666;">If you have questions, reply to this email or contact us at support.</p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Payment notification error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
