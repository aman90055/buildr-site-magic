import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { checkDailyAiQuota, dailyLimitResponse } from "../_shared/aiQuota.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Shared daily AI allowance + per-minute burst limit.
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const identifier = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = data?.user?.id || null;
    }
    const dailyQuota = await checkDailyAiQuota(admin, userId, identifier);
    if (!dailyQuota.allowed) return dailyLimitResponse(dailyQuota, corsHeaders);
    const rateKey = userId || identifier;
    const minuteAgo = new Date(Date.now() - 60000).toISOString();
    const { count: recent } = await admin.from("rate_limits").select("*", { count: "exact", head: true })
      .eq("identifier", rateKey).eq("function_name", "ai-transcribe").gte("window_start", minuteAgo);
    if ((recent || 0) >= (userId ? 20 : 5)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    await admin.from("rate_limits").insert({ identifier: rateKey, function_name: "ai-transcribe", window_start: new Date().toISOString() });

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) && !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: "Missing audio file" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const language = (form.get("language") as string) || "";

    // Detect extension from mime
    const mime = (file as File).type?.split(";")[0] || "audio/webm";
    const extMap: Record<string, string> = {
      "audio/webm": "webm",
      "audio/mp4": "mp4",
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "audio/wav": "wav",
      "audio/x-wav": "wav",
      "audio/ogg": "ogg",
      "audio/m4a": "m4a",
    };
    const ext = extMap[mime] || "webm";

    const upstream = new FormData();
    upstream.append("model", "openai/gpt-4o-transcribe");
    upstream.append("file", file, `recording.${ext}`);
    if (language) upstream.append("language", language);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: upstream,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("STT failed", res.status, errText);
      return new Response(
        JSON.stringify({ error: errText || `Transcription failed (${res.status})` }),
        { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify({ text: data.text || "" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-transcribe error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
