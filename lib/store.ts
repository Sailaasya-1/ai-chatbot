
// Creating a store using zustand and importing necessary types
import { create } from "zustand";
import { Suggestion, SuggestionBatch, ChatMessage } from "./types";


// Strcuture of a transcript line
interface TranscriptLine {
  timestamp: string;
  text: string;
}

// Defining the structure of the application state and the functions to manipulate it
interface AppState {

  // Array to hold the transcript lines and append it
  transcriptLines: TranscriptLine[];
  appendTranscript: (text: string) => void;
  clearTranscript: () => void;

  // Array to hold batches of suggestions and a function to add new batches
  suggestionBatches: SuggestionBatch[];
  addSuggestionBatch: (suggestions: Suggestion[]) => void;


  // Array to hold chat messages and a function to add new messages
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  
  // Boolean to indicate if the app is currently recording
  isRecording: boolean;
  setIsRecording: (val: boolean) => void;
 
  // Boolean to indicate if the app is currently fetching suggestions
  isFetchingSuggestions: boolean;
  setIsFetchingSuggestions: (val: boolean) => void;
}


// Creating the global state store using zustand 
export const useStore = create<AppState>((set) => ({
  // Initial state for the transcript lines
  transcriptLines: [],
  appendTranscript: (text) => set((s) => {

    // Create a copy of the current transcript lines
    const lines = [...s.transcriptLines];

    // If no lines exist then create it with a new timestamp and the provided text
    if (lines.length === 0) {
      return {
        transcriptLines: [{
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          text,
        }],
      };
    }

    // If the last line's text is too long, create a new line with a new timestamp
    const last = lines[lines.length - 1];
    if (last.text.length > 300) {
      return {
        transcriptLines: [...lines, {
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          text,
        }],
      };
    }
    lines[lines.length - 1] = { ...last, text: last.text + " " + text };
    return { transcriptLines: lines };
  }),
  clearTranscript: () => set({ transcriptLines: [] }),

  // Initial state for suggestion batches and function to add new batches
  suggestionBatches: [],
  addSuggestionBatch: (suggestions) => set((s) => ({

    //Create with a unique id, timetsamp and the provided suggestions and add it to the beginning of the existing batches
    suggestionBatches: [
      { id: crypto.randomUUID(), timestamp: Date.now(), suggestions },
      ...s.suggestionBatches,
    ],
  })),
  // Initial state for chat messages and function to add new messages
  chatMessages: [],
  addChatMessage: (msg) => set((s) => ({
    chatMessages: [
      ...s.chatMessages,
      { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
    ],
  })),
  
  // Initial state for recording and fetching suggestions
  isRecording: false,
  setIsRecording: (val) => set({ isRecording: val }),
  
  // Initial state for fetching suggestions and function to update it
  isFetchingSuggestions: false,
  setIsFetchingSuggestions: (val) => set({ isFetchingSuggestions: val }),
}));