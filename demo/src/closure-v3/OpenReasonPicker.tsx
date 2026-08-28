import { ArrowRight } from "lucide-react";
import { reasonOptions } from "../mock/closureV3Engine";
import type { OpenReason } from "../types";
export function OpenReasonPicker({ onChoose, onSkip }: { onChoose: (reason: OpenReason) => void; onSkip: () => void }) {
  return <div className="reason-picker">{reasonOptions.map((option) => <button key={option.value} onClick={() => onChoose(option.value)}><span><b>{option.label}</b><small>{option.hint}</small></span><ArrowRight /></button>)}<button className="skip-loop" onClick={onSkip}>暂时跳过</button></div>;
}
