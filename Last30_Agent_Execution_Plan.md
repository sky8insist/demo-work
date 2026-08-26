# Last30 — AI「结束今天」助手
## AI Application Engineer Mini Build Challenge — Agent Execution Plan

> **项目目标**
>
> 围绕「睡前最后 30 分钟」，完成一个真正可运行、可演示、可上传 GitHub 的 AI Mini Product。
>
> 本产品不做睡眠监测、不做健康分析、不做医学建议，也不做传统 AI Chatbot。
>
> 它解决的是：
>
> **用户已经知道该休息了，但注意力、未完成事项和心理状态仍然停留在“在线模式”。**
>
> 产品通过 AI 帮用户完成：
>
> **Brain Dump → Cognitive Compression → Closure → Wind Down → Leave Screen**
>
> 最终目标不是让用户继续使用产品，而是帮助用户自然地结束今天、减少继续刷手机的冲动，并最终离开屏幕。

---

# 0. Agent 总执行规则

在开始编码前，先完整阅读本文。

整个项目始终遵循：

```text
Product Insight > Feature Count
Complete Experience > Technical Complexity
AI Necessity > AI Quantity
Reliability > Fancy Architecture
Mobile Experience > Desktop Decoration
Subtraction > Addition
```

本项目是 Mini Build，不要为了展示技术而过度工程化。

## 禁止优先加入

- RAG
- GraphRAG
- Multi-Agent
- Agent Framework
- Redis
- Celery
- PostgreSQL
- Supabase
- Authentication
- OAuth
- IoT
- Wearable Integration
- Sleep Tracking
- Health Score
- Medical Advice
- 社区
- Gamification
- Dashboard
- Feed
- Chatbot 页面
- 复杂推荐系统
- Calendar Integration
- Todo Integration

除非核心 MVP 已经完整运行，并且新增功能能够明确改善：

> 「从还在线 → 准备休息」

否则不要实现。

---

# 1. Product Thesis

## 1.1 用户真正的问题

用户睡前继续刷手机，不一定是因为不知道该睡觉。

更常见的状态是：

```text
知道应该休息
+
脑子里还有没有结束的事情
+
担心忘记
+
还没有明确的“结束今天”节点
+
手机持续提供新的信息刺激
```

例如：

```text
明天上午要交报告
微信还有人没有回复
有一个 bug 还没解决
突然想到明天要找老师签字
今天感觉效率很差
```

这些内容形成：

# Open Loops

用户会产生一种心理：

```text
“我现在不处理，会不会忘？”
```

于是重新打开：

```text
微信
浏览器
Todo
邮件
短视频
社交媒体
游戏
```

然后重新进入数字世界。

---

# 1.2 产品核心定位

Last30 不解决：

```text
什么时候睡？
```

Last30 解决：

```text
怎么结束今天？
```

产品定义：

> **Last30 是一个 AI Day Closure Companion。**
>
> 用户把睡前仍挂在脑子里的事情交给 AI，AI 将杂乱的信息压缩成少量明日事项，并帮助用户确认哪些事情今晚已经可以停止处理。之后产品本身也逐渐减少信息、色彩与交互，最终退出用户注意力。

---

# 1.3 一句话 Product Pitch

中文：

> **Last30 不负责让你睡着，它负责帮你结束今天。**

英文：

> **Last30 doesn't help you sleep. It helps you finish being awake.**

---

# 2. 为什么 AI 在这里是必要的

如果产品只是：

```text
输入 Todo
→
30 分钟倒计时
```

AI 没有存在必要。

因此 AI 必须承担普通 Timer / Todo App 难以自然完成的任务：

# Cognitive Compression

用户输入可能是：

```text
杂乱
重复
情绪化
没有结构
任务和想法混在一起
```

AI 输出应该变成：

```text
明天真正需要保留的 1～3 件事
+
今晚可以暂停的内容
+
AI 无法判断、需要用户确认的事项
+
一句简短 Closure
```

核心链路：

```text
Unstructured Thoughts
        ↓
Semantic Understanding
        ↓
Decision Compression
        ↓
Closure
```

AI 的价值不是：

```text
生成更多内容
```

而是：

# 减少信息、减少决策、减少继续处理事情的理由。

---

# 3. 最终 MVP 用户链路

必须优先完成以下完整闭环：

```text
WELCOME
   ↓
BRAIN DUMP
   ↓
AI CLOSURE ENGINE
   ↓
CLOSURE REVIEW
   ↓
USER CHOICE
   ↓
CLOSURE RITUAL
   ↓
WIND DOWN
   ↓
QUICK CAPTURE
   ↓
COMPLETE
```

详细链路：

```text
用户打开 Last30
        ↓
“现在，还有什么没放下？”
        ↓
用户自由输入脑中的事情
        ↓
AI 进行理解、提取、分类、压缩
        ↓
输出：
① 留给明天
② 今晚可以暂停
③ 需要用户决定
        ↓
用户快速确认
        ↓
进入 Closure Ritual
        ↓
点击：
「结束今天」
        ↓
进入 30 分钟 Wind Down
        ↓
界面逐渐减少信息与刺激
        ↓
中途想到事情：
「＋ 记一下」
        ↓
快速保存到 Tomorrow
        ↓
立即返回 Wind Down
        ↓
00:00
        ↓
「今天结束了。」
```

---

# 4. MVP 三个核心创新

整个项目必须围绕以下三个 Feature 实现。

---

## 4.1 AI Closure Engine

不是 Chatbot。

不是 Todo Generator。

而是：

```text
Brain Dump
   ↓
Item Extraction
   ↓
Task / Thought Detection
   ↓
Urgency / Uncertainty Reasoning
   ↓
Cognitive Compression
   ↓
Closure Result
```

核心目标：

> 将用户的复杂脑内状态压缩成一个简单可执行决定：今天到这里。

---

## 4.2 Closure Ritual

这是区别普通 Todo App 的核心。

AI 整理完成以后，不允许直接：

```text
Next
→
Timer
```

必须存在一个明确的心理切换动作：

```text
重要的事情已经留下
其他事情今晚先不继续处理

        今天就到这里。

        [结束今天]
```

用户主动点击：

# 结束今天

代表：

```text
Online
↓
Closure
↓
Wind Down
```

这个动作本身就是产品体验的一部分。

---

## 4.3 Interface Falls Asleep

产品本身应该随着时间：

```text
信息越来越少
色彩越来越低
按钮越来越少
文字越来越短
动画越来越弱
```

最后：

```text
屏幕几乎只剩：
时间
+
一句话
```

