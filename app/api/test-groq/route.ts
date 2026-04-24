import { NextRequest, NextResponse } from "next/server";


// API route to test Groq API connectivity. It receives an API key and makes a simple request to verify access.
export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  

  // Make a simple request to the Groq API to verify the API key works
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: "Say OK" }],
      max_tokens: 5,
    }),
  });

  if (!res.ok) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}