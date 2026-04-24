"use client";

import type { ExportSession } from "./types";


// Custom hook to manage exporting chat sessions
export function useExport() {
  function exportSession(data: ExportSession) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-copilot-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { exportSession };
}