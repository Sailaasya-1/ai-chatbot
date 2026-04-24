"use client";

// Main page component that renders the 3-column layout and manages the overall state
import { useRef, useState } from "react";
import TranscriptPanel from "@/components/TranscriptPanel";
import SuggestionsPanel from "@/components/SuggestionsPanel";
import ChatPanel from "@/components/ChatPanel";
import SettingsButton from "@/components/SettingsButton";
import { useStore } from "@/lib/store";
import type { Suggestion } from "@/lib/types";
import ExportButton from "@/components/ExportButton";


// The home component 
export default function Home() {
  const transcriptRef = useRef<string>("");
  const [pendingSuggestion, setPendingSuggestion] = useState<Suggestion | null>(null);


  const isRecording = useStore((s) => s.isRecording);
  const suggestionBatches = useStore((s) => s.suggestionBatches);
  const transcriptLines = useStore((s) => s.transcriptLines); 
  const chatMessages = useStore((s) => s.chatMessages);     
  
  // Function to get the current transcript value from the ref
  function getTranscript() {
    return transcriptRef.current;
  }
  
  // Function to update the transcript value in the ref when it changes in the TranscriptPanel
  function onTranscriptUpdate(text: string) {
    transcriptRef.current = text;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-6 py-3 shrink-0">
        <h1 className="text-lg font-bold tracking-tight">
          TwinMind — Live Suggestions Web App
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            3-column layout · Transcript · Live Suggestions · Chat
          </span>
          <ExportButton
            transcript={transcriptLines}
            suggestionBatches={suggestionBatches}
            chatMessages={chatMessages}
          />
          <SettingsButton/>
        </div>
      </header>

      {}
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="flex flex-1 overflow-hidden border border-slate-700 rounded-xl">

          {}
          <div className="w-1/3 flex flex-col overflow-hidden border-r border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">1. Mic & Transcript</span>
              <span className="text-xs font-medium text-slate-400">
                {isRecording ? "RECORDING" : "IDLE"}
              </span>
            </div>
            <TranscriptPanel onTranscriptUpdate={onTranscriptUpdate} />
          </div>

          {}
          <div className="w-1/3 flex flex-col overflow-hidden border-r border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                2. Live Suggestions
              </span>
              <span className="text-xs font-medium text-slate-400">
                {suggestionBatches.length} {suggestionBatches.length === 1 ? "BATCH" : "BATCHES"}
              </span>
            </div>
            <SuggestionsPanel
              onSuggestionClick={(s) => setPendingSuggestion(s)}
            />
          </div>

          {}
          <div className="w-1/3 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 shrink-0 sticky top-0 bg-slate-950 z-10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                3. Chat (Detailed Answers)
              </span>
              <span className="text-xs font-medium text-slate-400">
                SESSION-ONLY
              </span>
            </div>
            <ChatPanel
              getTranscript={getTranscript}
              pendingSuggestion={pendingSuggestion}
              onSuggestionConsumed={() => setPendingSuggestion(null)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}