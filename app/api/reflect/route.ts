
import { NextResponse } from "next/server";

const fallback = {
  ME: "You feel dismissed and anxious. Your responsibility is to slow down before deciding what the silence means.",
  U: "They may be overwhelmed, distracted, or unsure how to respond. Their motive is unknown.",
  US: "A silence â†’ assumption â†’ escalation loop may be forming between you.",
  WITNESS: "Fact: no reply since yesterday. Inference: they do not care. Unknown: why they have not replied.",
  "WHAT NEXT": "Send one calm check-in, name your need without accusation, and leave room for an explanation.",
};

export async function POST(request: Request) {
  const { story } = await request.json() as { story?: string };
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  if (!key || !story) return NextResponse.json({ reflection: fallback, mode: "demo" });
  const prompt = `You are Me+U, a careful interpersonal reflection agent. Analyze the situation without diagnosing, assigning motives, or deciding who is right. Return only valid JSON with exactly these string keys: ME, U, US, WITNESS, WHAT NEXT. ME names feelings and personal responsibility. U offers multiple possible perspectives and labels uncertainty. US identifies the interaction pattern. WITNESS separates facts, inferences, and unknowns. WHAT NEXT gives one calm, boundary-respecting response. Situation: ${story}`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.35 } }),
    });
    if (!response.ok) throw new Error("Gemini request failed");
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json({ reflection: JSON.parse(text), mode: "gemini" });
  } catch {
    return NextResponse.json({ reflection: fallback, mode: "demo" });
  }
}

