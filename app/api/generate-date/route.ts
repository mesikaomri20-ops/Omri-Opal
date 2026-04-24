import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  // התיקון הקריטי: מחיקת רווחים נסתרים מהמפתח ושימוש בספרייה הרשמית
  const rawKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
  const apiKey = rawKey.trim();

  if (!apiKey) {
    console.error("[generate-date] API key missing");
    return NextResponse.json({ error: "API key missing from Vercel" }, { status: 500 });
  }

  try {
    const { vibe, budget, locationType } = await req.json();

    if (!vibe || !budget || !locationType) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const prompt = `
    You are a creative date-night planning assistant for a couple in Israel.
    Generate exactly 3 unique, fun date night ideas based strictly on these constraints:
    Vibe: ${vibe}
    Budget: ${budget}
    Location: ${locationType}

    Respond ONLY with a valid JSON array. No markdown, no extra text.
    Each object must have:
    - "title": A short title in Hebrew
    - "description": 1-2 sentence description in Hebrew
    - "vibe": "${vibe}"
    - "budget": "${budget}"
    - "location_type": "${locationType}"
    `;

    // אתחול רשמי של המוח של Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("[generate-date] Calling Gemini API natively...");
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // ניקוי שאריות עיצוב אם ה-AI מתחכם
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const ideas = JSON.parse(text);
    return NextResponse.json({ ideas });

  } catch (error: any) {
    console.error("[generate-date] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}