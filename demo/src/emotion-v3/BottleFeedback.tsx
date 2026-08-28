import { ArrowLeft, ArrowRight } from "lucide-react";
import { getMorningTakeaway } from "../mock/emotionSignal";
import type { BottleMemory } from "../types";
export function BottleFeedback({ memory, onBack, onComplete }: { memory: BottleMemory; onBack: () => void; onComplete: () => void }) {
  return <section className="bottle-feedback stage-in"><button className="back-button" onClick={onBack}><ArrowLeft />返回</button><h1>昨晚留下的，<br/>现在可以看了。</h1><div className="feedback-lines"><article><span>昨晚你提到了</span><div>{memory.topics.map((topic) => <b key={topic}>{topic}</b>)}</div></article><article><span>昨晚最明显的状态</span><p>{memory.summary}</p></article><article className="takeaway"><span>今天可以带走一句</span><blockquote>{getMorningTakeaway(memory.moodSignal)}</blockquote></article></div><button className="primary-action" onClick={onComplete}>回到今天 <ArrowRight /></button></section>;
}
