import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileSize, hasTextContent, hasImageContent } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    
    const prompt = `Analyze this PDF file for optimal compression settings:
- File name: ${fileName}
- File size: ${fileSizeMB} MB
- Contains text content: ${hasTextContent ? "Yes" : "No"}
- Contains images: ${hasImageContent ? "Yes" : "No"}

Based on this information, recommend the optimal compression level (1-100, where higher = more compression) and explain why.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a PDF compression expert. Analyze files and recommend optimal compression settings.
            
Rules for recommendations:
- Text-heavy PDFs: 30-50% compression (preserve readability)
- Image-heavy PDFs: 60-80% compression (balance quality/size)
- Mixed content: 45-65% compression
- Large files (>10MB): lean towards higher compression
- Small files (<1MB): lean towards lower compression to preserve quality

Always respond with JSON only, no other text.`,
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_compression",
              description: "Recommend optimal PDF compression settings",
              parameters: {
                type: "object",
                properties: {
                  recommendedLevel: {
                    type: "number",
                    description: "Compression level from 1-100",
                  },
                  contentType: {
                    type: "string",
                    description: "Brief description of content type (e.g., 'Text-heavy document', 'Image-rich presentation')",
                  },
                  estimatedReduction: {
                    type: "string",
                    description: "Estimated file size reduction percentage range (e.g., '30-50%')",
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation for the recommendation (1-2 sentences)",
                  },
                },
                required: ["recommendedLevel", "contentType", "estimatedReduction", "reasoning"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "recommend_compression" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    // Extract tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback response
    return new Response(
      JSON.stringify({
        recommendedLevel: 50,
        contentType: "Standard document",
        estimatedReduction: "20-40%",
        reasoning: "Balanced compression recommended for optimal quality and file size.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-compression-analyze:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        // Provide fallback data even on error
        recommendedLevel: 50,
        contentType: "Standard document",
        estimatedReduction: "20-40%",
        reasoning: "Using balanced compression settings.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
