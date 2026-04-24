import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // ניקוי מוחלט של המפתח מכל זבל או רווחים
  const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();

  if (!apiKey) {
    return NextResponse.json({ error: "API Key is missing in Vercel settings" }, { status: 500 });
  }

  try {
    const { vibe, budget, locationType } = await req.json();

    // בניית ה-URL היציב ידנית - בלי v1beta!
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      You are a creative date-night planning assistant for a couple in Israel.
      Generate exactly 3 unique, fun date night ideas in Hebrew based on:
      Vibe: ${vibe}, Budget: ${budget}, Location: ${locationType}.
      Return ONLY a JSON array. Each object must have "title", "description", "vibe", "budget", "location_type".
    `;

    console.log("[generate-date] Sending manual fetch to V1 Stable endpoint...");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[generate-date] Google API returned ${response.status}:`, errorData);
      throw new Error(`Google API Error: ${response.status}`);
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ניקוי תגיות markdown של JSON אם יש
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const ideas = JSON.parse(text);
    return NextResponse.json({ ideas });

  } catch (error: any) {
    console.error("[generate-date] Final Catch Error:", error.message);
    return NextResponse.json({ error: "Failed to generate ideas. Please try again." }, { status: 500 });
  }
}