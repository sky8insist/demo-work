import type { MoodSignal } from "../types";
import { supportMessages } from "../mock/emotionSignal";
export function EmotionEndMessage({ mood }: { mood: Exclude<MoodSignal, "high_distress"> }) { return <div className="emotion-end-message">{supportMessages[mood].map((line) => <p key={line}>{line}</p>)}</div>; }
