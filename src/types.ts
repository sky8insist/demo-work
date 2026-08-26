export type AppStage =
  | "ENTRY"
  | "CLOSURE_CAPTURE"
  | "CLOSURE_PROCESSING"
  | "CLOSURE_REVIEW"
  | "CLOSURE_COMMIT"
  | "EMOTION_READY"
  | "EMOTION_CAPTURE"
  | "EMOTION_SEAL"
  | "WIND_DOWN"
  | "COMPLETE"
  | "TOMORROW_DESK"
  | "BOTTLE_REFLECTION";
export type EntryMode = "closure" | "emotion";
export type Resolution =
  | "archive"
  | "tomorrow"
  | "waiting"
  | "release"
  | "needs_choice";
export interface CompletedItem {
  id: string;
  summary: string;
}
export interface OpenLoop {
  id: string;
  originalText: string;
  normalizedText: string;
  type: "actionable" | "waiting" | "deferred" | "thought" | "unclear";
  resolution: Resolution;
  nextAction?: string;
  confidence: number;
}
export interface DayClosureResult {
  completed: CompletedItem[];
  tomorrow: OpenLoop[];
  waiting: OpenLoop[];
  released: OpenLoop[];
  needsChoice: OpenLoop[];
  closureMessage: string;
}
export interface EmotionSummary {
  conciseSummary: string;
  topics: string[];
  keyEvents: string[];
  repeatedConcerns: string[];
}
export interface CaptureItem {
  id: string;
  text: string;
  createdAt: number;
}
export interface AppSession {
  stage: AppStage;
  mode: EntryMode | null;
  closureText: string;
  emotionText: string;
  inputType: "text" | "voice";
  closure: DayClosureResult | null;
  choices: Record<string, "tonight" | "tomorrow" | "waiting">;
  reminderTime: string;
  windDownEndsAt: number | null;
  captures: CaptureItem[];
  emotionRetention: "reveal_tomorrow" | "release_tonight" | null;
  emotionSummary: EmotionSummary | null;
  demoMorning: boolean;
}