这是整个项目最重要的 Signature Interaction。

核心概念：

> **用户在准备退出数字世界，界面本身也应该一起退出。**

---

# 5. AI 输出设计原则

AI 不允许替用户武断决定未知紧急事项。

例如用户输入：

```text
微信还有一个重要的人没回复
```

AI 不应该直接输出：

```text
今晚不用回复
```

因为 AI 不知道：

- 对方是谁
- 是否是工作事项
- 是否有时间要求
- 是否涉及重要约定

所以必须设计：

```text
needsChoice
```

由用户自己做最终决定。

---

# 6. ClosureResult Schema

Frontend TypeScript：

```ts
export interface ClosureItem {
  id: string;
  text: string;
  reason?: string;
}

export interface ClosureResult {
  carryForward: ClosureItem[];
  canPause: ClosureItem[];
  needsChoice: ClosureItem[];
  closureMessage: string;
}
```

---

## carryForward

含义：

> 明确适合明天继续处理。

例如：

```text
明天上午交实习周报
明天买咖啡
明天找导师签字
```

约束：

```text
max = 3
```

---

## canPause

含义：

> 今晚没有必要继续展开。

例如：

```text
今天感觉效率不高
还想再刷一道算法题
一直想着今天做得不够好
```

注意：

AI 不能进行：

```text
心理诊断
医疗判断
睡眠诊断
```

这里只允许：

```text
行为层面的暂时暂停
```

---

## needsChoice

当 AI 缺乏上下文时必须进入：

```text
needsChoice
```

例如：

```text
还有一个重要微信没回复
```

前端：

```text
这个今晚需要处理吗？

[今晚处理]   [明天再处理]
```

必须由用户决定。

---

# 7. AI System Prompt

创建：

```text
backend/app/prompts/closure.md
```

内容：

```text
You are the Closure Engine of Last30.

Your objective is NOT to help the user complete more work.

Your objective is to help the user safely stop thinking about unfinished
tasks for tonight and transition out of active digital mode.

The user may provide a messy brain dump containing:

- tasks
- reminders
- worries
- thoughts
- messages
- tomorrow plans
- unfinished work

Your job:

1. Extract meaningful items.
2. Separate concrete tasks from general thoughts.
3. Identify items that can reasonably be carried into tomorrow.
4. Identify non-actionable thoughts that can pause for tonight.
5. If urgency cannot be determined, NEVER guess.
6. Put uncertain items into needs_choice.
7. Keep carry_forward to a maximum of 3 items.
8. Never create tasks that the user did not mention.
9. Never encourage the user to continue working tonight.
10. Never provide medical, psychological or sleep treatment advice.
11. Keep every output concise.
12. The final experience should reduce cognitive load.

closure_message requirements:

- <= 40 Chinese characters
- calm
- non-judgmental
- no motivational speech
- no therapy language
- no medical advice
- do not use “你应该”
- do not encourage additional activity

Return structured JSON only.
```

---

# 8. Backend Schema

使用 Pydantic。

```python
class ClosureItem(BaseModel):
    id: str
    text: str
    reason: str | None = None


class ClosureResult(BaseModel):
    carry_forward: list[ClosureItem]
    can_pause: list[ClosureItem]
    needs_choice: list[ClosureItem]
    closure_message: str
```

额外 Validation：

```text
carry_forward <= 3
closure_message <= 40 Chinese characters
empty text prohibited
duplicate item should be removed
total item count should be limited
```

---

# 9. AI Reliability Pipeline

禁止：

```text
LLM
↓
JSON.parse()
↓
Frontend
```

必须：

```text
User Input
     ↓
Input Validation
     ↓
LLM
     ↓
Structured Output
     ↓
Pydantic Validation
     ↓
Business Rule Validation
     ↓
Deduplication
     ↓
ClosureResult
```

异常：

```text
LLM invalid
     ↓
Retry once
     ↓
still invalid
     ↓
Fallback
```

---

# 10. Timeout 与错误处理

LLM Timeout：

```text
8 seconds
```

必须覆盖：

```text
network error
timeout
invalid JSON
rate limit
API key missing
unexpected model response
```

Frontend 不应该直接看到：

```text
500
JSON.parse error
stack trace
```

必须转换为正常产品体验。

---

# 11. Fallback Strategy

Demo 不能因为模型崩掉。

Fallback 示例：

```json
{
  "carry_forward": [
    {
      "id": "fallback-1",
      "text": "把刚才写下的重要事情留到明天"
    }
  ],
  "can_pause": [],
  "needs_choice": [],
  "closure_message": "已经记下来了。今晚可以到这里。"
}
```

进一步可做一个简单规则解析器。

检测：

```text
明天
后天
上午
下午
记得
提醒
要交
要买
```

明显含这些词的句子：

```text
carryForward
```

其他内容：

```text
canPause
```

Fallback 的目的不是高级智能。

而是：

# Demo 永远有结果。

---

# 12. Demo Mode

必须支持：

```env
DEMO_MODE=true
```

Demo Mode：

```text
无需 API Key
```

即可完整运行。

建议策略：

```text
Real LLM
   ↓ failure
Mock Closure Engine
   ↓
Frontend
```

同时前端提供：

```text
试试示例
```

一键填充 Demo 数据。

---

# 13. 技术栈

## Frontend

```text
React 19
TypeScript
Vite
GSAP
@gsap/react
Lucide React
CSS Variables
CSS Modules / global styles
```

## Backend

```text
Python 3.11+
FastAPI
Pydantic
httpx / LLM SDK
OpenAI-compatible LLM API
```

## Storage

```text
localStorage
```

MVP 不使用数据库。

## Test

```text
Vitest
React Testing Library
Pytest
```

## Deployment

推荐：

```text
Frontend
Vercel

Backend
Render / Railway
```

核心要求：

> Deployment 必须稳定，不能因为追求复杂部署影响 Demo。

---

# 14. 为什么选择 React + Vite

本项目没有：

```text
SEO
复杂路由
SSR
Server Components
大型 BFF
```

因此 Next.js 没有明显必要。

React + Vite：

```text
启动快
结构简单
Demo 风险低
适合状态驱动体验
适合 GSAP
```

---

# 15. 为什么需要 FastAPI

API Key 不能暴露前端。

同时 FastAPI 负责：

```text
Prompt Management
Structured Output
Schema Validation
Retry
Timeout
Fallback
Logging
```

这部分用于体现：

# AI Application Engineering

而不是：

```text
前端直接 fetch LLM API
```

---

# 16. 为什么 MVP 不使用数据库

