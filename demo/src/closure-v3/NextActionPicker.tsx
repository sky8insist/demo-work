import { ArrowRight } from "lucide-react";
import { nextActionOptions } from "../mock/closureV3Engine";
import type { ClosureLoop } from "../types";
export function NextActionPicker({ loop, onChoose }: { loop: ClosureLoop; onChoose: (action: string) => void }) {
  return <div className="branch-panel"><p>把它缩小到一个可以开始的动作。</p><div className="branch-options">{nextActionOptions(loop).map((action) => <button key={action} onClick={() => onChoose(action)}><span>{action}</span><ArrowRight /></button>)}</div></div>;
}
