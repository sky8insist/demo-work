import type { DayClosureResult, EmotionSummary, OpenLoop } from "./types";
const uid = () => crypto.randomUUID();
const clean = (text: string) => [
  ...new Set(
    text
      .split(/[\n。；]+/)
      .map((v) => v.trim())
      .filter(Boolean),
  ),
];
const loop = (
  text: string,
  type: OpenLoop["type"],
  resolution: OpenLoop["resolution"],
  confidence: number,
  nextAction?: string,
): OpenLoop => ({
  id: uid(),
  originalText: text,
  normalizedText: text.replace(/^(今天|明天|明早)/, "").trim(),
  type,
  resolution,
  confidence,
  nextAction,
});
function nextAction(text: string) {
  if (/登录|bug|问题/.test(text)) return "复现一次问题，并记下失败步骤";
  if (/周报|报告/.test(text)) return "打开最终版本，检查后提交";
  if (/邮件|回复/.test(text)) return "打开对话，确认是否需要回复";
  if (/简历/.test(text)) return "打开简历，先修改项目经历第一条";
  if (/买|采购/.test(text)) return "把物品加入明天的出门清单";
  return "打开相关内容，先完成最小的一步";
}
export function analyzeClosure(text: string): DayClosureResult {
  const result: DayClosureResult = {
    completed: [],
    tomorrow: [],
    waiting: [],
    released: [],
    needsChoice: [],
    closureMessage: "完成的已经归档，未完的已经有了去处。",
  };
  for (const line of clean(text)) {
    if (/写完|做完|完成|已经/.test(line) && !/没完成|没做完/.test(line))
      result.completed.push({
        id: uid(),
        summary: line.replace(/^(今天|已经)/, "").trim(),
      });
    else if (/在等|等待|等.*文案|对方处理/.test(line))
      result.waiting.push(loop(line, "waiting", "waiting", 0.91));
    else if (/感觉|担心|焦虑|效率|一直想着/.test(line))
      result.released.push(loop(line, "thought", "release", 0.92));
    else if (/还没回|要不要|不确定|可能/.test(line))
      result.needsChoice.push(loop(line, "unclear", "needs_choice", 0.43));
    else
      result.tomorrow.push(
        loop(
          line,
          "actionable",
          "tomorrow",
          /明天|明早|要交/.test(line) ? 0.93 : 0.72,
          nextAction(line),
        ),
      );
  }
  result.needsChoice = result.needsChoice.slice(0, 2);
  result.tomorrow = result.tomorrow.slice(0, 4);
  return result;
}
export function summarizeEmotion(text: string): EmotionSummary {
  const lines = clean(text);
  const topics = [
    /项目|工作|进度|任务/.test(text) && "项目与工作进度",
    /同学|同事|老师|沟通|回复/.test(text) && "沟通与关系",
    /明天|时间|来不及|任务/.test(text) && "明天的时间安排",
  ].filter(Boolean) as string[];
  return {
    conciseSummary: topics.length
      ? `昨晚的内容主要围绕${topics.slice(0, 2).join("和")}。`
      : "昨晚，你把一些难以放下的话留在了这里。",
    topics: topics.length ? topics : ["昨晚想表达的内容"],
    keyEvents: lines
      .filter((v) => /发生|收到|说了|没有|没回|完成/.test(v))
      .slice(0, 3),
    repeatedConcerns: lines.length > 2 ? [topics[0] || "同一件未结束的事"] : [],
  };
}