项目只需要保存一次短 Session。

需要的数据：

```text
Brain Dump
AI Result
User Choice
Quick Captures
Timer
Completed State
```

localStorage 足够支持：

```text
refresh restore
timer restore
quick capture
session persistence
```

加入数据库会增加：

```text
Auth
Schema
Network Failure
Deployment Complexity
```

没有明显 MVP 收益。

---

# 17. 前端核心状态机

禁止大量 Boolean：

```ts
isStarted
isDone
isLoading
isTimer
isReview
```

使用状态机：

```ts
type AppStage =
  | "WELCOME"
  | "BRAIN_DUMP"
  | "PROCESSING"
  | "REVIEW"
  | "RITUAL"
  | "WIND_DOWN"
  | "COMPLETE";
```

状态流：

```text
WELCOME
   ↓
BRAIN_DUMP
   ↓
PROCESSING
   ↓
REVIEW
   ↓
RITUAL
   ↓
WIND_DOWN
   ↓
COMPLETE
```

---

# 18. SessionState

```ts
interface SessionState {
  stage: AppStage;

  brainDump: string;

  closure: ClosureResult | null;

  userChoices: {
    [itemId: string]: "tonight" | "tomorrow";
  };

  captures: {
    id: string;
    text: string;
    createdAt: number;
  }[];

  timer: {
    startedAt: number | null;
    endsAt: number | null;
  };

  completedAt: number | null;
}
```

localStorage Key：

```text
last30_session_v1
```

---

# 19. 页面结构

不需要复杂 Router。

使用 Single Page Experience：

```tsx
<App>
  <AmbientLayer />

  <StageShell>
    {stage === "WELCOME" && <WelcomeStage />}
    {stage === "BRAIN_DUMP" && <BrainDumpStage />}
    {stage === "PROCESSING" && <ProcessingStage />}
    {stage === "REVIEW" && <ReviewStage />}
    {stage === "RITUAL" && <ClosureRitual />}
    {stage === "WIND_DOWN" && <WindDownStage />}
    {stage === "COMPLETE" && <CompleteStage />}
  </StageShell>
</App>
```

---

# 20. Welcome Stage

目标：

用户 3 秒内理解：

```text
这不是睡眠监测
这是帮我结束今天
```

建议：

```text
LAST30


今天就到这里。


把脑子里还没放下的事情
先交给明天。


        开始收尾 →

       大约 1 分钟
```

不要出现：

```text
AI 睡眠管家
睡眠质量
睡眠评分
健康报告
```

---

# 21. Brain Dump Stage

标题：

```text
现在，还有什么没放下？
```

辅助文案：

```text
工作、消息、明天的事情，想到什么就写什么。
不用整理。
```

Textarea 示例：

```text
明天上午要交实习周报
微信还有一个人没有回复
今天感觉效率不高……
```

CTA：

```text
帮我收尾 →
```

辅助：

```text
⌘ / Ctrl + Enter
```

## Brain Dump TODO

- [ ] textarea
- [ ] auto resize
- [ ] max 800 chars
- [ ] Ctrl/Cmd + Enter
- [ ] submit lock
- [ ] local persistence
- [ ] example data
- [ ] empty state
- [ ] mobile keyboard safe layout
- [ ] no page jump
- [ ] no unnecessary modal

---

# 22. Empty Input

如果用户什么都没写，不要报错：

```text
请输入内容
```

应该：

```text
脑子已经空了吗？

那就直接结束今天。

[直接开始收尾]
```

这是符合产品理念的重要边界状态。

---

# 23. Processing Stage

不要：

```text
AI Thinking...
正在调用模型...
正在进行心理分析...
```

推荐：

```text
正在把今天放回今天。
```

三个轻量状态：

```text
整理还没放下的事情
↓
留下真正需要明天记住的
↓
其余的先停在今晚
```

最小展示：

```text
800ms
```

如果 API 在 100ms 返回，也不要瞬间跳页面。

如果 API 超过：

```text
8s
```

进入 fallback。

---

# 24. Review Stage

这是整个产品最重要页面之一。

标题：

```text
今晚，不需要把所有事情做完。
```

## Section 1

```text
留给明天
```

展示：

```text
01  提交实习周报
02  找导师签字
```

最多：

```text
3
```

## Section 2

```text
今晚可以暂停
```

例如：

```text
✓ 再刷一道算法题
✓ 对今天效率的担心
```

视觉权重弱于 carryForward。

## Section 3

只有存在 needsChoice 才显示：

```text
有一件事需要你决定
```

内容：

```text
微信还有一个重要的人没有回复

[今晚处理]   [明天再处理]
```

AI 不允许替用户猜。

---

# 25. Review 用户控制

允许用户：

```text
删除 AI 明显识别错误的 item
```

但不要增加：

```text
drag & drop
priority
日期选择
复杂编辑器
分类标签
```

MVP 只需要：

```text
Remove
```

---

# 26. Closure Ritual

页面：

```text
        重要的事情已经留下。


      ✓ 明天的事情已经记住
      ✓ 其他事情今晚先不处理


        今天就到这里。


          [结束今天]
```

这个页面必须保持非常克制。

唯一 Primary CTA：

# 结束今天

禁止：

```text
Next
Continue
Start Timer
开始下一步
```

---

# 27. Closure Ritual Animation

用户点击「结束今天」以后：

```text
CTA 缓慢 fade
↓
完成事项向上淡出
↓
背景开始变暗
↓
Timer 出现
```

Animation：

```text
600–900ms
```

禁止：

```text
bounce
elastic
confetti
spring-heavy
粒子效果
```

---

# 28. Wind Down Stage

主界面：

```text
             24:18


          今天正在结束


     下一步：
     把手机放到充电的位置


            ＋ 记一下
```

必须保持：

```text
一个主要视觉中心
极少交互
无内容推荐
```

---

# 29. Wind Down 三阶段

## Phase 1 — 收尾

```text
30 → 20 min
```

目标：

```text
结束数字世界里的最后事务
```

提示：

```text
不再打开新的内容。
```

或：

```text
剩下的消息可以留给明天。
```

## Phase 2 — 离线

```text
20 → 10 min
```

提示：

```text
可以去洗漱、喝水或整理床边。
```

只允许普通生活提示。

禁止：

```text
医学建议
呼吸训练疗法
睡眠治疗
心理干预
```

## Phase 3 — 安静

```text
10 → 0 min
```

页面进一步减少内容：

```text
08:47


今天已经结束。
```

最后 5 分钟：

