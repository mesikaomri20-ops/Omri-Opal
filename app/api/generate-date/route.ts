import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Model fallback chain — newest first
const MODELS_TO_TRY = [
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

export async function POST(req: Request) {
  // .trim() prevents hidden whitespace issues from Vercel copy-paste
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
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

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
You are a creative date-night planning assistant for a couple in Israel.
Generate exactly 3 unique, fun date night ideas based strictly on these constraints:
Vibe: ${vibe}
Budget: ${budget}
Location: ${locationType}

Rules:
- Respond ONLY with a valid JSON array. No markdown, no backticks, no text before or after the array.
- Write all titles and descriptions in Hebrew.
- Each object must have ONLY these exact keys: "title", "description", "vibe", "budget", "location_type".
- The values for "vibe", "budget", and "location_type" MUST exactly match the provided constraint strings above.

Example output:
[{"title":"ערב קולינרי","description":"נסו לבשל מנה חדשה ביחד.","vibe":"${vibe}","budget":"${budget}","location_type":"${locationType}"}]
`;

    let ideas: unknown[] | null = null;
    let lastError = "";

    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`[generate-date] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log(`[generate-date] Raw response from ${modelName}:`, responseText.slice(0, 200));

        // Strip markdown fences defensively
        let jsonString = responseText.trim();
        const fenceMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) jsonString = fenceMatch[1].trim();

        ideas = JSON.parse(jsonString);
        console.log(`[generate-date] Success with model: ${modelName}`);
        break;
      } catch (err: any) {
        lastError = err?.message ?? String(err);
        console.warn(`[generate-date] Model ${modelName} failed:`, lastError);
      }
    }

    if (!ideas) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    return NextResponse.json({ ideas });

  } catch (error: any) {
    console.error("[generate-date] Unhandled error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}