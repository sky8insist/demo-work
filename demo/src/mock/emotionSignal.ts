import type { BottleMemory, MoodSignal } from "../types";
const distressPattern = /自杀|不想活|结束生命|伤害自己|割腕|跳楼/;
export function detectMoodSignal(text: string): MoodSignal {
  if (distressPattern.test(text)) return "high_distress";
  if (/太多|压力|撑不住|好累|脑子.*乱|崩溃/.test(text)) return "overwhelmed";
  if (/烦|生气|气死|恼火|愤怒/.test(text)) return "frustrated";
  if (/难过|委屈|想哭|失落|伤心/.test(text)) return "sad";
  return "neutral";
}
export const supportMessages: Record<Exclude<MoodSignal, "high_distress">, string[]> = {
  neutral: ["想说的话已经留在这里了。", "今晚可以到这里。"],
  frustrated: ["听起来今天确实有些事情很让人烦。", "今晚先不用继续回应这些事情，离开让你继续生气的页面也可以。"],
  overwhelmed: ["今天好像一下子压了很多事情过来。", "今晚不用把它们全部整理清楚，醒来以后再决定下一件也来得及。"],
  sad: ["今晚的这些话已经留在这里了。", "如果愿意，可以先去做一件让自己觉得熟悉、安稳的小事，其他内容明天再看。"],
};
export const morningTakeaways: Record<MoodSignal, string> = {
  neutral: "今天不必一次想清所有事。先迈出眼前的一小步，你已经在向前了。",
  frustrated: "别让昨天的回应定义今天。把力气留给能改变的一小步，你会慢慢找回节奏。",
  overwhelmed: "今天不需要扛住全部。先完成一件最小的事，生活会重新出现缝隙。",
  sad: "允许自己慢一点。照顾好今天的自己，也是在认真走向更明亮的地方。",
  high_distress: "今天最重要的不是独自撑住，而是让一个可信任的人陪你一起面对。",
};
export const getMorningTakeaway = (moodSignal: MoodSignal) => morningTakeaways[moodSignal];
export function createBottleMemory(text: string, unlockAt: string): BottleMemory {
  const moodSignal = detectMoodSignal(text);
  const topics = [/项目|工作|进度/.test(text) && "项目推进", /沟通|同事|老师|回复/.test(text) && "沟通", /明天|任务|事情/.test(text) && "明日任务"].filter(Boolean) as string[];
  const summary = moodSignal === "overwhelmed" ? "事情集中到一起时，你表达了比较明显的压力。" : moodSignal === "frustrated" ? "有些没有得到回应的事情，让你感到疲惫和烦躁。" : moodSignal === "sad" ? "昨晚有一些失落，需要被安静地放下。" : "昨晚你为一天留下了一个安静的句点。";
  return { createdAt: new Date().toISOString(), unlockAt, moodSignal, topics: topics.length ? topics : ["昨晚想说的话"], summary };
}
export const isHighDistress = (text: string) => detectMoodSignal(text) === "high_distress";