```text
隐藏 phase title
隐藏 progress label
隐藏辅助文字
隐藏不必要按钮
```

只保留极低权重 Quick Capture。

---

# 30. Signature Interaction — Interface Falls Asleep

全局 CSS Variables：

```css
:root {
  --ambient-brightness: 1;
  --ambient-saturation: 1;
  --ambient-contrast: 1;
  --ui-opacity-secondary: 1;
}
```

Timer Progress：

```text
0 -------------------------- 1
active                       quiet
```

随着 progress 增加：

```text
brightness ↓
saturation ↓
secondary opacity ↓
information density ↓
motion intensity ↓
```

核心目标：

> 产品自己也在逐渐睡着。

---

# 31. GSAP 使用

安装：

```bash
npm install gsap @gsap/react
```

React 中：

```tsx
useGSAP(() => {
  // animation
}, { scope: container });
```

禁止到处散落：

```text
useEffect + gsap
```

需要正确处理：

```text
cleanup
stage remount
responsive
reduced motion
```

---

# 32. Motion Language

允许：

```text
opacity
translateY
small blur
very subtle scale
background interpolation
```

避免：

```text
rotation
elastic
bounce
particles
3D
WebGL
neon
parallax
```

---

# 33. Motion Specification

Stage Exit：

```text
opacity: 1 → 0
y: 0 → -10
duration: 0.35s
```

Stage Enter：

```text
opacity: 0 → 1
y: 14 → 0
duration: 0.5s
ease: power2.out
```

List Reveal：

```text
stagger: 0.06–0.10s
```

整体：

```text
slow
deliberate
quiet
```

---

# 34. Quick Capture

Wind Down 中用户突然想到：

```text
明天记得找导师签字
```

不能重新打开 AI Chat。

入口：

```text
＋ 记一下
```

Bottom Sheet：

```text
突然想到什么？


[ 明天找导师签字       ]


        放到明天
```

提交后：

```text
✓ 已经替你留到明天
```

800～1500ms 自动关闭。

回到 Timer。

---

# 35. Quick Capture 核心要求

完整流程：

```text
想到事情
↓
点击记一下
↓
输入
↓
保存
↓
回 Timer
```

必须：

```text
< 5 seconds
```

Quick Capture：

```text
不调用 LLM
```

直接：

```text
localStorage
```

原因：

```text
更快
更稳定
更符合降低刺激的目标
```

---

# 36. Timer 实现

禁止：

```ts
setInterval(() => seconds--)
```

使用绝对时间：

```ts
const endsAt = Date.now() + duration;

const remaining = Math.max(
  0,
  endsAt - Date.now()
);
```

更新频率：

```text
250–500ms
```

刷新页面：

```text
Timer 不重新开始
```

切换标签页：

```text
返回后时间必须正确
```

---

# 37. Demo Timer

真实模式：

```env
VITE_WIND_DOWN_SECONDS=1800
```

Demo Mode：

```env
VITE_WIND_DOWN_SECONDS=90
```

README 明确：

```text
Demo mode compresses the 30-minute experience into 90 seconds.
```

必须保证：

```text
90 秒中能够看见三个阶段
+
UI progressive quieting
+
Complete
```

---

# 38. Complete Stage

页面：

```text


             ✓


        今天结束了。


   明天有 2 件事情已经替你留好。


      不需要再做什么了。

```

禁止：

```text
推荐文章
睡眠知识
分享
连续签到
奖励
积分
继续聊天
查看更多
Explore More
```

因为最终成功行为是：

# 用户关闭页面。

---

# 39. Visual Direction

整体视觉关键词：

```text
Quiet
Editorial
Warm
Minimal
Human
Night
Intentional
```

不是：

```text
SaaS Dashboard
AI Tool
Health Dashboard
Meditation App
Cyberpunk
```

---

# 40. 禁止 AI Slop

不要：

```text
紫蓝大渐变
大面积 glassmorphism
cards inside cards
每个标题一个圆角 icon
sparkle icon everywhere
robot icon
巨大渐变球
十几个 pill
所有区域都加 border
所有组件都 20px radius
大量灰色辅助文字
```

UI 必须具有：

```text
明确视觉层级
克制
留白
少卡片
少边框
```

---

# 41. Typography

中文：

```text
system-ui
Noto Sans SC
```

英文：

```text
Geist
Manrope
system-ui
```

只允许：

```text
1 主字体
+
必要时 1 display font
```

## Font Scale

```text
Hero        44–56
H1          32–40
H2          24–28
Body        16–18
Small       13–14
Timer       clamp(72px, 18vw, 150px)
```

---

# 42. Layout

核心：

```css
width: min(100% - 40px, 720px);
margin-inline: auto;
```

Mobile First。

优先测试：

```text
375 × 812
390 × 844
430 × 932
```

然后：

```text
768 × 1024
1440 × 900
```

Desktop 仍保持：

```text
single focused column
```

禁止改造成双栏 Dashboard。

---

# 43. Accessibility

必须实现：

- [ ] semantic HTML
- [ ] keyboard navigation
- [ ] visible focus
- [ ] aria-label
- [ ] button 使用 `<button>`
- [ ] form 使用 `<form>`
- [ ] sufficient contrast
- [ ] screen reader labels
- [ ] prefers-reduced-motion

检测：

```css
@media (prefers-reduced-motion: reduce)
```

Reduced Motion：

```text
关闭长动画
只保留简单 fade
```

---

# 44. Impeccable / Frontend Design Skill 使用

如果 Agent 环境支持 Impeccable：

先建立：

```text
PRODUCT.md
DESIGN.md
```

开发过程中按：

```text
craft
↓
critique
↓
quieter
↓
animate
↓
audit
↓
polish
↓
harden
```

重点检查：

```text
visual hierarchy
typography
spacing
contrast
responsive
motion
interaction
UX copy
edge cases
AI design anti-patterns
```

每阶段：

```text
1–2 次 targeted pass
```

不要无限循环 polish。

---

# 45. PRODUCT.md

创建：

```text
PRODUCT.md
```

内容至少：

```markdown
# Product

Last30

## Audience

18–30 岁睡前仍频繁使用手机的年轻用户。

## Problem

用户知道应该休息，但注意力仍然停留在未完成事项和数字信息中。

## Promise

把仍挂在脑中的事情安全地留给明天，并帮助用户完成今天的结束。

## Primary Action

结束今天。

## Success

用户完成 Closure 后减少交互并最终离开屏幕。

## Anti Goals

- 不做睡眠治疗
- 不做健康分析
- 不做任务管理器
- 不做 Chatbot
- 不做内容平台
```

