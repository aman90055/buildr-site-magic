import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function checkRateLimit(supabase: any, identifier: string, functionName: string, limit: number, windowMs: number): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();
  const { count } = await supabase.from("rate_limits").select("*", { count: "exact", head: true }).eq("identifier", identifier).eq("function_name", functionName).gte("window_start", windowStart);
  if ((count || 0) >= limit) return false;
  await supabase.from("rate_limits").insert({ identifier, function_name: functionName, window_start: new Date().toISOString() });
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const identifier = req.headers.get("x-forwarded-for") || "unknown";
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = data?.user?.id || null;
    }
    const limit = userId ? 30 : 5;
    if (!await checkRateLimit(supabase, userId || identifier, "ai-compression-analyze", limit, 60000)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { fileName, fileSize, hasTextContent, hasImageContent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    const prompt = `Analyze this PDF file for optimal compression settings:\n- File name: ${fileName}\n- File size: ${fileSizeMB} MB\n- Contains text content: ${hasTextContent ? "Yes" : "No"}\n- Contains images: ${hasImageContent ? "Yes" : "No"}\n\nBased on this information, recommend the optimal compression level (1-100, where higher = more compression) and explain why.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `You are a PDF compression expert. Analyze files and recommend optimal compression settings.\n\nRules for recommendations:\n- Text-heavy PDFs: 30-50% compression (preserve readability)\n- Image-heavy PDFs: 60-80% compression (balance quality/size)\n- Mixed content: 45-65% compression\n- Large files (>10MB): lean towards higher compression\n- Small files (<1MB): lean towards lower compression to preserve quality\n\nAlways respond with JSON only, no other text.` },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "recommend_compression",
            description: "Recommend optimal PDF compression settings",
            parameters: {
              type: "object",
              properties: {
                recommendedLevel: { type: "number", description: "Compression level from 1-100" },
                contentType: { type: "string", description: "Brief description of content type" },
                estimatedReduction: { type: "string", description: "Estimated file size reduction percentage range" },
                reasoning: { type: "string", description: "Brief explanation for the recommendation" },
              },
              required: ["recommendedLevel", "contentType", "estimatedReduction", "reasoning"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "recommend_compression" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Usage limit reached" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ recommendedLevel: 50, contentType: "Standard document", estimatedReduction: "20-40%", reasoning: "Balanced compression recommended." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in ai-compression-analyze:", error);
    return new Response(JSON.stringify({ error: "An error occurred", recommendedLevel: 50, contentType: "Standard document", estimatedReduction: "20-40%", reasoning: "Using balanced compression settings." }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
