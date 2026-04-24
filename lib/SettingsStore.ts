

// Settings for the assitant
export interface Settings {
  suggestionPrompt: string;
  detailPrompt: string;
  chatPrompt: string;
  suggestionContextLines: number;
  detailContextLines: number;
}


// Default settings values
export const DEFAULT_SETTINGS = {

  suggestionContextLines: 20,
  detailContextLines: 50,

  suggestionPrompt: `You are an expert real-time meeting assistant. Analyze the transcript and generate exactly 3 highly relevant suggestions.

          CONTEXT: You are listening to a live conversation. Your job is to surface the most useful, immediately actionable suggestions.

          RULES:
          - Generate exactly 3 suggestions as a JSON object: {"suggestions": [...]}
          - Each suggestion must have: "type", "preview", "detail"
          - "type": one of "question_to_ask" | "talking_point" | "fact_check" | "answer"
          - "preview": max 15 words, standalone value, immediately useful
          - "detail": 3-5 sentences of deeper context, data, or recommended follow-up

          SUGGESTION SELECTION RULES:
          - If a claim was made → include a "fact_check"
          - If something was unclear → include a "clarification"  
          - If a question was asked → include an "answer"
          - If discussion is ongoing → include a "question_to_ask" or "talking_point"
          - Always pick the mix that's most useful RIGHT NOW

          Respond ONLY with valid JSON. No extra text.`,

          chatPrompt: `You are an expert meeting assistant with deep knowledge across business, technology, science, and current events.

          You have access to the full meeting transcript below. Your job is to give detailed, accurate, immediately useful answers.

          RULES:
          - Be specific and reference exact things said in the meeting
          - Add relevant facts, data, or context the speaker may not know
          - If fact-checking, cite what was said vs what is accurate
          - If answering a question, give a complete answer with supporting detail
          - Format clearly with structure when helpful
          - Be direct and concise — no filler phrases

          Transcript:
          {{transcript}}`,

            detailPrompt: `You are an expert meeting assistant. The user clicked on a suggestion during a live meeting.

            Full transcript:
            {{transcript}}

            Suggestion clicked:
            {{suggestion}}

            Give a detailed, well-structured response (5-8 sentences) the user can immediately act on. Be specific, cite facts from the transcript, and add relevant external context they may not have.`,
            } as Settings;

            

// Functions to load and save settings from localStorage
export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem("meeting-copilot-settings");
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}


// Save settings to localStorage
export function saveSettings(settings: Settings): void {
  localStorage.setItem("meeting-copilot-settings", JSON.stringify(settings));
}