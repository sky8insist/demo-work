import type { ClosureLoop, OpenReason, Resolution } from "../types";
const uid = () => crypto.randomUUID();
const normalize = (value: string) => value.replace(/^(今天|明天|明早|还在|这周)/, "").replace(/[。！!？?]+$/, "").trim();
export function analyzeInput(text: string): ClosureLoop[] {
  return [...new Set(text.split(/[\n。；]+/).map((v) => v.trim()).filter(Boolean))].map<ClosureLoop>((sourceText) => {
    const base = { id: uid(), sourceText, summary: normalize(sourceText) };
    if (/写完|做完|完成|已经.*(交|提交|处理)/.test(sourceText)) return { ...base, kind: "done", resolution: "done" };
    if (/等.*(给|回复|确认)|还在等/.test(sourceText)) return { ...base, kind: "waiting", carryCount: 1 };
    if (/明早|明天|九点|交周报/.test(sourceText)) return { ...base, kind: "time_bound" };
    if (/第三次|又一次|总是|一直拖|简历/.test(sourceText)) return { ...base, kind: "open", carryCount: 3 };
    if (/觉得|担心|效率|焦虑|一直想/.test(sourceText)) return { ...base, kind: "thought" };
    if (/不确定|要不要|还没回复|没有回复/.test(sourceText)) return { ...base, kind: "unclear" };
    return { ...base, kind: "open" };
  });
}
export function nextActionOptions(loop: ClosureLoop): string[] {
  const text = loop.sourceText;
  if (/登录|bug|问题/.test(text)) return ["先复现一次登录失败", "先查看最近一次错误记录", "先写下稳定复现的步骤"];
  if (/简历/.test(text)) return ["只改项目经历的第一条", "先打开简历并标出一处", "先把目标岗位贴到文档顶部"];
  if (/邮件|回复/.test(text)) return ["先确认这封邮件是否需要我回复", "写一句简短的跟进", "明早再看一次收件箱"];
  return ["打开相关内容，先做最小的一步", "写下完成它需要的第一个动作", "只花五分钟开始"];
}
export function resolveLoop(loop: ClosureLoop, reason: OpenReason, resolution: Resolution, extra?: Partial<ClosureLoop>): ClosureLoop { return { ...loop, reason, resolution, ...extra }; }
export const reasonOptions: { value: OpenReason; label: string; hint: string }[] = [
  { value: "fear_of_forgetting", label: "怕明天忘记", hint: "交给一个明确时间" },
  { value: "uncertain_obligation", label: "不知道要不要处理", hint: "先决定责任是否在你" },
  { value: "waiting_for_external", label: "需要等别人", hint: "把下一步留给对方" },
  { value: "unclear_next_step", label: "不知道下一步怎么做", hint: "把它缩小到能开始" },
  { value: "emotional_residue", label: "其实只是一直想到它", hint: "允许今晚不再回应" },
];
