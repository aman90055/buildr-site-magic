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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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

    // SECURITY: Fetch plan from Razorpay order notes (set server-side on create) —
    // never trust the client-supplied plan field.
    const keyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const rzpAuth = btoa(`${keyId}:${keySecret}`);
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: { Authorization: `Basic ${rzpAuth}` },
    });
    if (!orderRes.ok) {
      return new Response(JSON.stringify({ error: "Order lookup failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const order = await orderRes.json();
    const plan = String(order?.notes?.plan || "").toLowerCase();
    const orderUserId = String(order?.notes?.user_id || "");
    const PLAN_PRICES_INR: Record<string, number> = { basic: 99, pro: 249, enterprise: 599 };
    if (!PLAN_PRICES_INR[plan]) {
      return new Response(JSON.stringify({ error: "Invalid plan on order" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Ensure the verifying user matches the order creator
    if (orderUserId && orderUserId !== claims.claims.sub) {
      return new Response(JSON.stringify({ error: "Order does not belong to this user" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Verify amount matches expected plan price (in paise)
    const expectedPaise = PLAN_PRICES_INR[plan] * 100;
    if (Number(order?.amount) !== expectedPaise) {
      return new Response(JSON.stringify({ error: "Amount mismatch" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const verifiedAmount = PLAN_PRICES_INR[plan];


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
