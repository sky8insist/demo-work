import { summarizeEmotion as fallback } from "../mockEngine";
import type { EmotionSummary } from "../types";
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const USE_REMOTE_API = import.meta.env.VITE_USE_REMOTE_API === "true";
export const emotionApi = { async process(transcript: string): Promise<EmotionSummary> { if (!USE_REMOTE_API) return fallback(transcript); try { const response = await fetch(`${API_URL}/api/emotion/process`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript }) }); if (!response.ok) throw new Error(String(response.status)); return await response.json() as EmotionSummary; } catch (error) { console.warn("Emotion API unavailable; using local fallback.", error); return fallback(transcript); } } };
