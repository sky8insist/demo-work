import { analyzeClosure as analyzeClosureFallback } from "../mockEngine";
import type { DayClosureResult } from "../types";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const USE_REMOTE_API = import.meta.env.VITE_USE_REMOTE_API === "true";

function isClosureResult(value: unknown): value is DayClosureResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<DayClosureResult>;
  return Array.isArray(result.completed) && Array.isArray(result.tomorrow) &&
    Array.isArray(result.waiting) && Array.isArray(result.released) &&
    Array.isArray(result.needsChoice) && typeof result.closureMessage === "string";
}

async function analyzeRemote(text: string): Promise<DayClosureResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(`${API_URL}/api/closure/analyze`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }), signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Closure API returned ${response.status}`);
    const result: unknown = await response.json();
    if (!isClosureResult(result)) throw new Error("Closure API returned an invalid payload");
    return result;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const closureApi = {
  async analyze(text: string): Promise<DayClosureResult> {
    if (!USE_REMOTE_API) return analyzeClosureFallback(text);
    try {
      return await analyzeRemote(text);
    } catch (error) {
      console.warn("Closure API unavailable; using the local fallback.", error);
      return analyzeClosureFallback(text);
    }
  },
};
