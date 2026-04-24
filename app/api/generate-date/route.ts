import { NextResponse } from "next/server";

const API_BASE = "https://generativelanguage.googleapis.com/v1/models";

const MODELS_TO_TRY = [
  "gemini-2.5-flash",      // Current standard as of 2026
  "gemini-2.5-flash-lite", // Lighter fallback
  "gemini-2.0-flash",      // Stable fallback on free-tier
];

async function callGeminiREST(
  apiKey: string,
  model: string,
  prompt: string
): Promise<{ text: string; status: number }> {
  const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;
  console.log(`[generate-date] Trying model: ${model}`);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.warn(`[generate-date] Model "${model}" returned HTTP ${res.status}:`, errBody.slice(0, 300));
    return { text: "", status: res.status };
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  console.log(`[generate-date] Raw response snippet from "${model}":`, text.slice(0, 200));
  return { text, status: 200 };
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  console.log("[generate-date] GOOGLE_GENERATIVE_AI_API_KEY present:", !!apiKey);

  try {
    const body = await req.json();
    const { vibe, budget, locationType } = body;
    console.log("[generate-date] Received filters:", { vibe, budget, locationType });

    if (!vibe || !budget || !locationType) {
      console.error("[generate-date] Missing filter parameters");
      return NextResponse.json(
        { error: "Missing parameters: vibe, budget, locationType are all required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      console.error("[generate-date] API key missing — check Vercel Environment Variables");
      return NextResponse.json(
        { error: "Server configuration error: API key missing" },
        { status: 500 }
      );
    }

    const prompt = `
You are a creative date-night planning assistant for a couple in Israel.
Generate exactly 3 unique, fun date night ideas based strictly on these constraints:
Vibe: ${vibe}
Budget: ${budget}
Location: ${locationType}

Rules:
- Respond ONLY with a valid JSON array. No markdown, no backticks, no text before or after the array.
- Write ALL titles and descriptions in Hebrew.
- Each object must have ONLY these exact keys: "title", "description", "vibe", "budget", "location_type".
- The values for "vibe", "budget", and "location_type" MUST be exactly: "${vibe}", "${budget}", "${locationType}".

Output format (no extra text):
[{"title":"...","description":"...","vibe":"${vibe}","budget":"${budget}","location_type":"${locationType}"}]
`;

    let parsedIdeas: unknown[] | null = null;
    let lastError = "";

    for (const model of MODELS_TO_TRY) {
      const { text, status } = await callGeminiREST(apiKey, model, prompt);

      if (status === 429) {
        console.warn(`[generate-date] Quota exceeded for "${model}", trying next...`);
        lastError = `Quota exceeded for ${model}`;
        continue;
      }

      if (!text) {
        lastError = `Empty response from ${model} (HTTP ${status})`;
        continue;
      }

      try {
        // Strip markdown fences if model disobeys
        let jsonString = text.trim();
        const fenceMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) jsonString = fenceMatch[1].trim();

        parsedIdeas = JSON.parse(jsonString);
        console.log(`[generate-date] ✓ Success with model: ${model}`);
        break;
      } catch (parseErr: any) {
        lastError = `Parse error from ${model}: ${parseErr.message}`;
        console.error(`[generate-date] JSON parse failed for "${model}":`, parseErr.message);
      }
    }

    if (!parsedIdeas) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    return NextResponse.json({ ideas: parsedIdeas });

  } catch (error: any) {
    console.error("[generate-date] Unhandled error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}