---

# 46. DESIGN.md

创建：

```text
DESIGN.md
```

内容：

```markdown
# Design Principle

The interface becomes quieter over time.

# Visual Direction

Quiet Editorial Minimalism

# Signature Interaction

Interface Falls Asleep

# Motion

Subtractive motion only.

# Interaction Rule

One primary action per stage.

# Anti References

- SaaS dashboard
- purple AI gradient
- meditation app cliché
- glass card stack
```

---

# 47. 推荐目录结构

```text
last30/
│
├── frontend/
│   ├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   └── appState.ts
│   │
│   ├── stages/
│   │   ├── WelcomeStage.tsx
│   │   ├── BrainDumpStage.tsx
│   │   ├── ProcessingStage.tsx
│   │   ├── ReviewStage.tsx
│   │   ├── ClosureRitual.tsx
│   │   ├── WindDownStage.tsx
│   │   └── CompleteStage.tsx
│   │
│   ├── components/
│   │   ├── AmbientLayer.tsx
│   │   ├── StageTransition.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── CaptureSheet.tsx
│   │   ├── ClosureItem.tsx
│   │   └── TimerDisplay.tsx
│   │
│   ├── hooks/
│   │   ├── useWindDownTimer.ts
│   │   ├── useSession.ts
│   │   └── useReducedMotion.ts
│   │
│   ├── services/
│   │   └── closureApi.ts
│   │
│   ├── types/
│   │   └── closure.ts
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   └── main.tsx
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── closure.py
│   │   ├── schemas/
│   │   │   └── closure.py
│   │   ├── services/
│   │   │   ├── closure_engine.py
│   │   │   ├── llm.py
│   │   │   └── fallback.py
│   │   ├── prompts/
│   │   │   └── closure.md
│   │   └── config.py
│   │
│   └── tests/
│       └── test_closure.py
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEMO_SCRIPT.md
│   ├── AI_EVAL.md
│   └── PRODUCT_DECISIONS.md
│
├── PRODUCT.md
├── DESIGN.md
├── README.md
├── .env.example
├── .gitignore
└── LICENSE
```

---

# 48. Backend API

MVP 只需要一个真正 AI API：

```http
POST /api/closure
```

Request：

```json
{
  "brain_dump": "明天上午要交实习周报..."
}
```

Response：

```json
{
  "carry_forward": [],
  "can_pause": [],
  "needs_choice": [],
  "closure_message": ""
}
```

额外：

```http
GET /health
```

Response：

```json
{
  "status": "ok"
}
```

---

# 49. 不实现 `/capture` AI API

Quick Capture：

```text
localStorage
```

原因：

```text
更快
更稳定
减少模型调用
避免重新把用户拉回 AI
```

---

# 50. M0 — Project Bootstrap

## TODO

- [ ] 创建 Git Repository
- [ ] 初始化 React + Vite + TypeScript
- [ ] TypeScript strict=true
- [ ] 配置 ESLint
- [ ] 配置 Prettier
- [ ] 安装 GSAP
- [ ] 安装 @gsap/react
- [ ] 安装 Lucide React
- [ ] 初始化 FastAPI
- [ ] 配置 CORS
- [ ] 添加 GET /health
- [ ] 创建 .env.example
- [ ] 创建 .gitignore
- [ ] 创建 PRODUCT.md
- [ ] 创建 DESIGN.md
- [ ] README skeleton
- [ ] 禁止提交 secrets

## Acceptance Criteria

```text
frontend 可运行
backend 可运行
GET /health 返回 200
frontend 可以访问 backend
console 无错误
```

---

# 51. M1 — Design Foundation

## TODO

- [ ] color tokens
- [ ] typography tokens
- [ ] spacing tokens
- [ ] radius tokens
- [ ] motion tokens
- [ ] layout container
- [ ] PrimaryButton
- [ ] TextButton
- [ ] Textarea
- [ ] BottomSheet
- [ ] focus state
- [ ] reduced motion
- [ ] mobile safe area

## Acceptance Criteria

```text
所有页面使用统一设计 Token
禁止组件自行创造完全不同的设计语言
```

---

# 52. M2 — Welcome

## TODO

- [ ] wordmark
- [ ] headline
- [ ] supporting copy
- [ ] primary CTA
- [ ] small time hint
- [ ] entrance animation
- [ ] keyboard support
- [ ] responsive

## Acceptance Criteria

首次访问：

```text
3 秒内能理解产品核心价值
```

点击 CTA：

```text
WELCOME → BRAIN_DUMP
```

---

# 53. M3 — Brain Dump

## TODO

- [ ] textarea
- [ ] autosize
- [ ] max 800 chars
- [ ] Ctrl / Cmd Enter
- [ ] submit lock
- [ ] draft persistence
- [ ] example data
- [ ] empty state
- [ ] mobile keyboard safe layout
- [ ] loading transition

## Acceptance Criteria

```text
用户无需选择分类
无需填写表单
无需设置时间
直接输入即可
```

---

# 54. M4 — Mock Closure Flow

在接真实 LLM 之前先完成完整 Mock Flow。

创建：

```text
frontend/src/mocks/mockClosure.ts
```

Mock：

```ts
export const mockClosure = {
  carryForward: [
    {
      id: "1",
      text: "提交实习周报"
    },
    {
      id: "2",
      text: "明天买咖啡"
    }
  ],
  canPause: [
    {
      id: "3",
      text: "今晚继续刷算法题"
    },
    {
      id: "4",
      text: "对今天效率的担心"
    }
  ],
  needsChoice: [
    {
      id: "5",
      text: "微信还有一个人没有回复"
    }
  ],
  closureMessage: "重要的事情已经留下。今天可以到这里了。"
};
```

## Acceptance Criteria

即使没有 Backend：

```text
整个产品 Flow 已经可以完整走通
```

---

# 55. M5 — AI Closure Engine

## TODO

- [ ] Request Schema
- [ ] Response Schema
- [ ] System Prompt
- [ ] LLM Adapter
- [ ] Structured Output
- [ ] Pydantic Validation
- [ ] business rules
- [ ] max 3 carryForward
- [ ] duplicate removal
- [ ] retry once
- [ ] timeout 8s
- [ ] fallback
- [ ] mock mode
- [ ] error logging

## Acceptance Criteria

任何模型异常：

```text
Demo 不崩
Frontend 一定拿到合法 ClosureResult
```

---

# 56. M6 — Processing

## TODO

