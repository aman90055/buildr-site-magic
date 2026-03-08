import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, utr_number, plan, amount } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Send notification to admin
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PDF Tools <onboarding@resend.dev>',
        to: ['documentai999@gmail.com'],
        subject: `🔔 New Payment: ${plan} Plan - ₹${amount}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6d28d9;">💰 New Payment Verification</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">UTR Number</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${utr_number}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Plan</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${plan}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Amount</td><td style="padding: 10px; border-bottom: 1px solid #eee;">₹${amount}</td></tr>
            </table>
            <p style="color: #666;">Please verify this payment and activate the user's plan.</p>
          </div>
        `,
      }),
    });

    const adminData = await adminRes.json();

    // Send confirmation to user
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PDF Tools <onboarding@resend.dev>',
        to: [email],
        subject: `✅ Payment Received - ${plan} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6d28d9;">Thank You, ${name}! 🎉</h2>
            <p>We've received your payment verification for the <strong>${plan}</strong> plan (₹${amount}/month).</p>
            <p><strong>UTR:</strong> ${utr_number}</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;">⏳ Your plan will be activated within <strong>24 hours</strong> after verification.</p>
            </div>
            <p style="color: #666;">If you have questions, reply to this email or contact us at support.</p>
          </div>
        `,
      }),
    });

    await userRes.json();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Payment notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
