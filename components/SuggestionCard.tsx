"use client";

import { Suggestion } from "@/lib/types";


// The TYPE_LABELS object maps suggestion types to their corresponding display labels
// It is used for the badges on the suggestion cards.
const TYPE_LABELS: Record<string, string> = {
  question_to_ask: "Question to ask",
  talking_point: "Talking point",
  fact_check: "Fact-check",
  answer: "Answer",
};


// The TYPE_STYLES object defines the background and text colors for each suggestion type.
//  It is used to style the badges on the suggestion cards.
const TYPE_STYLES: Record<string, { badge: string }> = {
  question_to_ask: { badge: "bg-sky-900/70 text-sky-400" },
  talking_point:   { badge: "bg-purple-900/70 text-purple-400" },
  fact_check:      { badge: "bg-yellow-900/70 text-yellow-400" },
  answer:          { badge: "bg-green-900/70 text-green-400" },
};


// SuggestionCard component, including the suggestion data and a callback for when the suggestion is selected.
interface Props {
  suggestion: Suggestion;
  onSelect: (suggestion: Suggestion) => void;
}

// The SuggestionCard component represents an individual suggestion with a type label and preview text.
export default function SuggestionCard({ suggestion, onSelect }: Props) {
  const type = suggestion.type ?? "question_to_ask";
  const label = TYPE_LABELS[type] ?? type;
  const styles = TYPE_STYLES[type] ?? TYPE_STYLES.question_to_ask;

  return (
    <div
      onClick={() => onSelect(suggestion)}
      className="cursor-pointer rounded-lg bg-slate-800/60 border border-slate-700 hover:border-slate-500 transition-colors p-3"
    >
      <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${styles.badge}`}>
        {label}
      </span>
      <p className="mt-2 text-sm font-bold text-slate-100 leading-snug">
        {suggestion.preview}
      </p>
    </div>
  );
}