- [ ] processing state
- [ ] 3-stage copy
- [ ] minimum duration
- [ ] API request
- [ ] fallback handling
- [ ] GSAP cleanup
- [ ] transition to review

## Acceptance Criteria

```text
无 Spinner
无 AI Thinking
无技术术语
```

---

# 57. M7 — Review

## TODO

- [ ] carryForward section
- [ ] canPause section
- [ ] needsChoice section
- [ ] resolve user choice
- [ ] remove incorrect item
- [ ] closure message
- [ ] stagger animation
- [ ] persistence

## Acceptance Criteria

用户：

```text
20 秒以内能够理解 AI 结果
并完成确认
```

---

# 58. M8 — Closure Ritual

## TODO

- [ ] summary
- [ ] ritual copy
- [ ] primary CTA
- [ ] start timer timestamp
- [ ] state persistence
- [ ] transition animation

## Acceptance Criteria

唯一 Primary CTA：

```text
结束今天
```

---

# 59. M9 — Wind Down Timer

## TODO

- [ ] absolute timestamp timer
- [ ] remaining calculation
- [ ] progress calculation
- [ ] three phases
- [ ] phase copy
- [ ] ambient progression
- [ ] information reduction
- [ ] background tab restore
- [ ] page refresh restore
- [ ] complete state

## Acceptance Criteria

刷新页面：

```text
Timer 不重新开始
```

后台停留：

```text
回来后时间正确
```

---

# 60. M10 — Quick Capture

## TODO

- [ ] trigger
- [ ] bottom sheet
- [ ] autofocus
- [ ] enter submit
- [ ] localStorage save
- [ ] success message
- [ ] auto close
- [ ] restore focus
- [ ] prevent duplicate empty submission

## Acceptance Criteria

```text
完整记录过程 < 5 秒
```

---

# 61. M11 — Complete

## TODO

- [ ] final visual state
- [ ] tomorrow count
- [ ] completedAt
- [ ] completion copy
- [ ] no recommendation
- [ ] no content feed
- [ ] no chat continuation
- [ ] optional subtle restart hidden as secondary

## Acceptance Criteria

页面上：

```text
没有任何鼓励继续停留的 Primary CTA
```

---

# 62. AI Eval

创建：

```text
docs/AI_EVAL.md
```

至少：

```text
15 cases
```

## Case 1

Input：

```text
明天九点交报告
```

Expected：

```text
carry_forward
```

## Case 2

Input：

```text
今天感觉效率特别差
```

Expected：

```text
can_pause
```

禁止：

```text
虚构新任务
```

## Case 3

Input：

```text
微信还有一个重要的人没回复
```

Expected：

```text
needs_choice
```

## Case 4

Input：

```text
明天有 10 件事情要做
```

Expected：

```text
carry_forward <= 3
```

## Case 5

Input：

```text
我现在要不要继续工作？
```

Expected：

```text
不鼓励继续工作
不替用户做高风险决定
```

## Case 6

Input：

```text
明天交报告，明天交报告，记得明天交报告
```

Expected：

```text
deduplicate
```

## Case 7

大量无结构文本：

Expected：

```text
可以正常抽取
不崩溃
```

## Case 8

纯情绪表达：

```text
今天感觉自己什么都没做好
```

Expected：

```text
不虚构任务
```

## Case 9

空字符串：

Expected：

```text
Frontend 提供 Direct Closure
```

## Case 10

非法 JSON：

Expected：

```text
retry
↓
fallback
```

## Case 11

长文本：

Expected：

```text
不输出大量 item
```

## Case 12

多个不确定事项：

Expected：

```text
needs_choice
而不是 AI 猜测
```

## Case 13

输入包含“今晚必须提交”：

Expected：

```text
不要直接 can_pause
```

## Case 14

模型生成不存在任务：

Expected：

```text
Eval fail
```

## Case 15

closure_message 太长：

Expected：

```text
validation fail
↓
retry / truncate safely
```

---

# 63. AI Evaluation Metrics

至少记录：

## Task Preservation

真正重要的任务：

```text
有没有被保留
```

这是最重要指标之一。

## Hallucinated Task Rate

模型：

```text
有没有创建用户没说过的任务
```

目标：

```text
接近 0
```

## Carry Forward Count

目标：

```text
<= 3
```

## Uncertainty Handling

无法确定紧急程度：

```text
是否进入 needsChoice
```

而不是乱猜。

## Format Success Rate

```text
合法 Schema 返回比例
```

目标：

```text
接近 100%
```

结合：

```text
retry + fallback
```

保证系统输出。

---

# 64. Frontend Test Strategy

重点测试：

```text
state machine
timer
localStorage restore
needsChoice
quick capture
empty flow
```

---

# 65. Backend Test Strategy

重点：

```text
schema
invalid output
timeout
fallback
max 3
empty content
deduplication
```

---

# 66. Manual Test

必须测试：

```text
375 × 812
390 × 844
430 × 932
768 × 1024
1440 × 900
```

同时：

```text
mobile keyboard
refresh
background tab
slow network
offline
API error
invalid model output
long text
reduced motion
keyboard-only
```

---

# 67. Build Strategy

绝对不要先花大量时间做 Backend。

正确策略：

# Build Mock First

## Phase 1 — Complete Mock Product

使用：

```text
mockClosureResult
```

优先完成：

```text
Welcome
↓
Brain Dump
↓
Processing
↓
Review
↓
Closure Ritual
↓
Wind Down
↓
Quick Capture
↓
Complete
```

此时必须已经可以完整演示。

## Phase 2 — Backend

加入：

```text
FastAPI
```

## Phase 3 — AI

加入：

```text
LLM
Structured Output
```

## Phase 4 — Reliability

加入：

```text
Validation
Retry
Timeout
Fallback
Demo Mode
```

## Phase 5 — Polish

最后：

```text
GSAP refinement
responsive
accessibility
tests
README
GIF
screenshots
```

---

# 68. 开发优先级

```text
P0
核心 Product Flow

↓

P1
AI Reliability

↓

P2
Signature Interaction

↓

P3
Responsive / Accessibility

↓

P4
Testing

↓

P5
Documentation
```

不要因为：

```text
高级动画
背景特效
桌面特殊布局
```

阻塞核心链路。

---

# 69. Demo 固定输入

准备：

```text
明天上午要把实习周报交了
还有一道算法题没刷
微信有个人还没回复
今天感觉效率特别低
突然想到明天要买咖啡
```

推荐结果：

```text
留给明天

01 提交实习周报
02 买咖啡


今晚暂停

✓ 再刷一道算法题
✓ 对今天效率的担心


需要确认

微信还有一个人没回复

[今晚处理] [明天再处理]
```

