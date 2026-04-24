import { NextResponse } from "next/server";

const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
];

async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  // Use v1 (stable) endpoint directly — the SDK defaults to v1beta which doesn't serve 1.5 models.
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  
  console.log(`[generate-date] Attempting model: ${model} via URL: ${url.replace(apiKey, "***")}`);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 1024 }
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[generate-date] Model ${model} returned ${res.status}:`, errBody);
    throw new Error(`Model ${model} failed with status ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`Model ${model} returned empty content`);
  return text;
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("[generate-date] GOOGLE_GENERATIVE_AI_API_KEY present:", !!apiKey);

  try {
    const body = await req.json();
    const { vibe, budget, locationType } = body;
    console.log("[generate-date] Received filters:", { vibe, budget, locationType });

    if (!vibe || !budget || !locationType) {
      console.error("[generate-date] Missing one or more filter parameters");
      return NextResponse.json(
        { error: "Missing parameters: vibe, budget, locationType are all required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      console.error("[generate-date] GOOGLE_GENERATIVE_AI_API_KEY is undefined — check Vercel Environment Variables");
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

Respond ONLY with a valid JSON array. No markdown, no backticks, no extra text before or after the JSON.
Each object must have exactly these keys:
- "title": A short, catchy title in Hebrew
- "description": A warm 1-2 sentence description in Hebrew
- "vibe": Must be exactly: ${vibe}
- "budget": Must be exactly: ${budget}
- "location_type": Must be exactly: ${locationType}

Example output format:
[{"title":"...","description":"...","vibe":"${vibe}","budget":"${budget}","location_type":"${locationType}"}]
`;

    let responseText: string | null = null;
    let lastError: string = "";

    for (const model of MODELS_TO_TRY) {
      try {
        responseText = await callGemini(apiKey, model, prompt);
        console.log(`[generate-date] Success with model: ${model}`);
        break;
      } catch (err: any) {
        lastError = err.message;
        console.warn(`[generate-date] Skipping ${model}:`, err.message);
      }
    }

    if (!responseText) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    // Strip markdown fences if model ignores the instruction
    let jsonString = responseText.trim();
    const fenceMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonString = fenceMatch[1].trim();

    const ideas = JSON.parse(jsonString);
    return NextResponse.json({ ideas });

  } catch (error: any) {
    console.error("[generate-date] Unhandled error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown server error in generate-date route" },
      { status: 500 }
    );
  }
}
