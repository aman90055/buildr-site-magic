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
    const { email, plan, payment_verification_id } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

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

    // Upsert premium status
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