Closure：

```text
重要的事情已经留下。
今天可以到这里了。
```

---

# 70. Demo Script

演示控制：

```text
0–10s
解释问题

10–20s
Brain Dump

20–30s
AI Closure

30–45s
展示三分类和 needsChoice

45–55s
点击「结束今天」

55–75s
展示 Interface Falls Asleep

75–85s
Quick Capture

85–100s
Complete
```

目标：

```text
约 100 秒完整展示核心体验
```

---

# 71. 面试叙事

不要开场：

```text
我用了 React + FastAPI + 某模型……
```

正确顺序：

```text
Problem
↓
Insight
↓
Product Decision
↓
Why AI
↓
Demo
↓
Engineering
```

推荐表达：

```text
我最开始没有把这道题理解成“再做一个提醒早点睡的工具”，因为用户通常已经知道自己应该睡了。

真正的问题是，用户脑子里还有很多没有结束的事情，所以会不断重新打开手机继续处理。

因此我做了 Last30。用户可以把睡前还挂在脑子里的事情一次性写下来，AI 会将这些杂乱信息压缩成最多三件真正值得留给明天的事情，同时把无法判断紧急程度的内容交还给用户确认。

确认后，用户主动点击一次“结束今天”，之后产品本身也会逐渐减少颜色、信息和交互，最后退出用户注意力。

技术上，我重点处理了 Structured Output、Schema Validation、Retry、Timeout、Fallback 以及前端状态恢复，确保 AI 不稳定时整个产品体验仍然稳定。
```

---

# 72. README 第一屏

```markdown
# Last30

> An AI ritual for ending the day.

Most sleep tools tell you when to sleep.

Last30 helps you actually stop being online.
```

紧接：

```text
Demo GIF
```

然后：

```text
Problem
Product Insight
Core Flow
AI Architecture
Tech Stack
Run Locally
Demo Mode
Design Decisions
Limitations
```

---

# 73. README Architecture

```text
┌───────────────┐
│ React Client  │
└───────┬───────┘
        │
        │ Brain Dump
        ▼
┌───────────────┐
│ FastAPI       │
└───────┬───────┘
        │
        ▼
┌───────────────────┐
│ Closure Engine    │
│                   │
│ Prompt            │
│ Structured Output │
│ Validation        │
│ Retry             │
│ Fallback          │
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ ClosureResult     │
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ Review            │
│ ↓                 │
│ Ritual            │
│ ↓                 │
│ Wind Down         │
└───────────────────┘
```

---

# 74. GitHub 最终必须包含

- [ ] working source
- [ ] README.md
- [ ] screenshots
- [ ] demo GIF
- [ ] PRODUCT.md
- [ ] DESIGN.md
- [ ] docs/ARCHITECTURE.md
- [ ] docs/AI_EVAL.md
- [ ] docs/DEMO_SCRIPT.md
- [ ] docs/PRODUCT_DECISIONS.md
- [ ] .env.example
- [ ] Demo Mode
- [ ] startup commands
- [ ] limitations
- [ ] clean commit history

---

# 75. 推荐 Git Commit

```text
feat: initialize last30 experience

feat: build brain dump flow

feat: add mock closure flow

feat: build closure review experience

feat: add day closure ritual

feat: implement wind-down timer

feat: add quick capture flow

feat: integrate closure engine

feat: validate structured AI output

feat: add retry and fallback pipeline

feat: add progressive ambient transitions

test: add closure engine eval cases

style: polish responsive experience

docs: add architecture and demo guide
```

---

# 76. 200 字以内产品说明

最终提交时根据实际产品再次压缩并计算字数。

推荐版本：

> **Last30 是一个帮助用户“结束今天”的 AI 睡前收尾工具。用户睡前可以把仍挂在脑中的工作、消息和明日事项一次写下，AI 会将杂乱内容压缩为少量“留给明天”的事项，并把无法判断紧急程度的内容交还用户确认。用户点击“结束今天”后，产品进入 30 分钟低刺激模式，界面会逐渐减少颜色、文字与交互；中途想到新事情，也只需快速记录并留到明天。AI 在这里不是增加聊天，而是帮助用户减少决策并最终退出屏幕。**

提交前确保：

```text
<= 200 Chinese characters
```

---

# 77. Product Metrics

即使 MVP 不接 Analytics，也必须知道成功标准。

## Time to Closure

```text
Brain Dump
↓
End Today
```

目标：

```text
< 120 seconds
```

## Compression Ratio

```text
Raw Items
↓
Carry Forward
```

约束：

```text
carryForward <= 3
```

## Task Preservation

真正关键任务：

```text
是否被正确保留
```

## Hallucination Rate

```text
是否生成用户未提及任务
```

目标：

```text
尽量接近 0
```

## Uncertainty Handling

不确定内容：

```text
是否正确进入 needsChoice
```

## Quick Capture Time

目标：

```text
< 5 seconds
```

---

# 78. Product Guardrails

开发过程中反复检查：

## Guardrail 1

AI 不应增加任务。

## Guardrail 2

AI 不应替用户判断未知紧急事项。

## Guardrail 3

UI 必须随着流程越来越安静。

## Guardrail 4

最终必须让用户离开，而不是继续消费内容。

## Guardrail 5

不要将普通生活问题医学化。

---

# 79. Final Design Audit

完成后执行至少 5 个独立 Pass。

## Pass A — Product

逐屏检查：

```text
这个页面是否帮助用户结束今天？
```

如果不是：

```text
删除。
```

## Pass B — Hierarchy

每个 Stage：

```text
只能有一个明确 Primary Action
```

## Pass C — Reduction

尝试删除：

```text
20% 非必要元素
```

重点删除：

```text
cards
borders
icons
labels
secondary copy
decorative elements
```

## Pass D — Motion

所有动画都问：

```text
它让页面更安静，
还是让页面更兴奋？
```

如果更兴奋：

```text
删除
或减弱
```

## Pass E — Edge Cases

必须实际测试：

```text
Empty
Slow API
API Failure
Invalid JSON
Refresh
Background Tab
Mobile Keyboard
Reduced Motion
Long Input
Long AI Text
Offline
```

---

# 80. 最可能导致掉分的问题

必须避免：

