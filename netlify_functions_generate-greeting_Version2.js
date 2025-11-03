// Serverless function for Netlify to generate a greeting via OpenAI.
// Requires OPENAI_KEY set in Netlify environment variables (not exposed to client).

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const name = body.name || "friend";
    const prompt = `Write a short, playful 1-2 sentence love token addressed to "${name}". Keep it warm and silly, 25 words max.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.9
    });

    const text = response?.choices?.[0]?.message?.content ?? (response?.choices?.[0]?.text ?? "");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: (text || "").trim() })
    };
  } catch (err) {
    console.error("OpenAI function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenAI error" })
    };
  }
}