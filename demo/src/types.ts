export type AppStage =
  | "ENTRY" | "CLOSURE_CAPTURE" | "CLOSURE_EXTRACT" | "CLOSURE_INTERVIEW"
  | "CLOSURE_RECEIPT" | "BOTTLE_CLOSED" | "BOTTLE_OPENING" | "BOTTLE_CAPTURE"
  | "BOTTLE_SEAL" | "BOTTLE_LOCKED" | "WIND_DOWN" | "COMPLETE"
  | "MORNING" | "BOTTLE_FEEDBACK";
export type EntryMode = "closure" | "emotion";
export type OpenReason = "fear_of_forgetting" | "uncertain_obligation" | "waiting_for_external" | "unclear_next_step" | "emotional_residue" | "time_bound" | "other";
export type Resolution = "done" | "tomorrow" | "waiting" | "release" | "acknowledged";
export type LoopKind = "done" | "open" | "waiting" | "thought" | "unclear" | "time_bound";
export interface ClosureLoop {
  id: string; sourceText: string; summary: string; kind: LoopKind;
  reason?: OpenReason; resolution?: Resolution; nextAction?: string;
  reminderTime?: string; carryCount?: number; skipped?: boolean;
}
export interface ClosureMapState {
  done: ClosureLoop[]; tomorrow: ClosureLoop[]; waiting: ClosureLoop[]; release: ClosureLoop[];
}
export type MoodSignal = "neutral" | "frustrated" | "overwhelmed" | "sad" | "high_distress";
export interface BottleMemory {
  createdAt: string; unlockAt: string; moodSignal: MoodSignal; summary: string; topics: string[];
}

// V2 compatibility types: the previous demo modules remain available as a fallback.
export interface CompletedItem { id: string; summary: string; }
export type LegacyResolution = "archive" | "tomorrow" | "waiting" | "release" | "needs_choice";
export interface OpenLoop {
  id: string; originalText: string; normalizedText: string;
  type: "actionable" | "waiting" | "deferred" | "thought" | "unclear";
  resolution: LegacyResolution; nextAction?: string; confidence: number;
}
export interface DayClosureResult {
  completed: CompletedItem[]; tomorrow: OpenLoop[]; waiting: OpenLoop[];
  released: OpenLoop[]; needsChoice: OpenLoop[]; closureMessage: string;
}
export interface EmotionSummary { conciseSummary: string; topics: string[]; keyEvents: string[]; repeatedConcerns: string[]; }
export interface ClosureRecord { id: string; kind: "closure"; createdAt: string; timezone: string; reminderTime: string; scheduledFor: string; status: "scheduled" | "ready" | "consumed"; tomorrow: OpenLoop[]; waiting: OpenLoop[]; }
export interface EmotionRecord { id: string; kind: "emotion"; createdAt: string; revealAt?: string; retention: "reveal_tomorrow" | "release_tonight"; summary: EmotionSummary | null; status: "sealed" | "ready" | "released" | "consumed"; }
export type PersistedRecord = ClosureRecord | EmotionRecord;
export interface MorningHandoff { closure: ClosureRecord | null; emotion: EmotionRecord | null; }
export interface CaptureItem { id: string; text: string; createdAt: number; }
export interface AppSession {
  stage: AppStage; mode: EntryMode | null; closureText: string; emotionText: string; inputType: "text" | "voice";
  closure: DayClosureResult | null; choices: Record<string, "tonight" | "tomorrow" | "waiting">;
  reminderTime: string; windDownEndsAt: number | null; captures: CaptureItem[];
  emotionRetention: "reveal_tomorrow" | "release_tonight" | null; emotionSummary: EmotionSummary | null;
  demoMorning: boolean; dataNotice: string | null;
}
