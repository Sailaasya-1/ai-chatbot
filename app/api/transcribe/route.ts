import { NextRequest, NextResponse } from "next/server";


// API route to handle audio transcription requests. It receives an audio blob and an API key,
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioBlob = formData.get("audio") as Blob;
  const apiKey = process.env.GROQ_API_KEY;

  if (!audioBlob || !apiKey) {
    return NextResponse.json({ error: "Missing audio or API key" }, { status: 400 });
  }

  // Groq Whisper expects a file
  const groqForm = new FormData();
  groqForm.append("file", audioBlob, "chunk.webm");
  groqForm.append("model", "whisper-large-v3");
  groqForm.append("response_format", "text");
  groqForm.append("language", "en");
  

  // Send the audio blob to the Groq Whisper API for transcription
  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: groqForm,
  });
  

  // Handle errors from the transcription API
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const text = await res.text();
  return NextResponse.json({ text });
}