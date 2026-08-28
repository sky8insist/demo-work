import type { ClosureLoop } from "../types";
export function OpenLoopCard({ loop, index, total }: { loop: ClosureLoop; index: number; total: number }) {
  return <article className="open-loop-card">
    <div className="loop-counter"><span>{String(index + 1).padStart(2, "0")}</span><i />{String(total).padStart(2, "0")}</div>
    {loop.carryCount && loop.carryCount > 2 ? <p className="repeat-flag">它已经连续出现 {loop.carryCount} 次</p> : null}
    <h2>{loop.summary}</h2>
    <p>为什么这件事现在还挂在脑子里？</p>
  </article>;
}