1. 做成 AI Chatbot。
2. 做成 Todo App。
3. 做成睡眠健康 Dashboard。
4. AI 武断判断紧急事项。
5. UI 漂亮但核心闭环不完整。
6. 使用典型紫蓝 AI 渐变。
7. 30 分钟页面只是普通倒计时。
8. LLM 错误导致 Demo 崩溃。
9. GitHub clone 后无法运行。
10. 为了展示技术加入大量无关架构。
11. 页面按钮太多。
12. Complete 页面继续推荐内容。
13. Quick Capture 再次调用 LLM。
14. Timer 切后台后时间错误。
15. 忽略 reduced motion。

---

# 81. 时间不足时砍功能顺序

优先砍：

```text
① Desktop 特殊视觉
② 高级 Ambient Background
③ Review 高级编辑
④ 高级 Fallback Parser
⑤ 大量自动化 UI Test
⑥ 多主题
⑦ 高级视觉装饰
```

绝不能砍：

```text
Brain Dump
Closure Engine
Review
Needs Choice
Closure Ritual
Wind Down
Interface Falls Asleep
Quick Capture
Complete
```

---

# 82. Definition of Done

只有完整跑通以下链路才允许称为完成：

```text
用户打开网页
        ↓
理解 Last30
        ↓
输入 Brain Dump
        ↓
AI 返回 ClosureResult
        ↓
Schema Validation 通过
        ↓
Review
        ↓
用户解决 needsChoice
        ↓
点击「结束今天」
        ↓
Closure Ritual 完成
        ↓
Timer 启动
        ↓
UI 随时间逐渐安静
        ↓
Quick Capture 可使用
        ↓
刷新能够恢复 Timer
        ↓
Timer 完成
        ↓
显示：
「今天结束了。」
```

Frontend：

```bash
npm run build
```

必须成功。

Backend：

```text
tests pass
```

Demo Mode：

```text
无 API Key 仍然完整运行
```

GitHub：

```text
陌生开发者按照 README
5 分钟以内能够启动项目
```

---

# 83. Agent 最终执行顺序

严格按照以下顺序。

```text
01
阅读完整 PLAN

02
创建 PRODUCT.md

03
创建 DESIGN.md

04
初始化 React + Vite + TypeScript

05
初始化 FastAPI

06
建立 Design Tokens

07
建立 App State Machine

08
实现 Welcome

09
实现 Brain Dump

10
实现 Mock Processing

11
实现 Mock Review

12
实现 needsChoice

13
实现 Closure Ritual

14
实现 Wind Down Timer

15
实现 Quick Capture

16
实现 Complete

-----------------------------

到这里必须已经存在：
一个完整可运行的 Mock Demo

-----------------------------

17
实现 FastAPI /api/closure

18
实现 LLM Adapter

19
实现 System Prompt

20
实现 Structured Output

21
实现 Pydantic Validation

22
实现 Business Rule Validation

23
实现 Deduplication

24
实现 Retry

25
实现 Timeout

26
实现 Fallback

27
实现 Demo Mode

-----------------------------

28
实现 GSAP Stage Transition

29
实现 Interface Falls Asleep

30
优化 Processing Motion

31
优化 Review Motion

32
优化 Closure Ritual Motion

33
优化 Quick Capture Interaction

34
Responsive Audit

35
Accessibility Audit

36
AI Eval

37
Backend Tests

38
Frontend Tests

39
Impeccable Critique

40
Reduction Pass

41
Motion Pass

42
Edge Case Pass

43
Final Polish

44
README

45
Architecture Doc

46
AI Eval Doc

47
Demo Script

48
Screenshots

49
Demo GIF

50
Final GitHub Audit
```

---

# 84. Agent 每完成一个模块都必须自检

每个模块完成后检查：

```text
1. 是否真实运行？
2. Console 是否无 Error？
3. Mobile 是否正常？
4. Loading 是否存在？
5. Empty 是否处理？
6. Error 是否处理？
7. State 是否可恢复？
8. Animation 是否有 cleanup？
9. 是否增加了不必要功能？
10. 是否帮助用户更接近“结束今天”？
```

如果第 10 项：

```text
NO
```

重新评估是否删除该功能。

---

# 85. 最终评分目标

项目按以下维度自评：

| 维度 | 权重 | 目标 |
|---|---:|---:|
| 题目理解 | 15 | 15 |
| 产品洞察 | 15 | 14–15 |
| AI 必要性 | 15 | 14–15 |
| MVP 完整度 | 15 | 15 |
| UX / Interaction | 15 | 14–15 |
| AI Engineering | 10 | 9–10 |
| Visual Craft | 10 | 9–10 |
| Demo / GitHub | 5 | 5 |

目标：

```text
95+
```

不要通过增加功能来获得分数。

应该通过：

```text
概念清晰
AI 合理
体验完整
交互有记忆点
AI 有边界
失败可恢复
工程稳定
视觉克制
Demo 顺畅
```

获得分数。

---

# 86. 最终项目记忆点

最终成品必须让评审记住三个东西。

## ① Closure Engine

```text
AI 帮用户压缩信息，
而不是生成更多信息。
```

## ② Closure Ritual

```text
用户不是点“下一步”，
而是主动点“结束今天”。
```

## ③ Interface Falls Asleep

```text
随着时间流逝，
产品自身逐渐减少颜色、信息和交互，
最终退出用户注意力。
```

---

# 87. 最终工程表达

项目最终不应该让面试官留下：

```text
“这个候选人会调用一个 LLM API。”
```

而应该留下：

> **这个候选人能够从一个真实行为问题出发，判断 AI 应该出现在哪里、AI 在什么地方应该退出，并将 Prompt、Structured Output、Schema Validation、Uncertainty Handling、Retry、Fallback、Frontend State、Motion 和 UX 一起做成一个完整、稳定、可演示的 AI 产品。**

---

# 88. Final Decision Framework

之后 Agent 遇到任何新需求或技术选择，按照以下顺序判断：

```text
Does it help the user end today?
        ↓
Does AI materially improve it?
        ↓
Can the user understand it immediately?
        ↓
Does it reduce cognitive load?
        ↓
Can it fail safely?
        ↓
Does it reduce rather than add stimulation?
        ↓
Can it be demonstrated in under 2 minutes?
```

只有多数答案都是：

```text
YES
```

才实现。

否则：

```text
Do not build it.
```

---

# 89. 最终核心原则

整个项目始终围绕一句话：

# Last30 不负责让你睡着，它负责帮你结束今天。

产品成功不是：

```text
用户使用 Last30 更久。
```

而是：

```text
用户在 Last30 的帮助下，
更快、更自然地离开屏幕。
```

开发完成前，任何技术、交互、视觉、AI 决策都必须再次与这个目标对齐。
