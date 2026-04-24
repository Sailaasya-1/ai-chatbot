import { NextRequest, NextResponse } from "next/server";


// API route to generate suggestions based on a transcript and a prompt.
export async function POST(req: NextRequest) {
  console.log("POST /api/suggestions called");
  
  const { transcript, prompt } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;

  if (!transcript || !apiKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  
  // Call the Groq API to get suggestions based on the transcript and prompt
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        max_tokens: 1000,
        messages: [
          { role: "system", content: prompt},
          { role: "user", content: `Transcript:\n${transcript}` }
        ],
        response_format: { type: "json_object" },
      }),
    });
    
    // Log the raw response for debugging
    console.log("Groq status:", res.status);
    const data = await res.json();
    console.log("Groq response:", JSON.stringify(data).slice(0, 200));
    
    // Parse the suggestions from the API response and return them to the frontend
    const parsed = JSON.parse(data.choices[0].message.content);
    const suggestions = Array.isArray(parsed) ? parsed : parsed.suggestions ?? [];
    return NextResponse.json({ suggestions: suggestions.slice(0, 3) });
  } catch (err) {
    console.error("Suggestions error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}