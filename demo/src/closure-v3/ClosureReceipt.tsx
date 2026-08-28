import { ArrowRight, Check, Clock3, Feather, Sunrise } from "lucide-react";
import type { ClosureMapState } from "../types";
export function ClosureReceipt({ map, skipped, onEnd }: { map: ClosureMapState; skipped: number; onEnd: () => void }) {
  return <section className="receipt stage-in"><div className="receipt-mark"><Check /></div><h1>今天已经<br />有了去处。</h1><p className="receipt-lead">你不需要继续在脑子里替它们值班。</p><div className="receipt-ledger"><p><Check /><span>完成</span><b>{map.done.length}</b></p><p><Sunrise /><span>明天</span><b>{map.tomorrow.length}</b></p><p><Clock3 /><span>等待</span><b>{map.waiting.length}</b></p><p><Feather /><span>放下</span><b>{map.release.length}</b></p></div>{skipped > 0 && <p className="skipped-note">{skipped} 件暂时跳过，没有替你做决定。</p>}<div className="receipt-reminder"><span>明早交接</span><b>{map.tomorrow.find((v) => v.reminderTime)?.reminderTime || "08:00"}</b></div><button className="primary-action" onClick={onEnd}>结束今天 <ArrowRight /></button></section>;
}
