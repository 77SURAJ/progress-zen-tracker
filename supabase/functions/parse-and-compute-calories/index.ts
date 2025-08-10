import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParseRequest {
  text: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text }: ParseRequest = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid payload: expected { text: string }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const system = `You are a nutrition parser. Convert free text foods into JSON.
Return ONLY strict JSON with this schema:
{
  "items": [
    {"name": string, "qty": string, "grams": number | null, "calories": number, "junk": boolean, "junk_reason": string|null}
  ],
  "total_calories": number,
  "junk_incidents": number,
  "recommendations": string[],
  "confidence": number
}
Guidelines:
- Estimate grams and calories reasonably if not provided.
- junk=true for deep-fried, ultra-processed snacks, candy, sugary soda, burgers, pizza, fries, chips, donuts, etc.
- Keep numbers realistic; avoid huge overestimates.
- Always fill "recommendations" with 1-3 short tips.
- Respond with JSON ONLY, no markdown.`;

    const user = `Text: ${text}`;

    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.2,
      }),
    });

    let data: any;
    if (aiResp.ok) {
      const json = await aiResp.json();
      const content = json.choices?.[0]?.message?.content ?? "{}";
      try {
        data = JSON.parse(content);
      } catch {
        // Fallback: try to extract JSON substring
        const match = content.match(/\{[\s\S]*\}$/);
        data = match ? JSON.parse(match[0]) : null;
      }
    }

    // Simple heuristic fallback if AI failed
    if (!data || !Array.isArray(data.items)) {
      const lower = text.toLowerCase();
      const junkKeywords = ["fried", "burger", "pizza", "fries", "chips", "soda", "candy", "donut", "chocolate"];
      const isJunk = junkKeywords.some(k => lower.includes(k));
      const estCalories = Math.max(80, Math.min(900, Math.round(text.split(" ").length * 60)));
      data = {
        items: [{ name: text.trim(), qty: "1 serving", grams: null, calories: estCalories, junk: isJunk, junk_reason: isJunk ? "Matches junk keyword" : null }],
        total_calories: estCalories,
        junk_incidents: isJunk ? 1 : 0,
        recommendations: [isJunk ? "Try a grilled alternative" : "Great choice—add greens"],
        confidence: 0.55,
      };
    }

    // Safety clamps
    data.total_calories = Math.max(0, Number(data.total_calories) || 0);
    data.junk_incidents = Math.max(0, Number(data.junk_incidents) || 0);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in parse-and-compute-calories:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
