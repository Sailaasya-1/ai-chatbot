"use client";

import { useRef, useState, useCallback } from "react";

// We record audio in 30s chunks
const CHUNK_INTERVAL_MS = 30000;


// Custom hook to manage audio recording and transcription
export interface TranscriptLine {
  id: string;
  text: string;
  timestamp: Date;
}


// Manages microphone access, recording, and sending audio to the transcription API
export function useTranscriber() {
  const [isRecording, setIsRecording] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // The recorded audio chunks to the transcription API
  const flushChunks = useCallback(async () => {
    if (chunksRef.current.length === 0) return;
    
    // Combine chunks into a single blob
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    // Skip if the blob is too small (silence / no audio)
    if (blob.size < 1000) return;

    setIsTranscribing(true);

    // Send the audio blob to the transcription API
    try {
      const form = new FormData();
      form.append("audio", blob);
      
      

      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();

      if (data.text?.trim()) {
        setLines((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: data.text.trim(),
            timestamp: new Date(),
          },
        ]);
      }
    } catch (e) {
      setError("Transcription failed. Check your API key.");
      console.error(e);
    } finally {
      setIsTranscribing(false);
    }
  }, []);
   
  // Start recording audio from the microphone
  const startRecording = useCallback(async () => {
    setError(null);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      // Collect a chunk every second, flush every 30s
      recorder.start(1000);
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        // restart to get a clean blob
        recorder.stop();
        recorder.start(1000);
        flushChunks();
      }, CHUNK_INTERVAL_MS);

    } catch (e) {
      setError("Microphone access denied.");
      console.error(e);
    }
  }, [flushChunks]);


  // Stop recording and clean up resources
  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    setTimeout(flushChunks, 500);
  }, [flushChunks]);

  return { isRecording, lines, isTranscribing, error, startRecording, stopRecording };
}