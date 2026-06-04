import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: cErr } = await userClient.auth.getClaims(token);
    if (cErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, amount } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify HMAC SHA256 signature
    const expected = createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Signature verification failed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const userId = claims.claims.sub;
    const email = claims.claims.email ?? "";

    // Record payment as verified
    const { data: pv, error: pvErr } = await admin
      .from("payment_verifications")
      .insert({
        name: email.split("@")[0] || "Razorpay user",
        email,
        utr_number: razorpay_payment_id,
        plan,
        amount: Number(amount) || 0,
        status: "verified",
        verified_at: new Date().toISOString(),
        notes: `Razorpay order: ${razorpay_order_id}`,
      })
      .select()
      .single();

    if (pvErr) {
      return new Response(JSON.stringify({ error: pvErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Activate premium (30 days) — deactivate old, insert new
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await admin
      .from("user_premium_status")
      .update({ is_active: false })
      .eq("user_id", userId);

    await admin.from("user_premium_status").insert({
      user_id: userId,
      plan,
      is_active: true,
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
      payment_verification_id: pv.id,
    });

    return new Response(JSON.stringify({ success: true, plan, expires_at: expiresAt }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
