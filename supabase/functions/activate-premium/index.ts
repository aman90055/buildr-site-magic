import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AuthN: require a valid JWT ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: userData, error: userAuthError } = await supabaseAdmin.auth.getUser(token);
    if (userAuthError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- AuthZ: caller must be admin ---
    const { data: roleRow } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Input validation ---
    const body = await req.json().catch(() => ({}));
    const { email, plan, payment_verification_id } = body ?? {};
    const allowedPlans = ['basic', 'pro', 'enterprise'];
    if (
      typeof email !== 'string' || email.length > 255 || !email.includes('@') ||
      typeof plan !== 'string' || !allowedPlans.includes(plan) ||
      typeof payment_verification_id !== 'string' || payment_verification_id.length > 64
    ) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Verify the payment record exists and is verified ---
    const { data: payment, error: payErr } = await supabaseAdmin
      .from('payment_verifications')
      .select('id, status, plan, email')
      .eq('id', payment_verification_id)
      .maybeSingle();
    if (payErr || !payment) {
      return new Response(JSON.stringify({ error: 'Payment verification not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (payment.status !== 'verified') {
      return new Response(JSON.stringify({ error: 'Payment is not in verified status' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find user by email
    const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;

    const user = usersData.users.find((u: any) => u.email === email);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found with this email. Premium will activate when they sign up." }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: premiumError } = await supabaseAdmin
      .from("user_premium_status")
      .upsert({
        user_id: user.id,
        plan,
        is_active: true,
        payment_verification_id,
        activated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (premiumError) throw premiumError;

    return new Response(JSON.stringify({ success: true, message: "Premium activated!" }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Activate premium error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
