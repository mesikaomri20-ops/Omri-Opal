import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Diagnostic: log key presence on every request (visible in Vercel Function Logs)
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("[generate-date] GOOGLE_GENERATIVE_AI_API_KEY present:", !!apiKey);

  try {
    const body = await req.json();
    const { vibe, budget, locationType } = body;
    console.log("[generate-date] Received filters:", { vibe, budget, locationType });

    if (!vibe || !budget || !locationType) {
      console.error("[generate-date] Missing one or more filter parameters");
      return NextResponse.json({ error: "Missing parameters: vibe, budget, locationType are all required" }, { status: 400 });
    }

    if (!apiKey) {
      console.error("[generate-date] GOOGLE_GENERATIVE_AI_API_KEY is undefined — check Vercel Environment Variables");
      return NextResponse.json({ error: "Server configuration error: API key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
You are a creative date-night planning assistant specialized in generating unique, romantic, or fun date ideas for couples.
Generate exactly 3 unique date night ideas based strictly on these constraints:
Vibe: ${vibe}
Budget: ${budget}
Location: ${locationType}

Respond ONLY with a valid JSON array of objects. Do NOT include any markdown formatting, backticks, or conversational text outside the JSON array.
Each object must have exactly these keys:
"title" (A short, catchy title in Hebrew)
"description" (A 1-2 sentence description in Hebrew, formatted warmly)
"vibe" (Must exactly map back to the provided string: ${vibe})
"budget" (Must exactly map back to the provided string: ${budget})
"location_type" (Must exactly map back to the provided string: ${locationType})

Example:
[
  { "title": "סדנת קוקטיילים", "description": "...", "vibe": "${vibe}", "budget": "${budget}", "location_type": "${locationType}" }
]
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Safely parse JSON if wrapped in markdown
    let jsonString = responseText.trim();
    if (jsonString.startsWith("```json")) {
        jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.slice(3, -3).trim();
    }

    const ideas = JSON.parse(jsonString);

    return NextResponse.json({ ideas });
  } catch (error: any) {
    console.error("[generate-date] Unhandled error:", error?.message ?? error);
    console.error("[generate-date] Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: error?.message ?? "Unknown server error in generate-date route" },
      { status: 500 }
    );
  }
}
