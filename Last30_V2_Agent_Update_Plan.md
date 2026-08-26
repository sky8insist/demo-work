# Last30 V2 — 增量升级执行计划

## 0. 项目升级目标

V1 已经实现：

`Welcome → Brain Dump → AI Closure → Review → Closure Ritual → Wind Down → Quick Capture → Complete`

V2 不重写 V1，而是在现有能力上升级为“双路径睡前收尾系统”：

```text
事情还没结束 → Day Closure
情绪还没释放 → Emotion Bottle
                    ↓
                Wind Down
                    ↓
             Tomorrow Desk
```

核心定位：

> Last30 是一个 AI 驱动的日终收尾系统。它在睡前最后 30 分钟分别处理“还没有结束的事情”和“还没有释放的情绪”：该行动的内容被整理、归档并交给明天；想说的话在今晚被安静接住，由 AI 在后台整理，并在第二天由用户决定是否重新打开。

核心原则：

```text
Close what needs action.
Release what needs expression.
Carry forward only what deserves tomorrow.
```

---

# 1. V1 → V2 核心变化

| 维度 | V1 | V2 |
|---|---|---|
| 核心入口 | Brain Dump | Day Closure + Emotion Bottle |
| 输入 | 文字 | 文字 + 语音 |
| 输入内容 | 未完成事项 | Done + Open + Waiting + Thought + Emotion |
| AI 结构 | carryForward/canPause/needsChoice | completed/openLoops/waiting/tomorrow/release/needsChoice |
| AI 交互 | 一次分析 | 0–2 次低置信度动态确认 |
| 提醒 | 无 | 默认次日 08:00，可调整 |
| 情绪 | 被当作 canPause | 独立 Emotion Bottle |
| 跨天 | 单次 session | Night → Morning Handoff |
| AI 情绪反馈 | 无 | 今晚后台总结，第二天揭示 |
| 存储 | localStorage | localStorage + IndexedDB |
| Backend | `/api/closure` | closure + transcribe + emotion |
| 结束体验 | Wind Down | 两条核心路径统一汇入 Wind Down |

---

# 2. Reflection 后的三条设计结论

## Reflection 1 — 产品完整性

真实“睡前半小时”不是只有待办事项。

必须同时处理：

```text
Cognitive Open Loops
+
Emotional Open Loops
```

因此不能继续把所有输入交给同一个 Closure Prompt。

最终拆成：

```text
ACTION CLOSURE
+
EMOTION RELEASE
```

---

## Reflection 2 — AI 必要性

AI 只在以下位置出现：

- 自由文字/语音内容理解
- Done/Open/Waiting/Thought 抽取
- 模糊事项生成 Next Action
- 低置信度内容请求用户确认
- 情绪内容后台总结
- 次日 Handoff 整理

AI 不应该：

- 做心理诊断
- 实时打断情绪宣泄
- 每一步都聊天
- Quick Capture 调模型
- 自动输出大段建议

原则：

```text
Day Closure:
AI actively resolves.

Emotion Bottle:
AI quietly receives tonight,
and reflects tomorrow.
```

---

## Reflection 3 — 工程可实现性

V1 的 localStorage 单 session 模型无法完整支持：

- 多晚记录
- 第二天查看
- 情绪 summary
- reminderAt
- voice transcript

所以 V2 必须升级数据层，但仍保持 Mini Build：

```text
P0:
local-first
IndexedDB
FastAPI AI services
in-app reminder

P1:
Browser Notification / PWA

P2:
cloud sync
```

不要为了提醒功能直接上 Redis/Celery。

---

# 3. V2 总体架构

```text
                           LAST30
                              │
                      Sleep Entry Router
                 ┌────────────┴────────────┐
                 ▼                         ▼
           DAY CLOSURE               EMOTION BOTTLE
                 │                         │
          Text / Voice                Text / Voice
                 │                         │
                 ▼                         ▼
       Multimodal Capture          Quiet Emotion Capture
                 │                         │
                 ▼                         ▼
         Closure Engine              Transcription
                 │                         │
       ┌─────────┼─────────┐               ▼
       ▼         ▼         ▼        Emotion Processing
    Completed   Open     Waiting            │
                 │                         ▼
                 ▼                    Sealed Result
           Next Action                      │
                 ▼                         │
         Confidence Gate                    │
          ┌──────┴──────┐                  │
          ▼             ▼                  │
       Auto           Human                 │
      Resolve         Choice                │
          └──────┬──────┘                  │
                 ▼                         │
          Closure Preview                  │
                 ▼                         │
         One-click Commit                  │
                 │                         │
       ┌─────────┼─────────┐               │
       ▼         ▼         ▼               │
    Archive   Tomorrow   Waiting             │
                 └──────────┬──────────────┘
                            ▼
                       WIND DOWN
                            ▼
                           Sleep
                            ▼
                     TOMORROW DESK
                 ┌──────────┴──────────┐
                 ▼                     ▼
          Morning Handoff        Bottle Reflection
```

---

# 4. Module A — Sleep Entry Router

## 功能

首页从单入口升级为两个入口：

```text
今天准备结束了吗？

[收尾今天的事情]
还有完成、没完成、明天要继续的事情

[打开情绪宣泄瓶]
只是想把一些话说出来
```

## Input

```ts
type EntryMode = "day_closure" | "emotion_bottle";
```

## Output

```text
DAY_CLOSURE_CAPTURE
or
EMOTION_BOTTLE_READY
```

## TODO

- [ ] 修改 WelcomeStage
- [ ] 新增两个入口
- [ ] 更新 AppStage
- [ ] 保留现有 Wind Down
- [ ] 不新增第三个大型入口

## Acceptance

用户 5 秒内理解：

```text
有事情没结束 → 收尾
有话想说 → 情绪瓶
```

---

# 5. Module B — Multimodal Capture

## 功能

Day Closure 与 Emotion Bottle 共用：

```text
Text
+
Voice
```

最终统一输出：

```text
Normalized Text
```

## Text

Day Closure 文案：

```text
今天做完了什么，
还有什么没做完，
明天还需要记住什么？

想到什么就写什么，不需要整理。
```

允许混合输入：

```text
今天首页写完了
登录还有问题
明早交周报
老师邮件还没回
算法题今天没做
```

## Voice

```text
MediaRecorder
→ audio/webm
→ POST /api/transcribe
→ transcript
```

### Day Closure

允许用户查看 transcript 后继续。

### Emotion Bottle

录音时不展示 transcript，只展示：

```text
Wave feedback
+
[已完成]
```

## API

```http
POST /api/transcribe
```

Request：

```text
audio
mode = closure | emotion
language = auto
```

Response：

```json
{
  "transcript": "...",
  "language": "zh",
  "duration_ms": 18200
}
```

## TODO

- [ ] VoiceCapture.tsx
- [ ] MediaRecorder
- [ ] microphone permission
- [ ] recording / stop
- [ ] upload
- [ ] transcribe API
- [ ] max duration
- [ ] denied permission fallback
- [ ] unsupported browser fallback
- [ ] Closure 显示 transcript
- [ ] Emotion 不显示实时 transcript

## 参考

- `kaisoapbox/WhisperJournal`
- `ggml-org/whisper.cpp`

MVP 优先：

```text
MediaRecorder → FastAPI → Whisper-compatible API
```

后续再考虑本地 whisper.cpp / WASM。

---

# 6. Module C — Dynamic Day Closure Engine

这是 V2 第一核心功能。

## AI 输入

用户可自由混合：

```text
DONE
OPEN
WAITING
TOMORROW
THOUGHT
```

模型自己抽取。

示例：

```text
今天首页基本写完了
登录还有 bug
在等产品给最终文案
老师邮件还没回
明早交周报
今天感觉效率有点低
```

Expected：

```text
DONE
- 首页主体完成

OPEN
- 登录 bug
- 提交周报
- 回复老师邮件

WAITING
- 产品最终文案

THOUGHT
- 对今天效率的担心
```

## Schema

```ts
interface CompletedItem {
  id: string;
  summary: string;
}

type OpenLoopType =
  | "actionable"
  | "waiting"
  | "deferred"
  | "thought"
  | "unclear";

type Resolution =
  | "archive"
  | "tomorrow"
  | "waiting"
  | "release"
  | "needs_choice";

interface OpenLoop {
  id: string;
  originalText: string;
  normalizedText: string;
  type: OpenLoopType;
  resolution: Resolution;
  nextAction?: string;
  confidence: number;
  reason?: string;
}

interface DayClosureResult {
  completed: CompletedItem[];
  openLoops: OpenLoop[];
  tomorrow: OpenLoop[];
  waiting: OpenLoop[];
  released: OpenLoop[];
  needsChoice: OpenLoop[];
  closureMessage: string;
}
```

## TODO

- [ ] 更新 TypeScript schema
- [ ] 更新 Pydantic schema
- [ ] 更新 closure prompt
- [ ] DONE extraction
- [ ] OPEN extraction
- [ ] WAITING detection
- [ ] THOUGHT detection
- [ ] deduplication
- [ ] hallucination guard
- [ ] fallback
- [ ] old V1 schema migration

---

# 7. Module D — Next Action Compiler

只对：

```text
actionable
```

生效。

## 目标

```text
“明天继续整理简历”
```

转为：

```text
“打开简历，先修改项目经历第一条”
```

## Rule

- 不创建新目标
- 只生成一个动作
- 能直接开始
- 不拆成长计划
- 信息不足时不猜

## Output

```json
{
  "next_action": "打开简历，先修改项目经历第一条"
}
```

核心价值：

```text
Tomorrow Task
→
Tomorrow Starting Point
```

---

# 8. Module E — Confidence-driven Human-in-the-loop

V1 的 `needsChoice` 升级为正式不确定性机制。

```text
confidence >= 0.80
→ auto resolve

0.55–0.80
→ AI suggestion + editable

< 0.55
→ user choice
```

例如：

```json
{
  "originalText": "老师邮件还没回",
  "resolution": "needs_choice",
  "confidence": 0.42
}
```

前端：

```text
老师的邮件今晚需要处理吗？

[今晚处理]
[明天提醒]
[等待后续]
```

动态追问：

```text
最多 0–2 次
```

只有低置信度且答案会影响 Closure 结果时才追问。

禁止变成长对话。

---

# 9. Module F — Closure Preview

页面必须突出：

```text
1. 今天已经完成
2. 真正留给明天
3. Waiting
4. Release
```

示例：

```text
今天已经完成
✓ 首页主体
✓ 报告结构调整

留给明天
○ 修复登录问题
  第一步：复现登录失败请求

○ 08:00 提交周报

正在等待
○ 产品最终文案

今晚可以放下
○ 对今天效率的担心
```

核心区域不是 AI 的解释，而是：

```text
用户今天的状态已经被整理完毕
```

---

# 10. Module G — One-click Closure Commit

CTA：

```text
一键结束今天
```

点击后一次执行：

```text
Completed → Archive
Tomorrow → Tomorrow Queue
Waiting → Waiting Queue
Released → Closed
Reminder → Save
Session → committed
```

## API

从旧：

```http
POST /api/closure
```

升级为：

```http
POST /api/closure/analyze
POST /api/closure/commit
```

分析和持久化必须分离。

---

# 11. Module H — Reminder Clock

默认：

```text
Tomorrow 08:00
```

用户可快速选择：

```text
07:30
08:00
09:00
自定义
```

## Data

```ts
interface Reminder {
  id: string;
  itemIds: string[];
  scheduledFor: string;
  timezone: string;
  status: "scheduled" | "delivered" | "missed" | "cancelled";
}
```

## P0

- 保存 reminderAt
- 保存 timezone
- 第二天打开时检测 due
- 自动进入 Tomorrow Desk
- 页面运行时可尝试 Browser Notification

## P1

真正关闭网页后仍推送：

```text
PWA
+
Service Worker
+
Push Subscription
+
Backend Scheduler
```

不要用 `setTimeout` 假装后台提醒。

## 参考

`stadimeti19/DailyOS`：

- timezone
- schedule persistence
- missed-run recovery
- retry
- run history

---

# 12. Module I — Emotion Bottle

这是 V2 第二核心功能。

## 产品定义

```text
Quiet Emotional Offload
```

不是：

```text
AI Therapist
```

今晚：

```text
Speak / Write
→ Receive
→ Seal
→ Sleep
```

第二天：

```text
Open
→ Summary
→ Optional Reflection
```

## State

```text
BOTTLE_CLOSED
→ BOTTLE_OPEN
→ INPUT_CHOICE
→ RECORDING / WRITING
→ COMPLETE
→ SEAL_CHOICE
→ BACKGROUND_PROCESSING
→ WIND_DOWN
→ SEALED
→ READY_TO_OPEN
→ SUMMARY
```

---

# 13. Emotion Bottle — Voice Mode

录音期间页面只显示：

```text
Wave feedback

[已完成]
```

不要显示：

- transcript
- AI 分析
- 情绪标签
- 建议
- 多余按钮

目的：

```text
不是“语音输入”
而是“把话说出去”
```

点击“已完成”后立即显示承接语：

```text
都放在这里了。

今晚不用再整理这些话。

去休息吧。
```

然后进入 Wind Down。

---

# 14. Emotion Bottle — Seal Mode

用户结束后：

```text
这些话想怎么处理？

[明天让我看看]
[就留在今晚]
```

## 明天让我看看

保存：

```text
transcript
summary
topics
keyEvents
createdAt
revealAt
```

## 就留在今晚

处理完成后删除：

```text
raw audio
raw transcript
```

只保留必要 session metadata，或完全删除。

这是必须明确的隐私控制。

---

# 15. Module J — Emotion Processing Engine

AI 在后台处理，但今晚不向用户展示。

## Input

```json
{
  "transcript": "...",
  "created_at": "...",
  "mode": "emotion_bottle"
}
```

## Output

```ts
interface EmotionSummary {
  id: string;
  conciseSummary: string;
  topics: string[];
  keyEvents: string[];
  repeatedConcerns: string[];
  createdAt: string;
  revealAt: string;
}
```

## Prompt Rule

只做：

- 事实归纳
- 主题抽取
- 明确提到的事件
- 重复出现的关注点
- 简短总结

禁止：

- 心理诊断
- 精神疾病标签
- 情绪百分比
- 隐藏创伤推断
- 治疗建议
- “你应该”

## 参考

`neblinedev/nebline`

借鉴：

```text
offline-first journal
+
AI insight
+
privacy
```

但 Last30 必须比它更严格限制诊断和即时反馈。

---

# 16. Module K — Delayed Reveal

这是 Emotion Bottle 的功能创新，不是视觉玩法。

```text
Tonight:
AI = Listener

Tomorrow:
AI = Reflector
```

处理完成：

```text
sealedUntil = next morning
```

例如：

```text
08:00
```

在此之前不显示总结。

达到时间：

```text
SEALED
→ READY_TO_OPEN
```

---

# 17. Module L — Tomorrow Desk

这是“交给明天”真正成立的关键。

第二天打开：

```text
早上好。

昨晚给今天留下了：
3 件事情

[查看今天]

昨晚的情绪瓶：
1 条可以打开

[打开看看]
```

## Morning Handoff

```text
1. 提交实习周报
   下一步：检查最终版本并上传

2. 修复登录问题
   下一步：复现登录失败请求

3. 回复老师邮件
```

禁止把：

```text
released
thought
```

重新带回来。

Tomorrow Desk 不是 Todo App，不增加：

- Kanban
- Calendar
- Project Management
- Priority Matrix

它只承接昨晚明确交给今天的内容。

---

# 18. Bottle Reflection

第二天用户主动打开后：

## 昨晚发生了什么

```text
你主要提到了：
- 项目推进不顺
- 与同学沟通
- 明天任务比较集中
```

## 反复出现的内容

```text
你多次提到项目进度。
```

## AI Summary

```text
昨晚的内容主要围绕项目推进和时间压力。
```

默认不给建议。

只提供次级按钮：

```text
想想今天可以怎么处理
```

只有主动点击后才进入可选 Reflection。

---

# 19. Wind Down 更新

V1 Wind Down 不重写。

两个新路径统一汇入：

```text
Closure Commit
→ Wind Down

Emotion Complete
→ Wind Down
```

新增：

```ts
modeSource: "closure" | "emotion";
```

结束文案：

Closure：

```text
明天的事情已经留下。
```

Emotion：

```text
想说的话已经留在这里。
```

---

# 20. Data Layer

V1：

```text
localStorage
single session
```

V2：

```text
localStorage
→ settings + active pointer

IndexedDB
→ closure sessions
→ emotion sessions
→ transcript
→ summary
→ reminder
```

## UserSettings

```ts
interface UserSettings {
  defaultReminderTime: string; // 08:00
  timezone: string;
  notificationsEnabled: boolean;
}
```

## NightSession

```ts
interface NightSession {
  id: string;
  date: string;
  startedAt: string;
  completedAt?: string;
  mode: "closure" | "emotion" | "both";
  windDownEndsAt?: string;
  status: "active" | "completed";
}
```

## EmotionRecord

```ts
interface EmotionRecord {
  id: string;
  sessionId: string;
  inputType: "text" | "voice";
  rawTranscript?: string;
  summary?: EmotionSummary;
  retention: "reveal_tomorrow" | "release_tonight";
  status: "processing" | "sealed" | "ready" | "released";
  revealAt?: string;
  createdAt: string;
}
```

---

# 21. Backend 目录更新

```text
backend/app/

├── api/
│   ├── closure.py
│   ├── transcription.py
│   └── emotion.py
│
├── schemas/
│   ├── closure.py
│   ├── transcription.py
│   └── emotion.py
│
├── services/
│   ├── closure_engine.py
│   ├── next_action.py
│   ├── transcription_service.py
│   ├── emotion_processor.py
│   ├── reminder_service.py
│   ├── llm.py
│   └── fallback.py
│
└── prompts/
    ├── closure.md
    └── emotion_summary.md
```

---

# 22. Frontend 目录更新

```text
frontend/src/

├── stages/
│   ├── SleepEntryStage.tsx
│   ├── ClosureCaptureStage.tsx
│   ├── ClosurePreviewStage.tsx
│   ├── EmotionBottleStage.tsx
│   ├── EmotionCaptureStage.tsx
│   ├── EmotionSealStage.tsx
│   ├── TomorrowDeskStage.tsx
│   └── BottleReflectionStage.tsx
│
├── components/
│   ├── VoiceCapture.tsx
│   ├── RecordingIndicator.tsx
│   ├── ReminderTimePicker.tsx
│   ├── CompletedList.tsx
│   ├── TomorrowList.tsx
│   └── WaitingList.tsx
│
├── storage/
│   ├── db.ts
│   ├── sessionRepository.ts
│   ├── closureRepository.ts
│   └── emotionRepository.ts
│
└── services/
    ├── closureApi.ts
    ├── transcriptionApi.ts
    └── emotionApi.ts
```

---

# 23. App State V2

```ts
type AppStage =
  | "ENTRY"
  | "CLOSURE_CAPTURE"
  | "CLOSURE_PROCESSING"
  | "CLOSURE_REVIEW"
  | "CLOSURE_CHOICE"
  | "CLOSURE_COMMIT"
  | "EMOTION_READY"
  | "EMOTION_CAPTURE"
  | "EMOTION_SEAL"
  | "WIND_DOWN"
  | "COMPLETE"
  | "TOMORROW_DESK"
  | "BOTTLE_REFLECTION";
```

不要增加大量 Boolean。

---

# 24. Privacy

Emotion Bottle 按 privacy-by-default 设计。

Voice：

```text
upload
→ transcribe
→ delete raw audio
```

除非用户主动保存。

前端说明：

```text
语音仅用于生成文字，
默认不长期保存原始录音。
```

Emotion：

```text
reveal tomorrow
or
release tonight
```

必须由用户主动选择。

---

# 25. AI Eval V2

保留 V1 Eval，新增三组。

## Closure Eval

测试：

- DONE + OPEN 混合输入
- Waiting
- Unclear
- 重复任务
- 模糊 Next Action
- Completed 不能重新进入 Tomorrow
- Thought 不能自动生成 Task

指标：

```text
Completion Extraction Accuracy
Open Loop Recall
Hallucinated Task Rate
Next Action Groundedness
Uncertainty Routing Accuracy
```

## Emotion Eval

指标：

```text
Summary Faithfulness
Topic Coverage
No Diagnosis
No Invented Event
Conciseness
```

## Speech Eval

测试：

```text
短中文
长中文
中英混合
环境噪声
空录音
麦克风拒绝
上传失败
```

---

# 26. 参考开源项目

## `jordantcarlisle/personal-os`

参考：

- morning/evening rituals
- inbox triage
- tomorrow priorities
- 防止过度计划

## `guo-yichen/work-os`

参考：

```text
You talk
→ agents organize
```

以及 evening update / tomorrow Top 3。

## `amanaiproduct/personal-os`

参考：

- Brain dump
- Backlog processing
- Structured organization
- Session evals

## `stadimeti19/DailyOS`

参考 Reminder 工程：

- timezone
- persistent schedule
- missed-run recovery
- retry
- history

## `kaisoapbox/WhisperJournal`

参考：

- Voice journal
- local-first
- whisper.cpp
- privacy

## `ggml-org/whisper.cpp`

参考：

- ASR
- VAD
- local / WebAssembly 方向

## `neblinedev/nebline`

参考：

- offline-first journal
- AI-assisted reflection
- privacy

不要照搬心理分析定位。

---

# 27. 增量迁移顺序

V1 已完成，禁止重新 scaffold。

## Phase 0 — Freeze

- [ ] 创建 `feature/last30-v2`
- [ ] V1 build 通过
- [ ] V1 backend tests 通过
- [ ] 保存原 Demo
- [ ] 标记旧 storage schema

## Phase 1 — Data

- [ ] UserSettings
- [ ] NightSession
- [ ] ClosureRecord
- [ ] EmotionRecord
- [ ] IndexedDB
- [ ] default 08:00
- [ ] V1 migration

## Phase 2 — Entry Router

- [ ] Welcome 双入口
- [ ] 原 Brain Dump 接 Day Closure
- [ ] 原 Wind Down 不动

## Phase 3 — Closure V2

- [ ] 新 Schema
- [ ] Done/Open/Waiting
- [ ] Next Action
- [ ] confidence
- [ ] 0–2 次 choice
- [ ] Closure Preview

## Phase 4 — Commit + Reminder

- [ ] analyze / commit 分离
- [ ] Archive
- [ ] Tomorrow Queue
- [ ] Waiting
- [ ] Release
- [ ] default 08:00
- [ ] custom reminder
- [ ] due detection

## Phase 5 — Voice

- [ ] MediaRecorder
- [ ] shared VoiceCapture
- [ ] transcribe API
- [ ] Closure voice
- [ ] fallback

## Phase 6 — Emotion Bottle

- [ ] text mode
- [ ] voice mode
- [ ] no live transcript
- [ ] complete
- [ ] seal choice
- [ ] background process
- [ ] raw audio delete

## Phase 7 — Delayed Summary

- [ ] summary schema
- [ ] summary prompt
- [ ] topics
- [ ] key events
- [ ] repeated concerns
- [ ] sealedUntil
- [ ] next-day reveal

## Phase 8 — Tomorrow Desk

- [ ] reminder due
- [ ] Morning Handoff
- [ ] Bottle ready
- [ ] Reflection
- [ ] released 内容不回流

## Phase 9 — Optional Push

- [ ] Notifications API
- [ ] PWA
- [ ] Service Worker
- [ ] Push subscription
- [ ] scheduler
- [ ] missed reminder recovery

---

# 28. P0 / P1 / P2

## P0

- Day Closure Text + Voice
- Done/Open/Waiting
- Next Action
- Confidence / Choice
- One-click Commit
- Default 08:00
- Cross-day persistence
- Emotion Bottle Text + Voice
- Background Summary
- Delayed Reveal
- Tomorrow Desk
- Reuse Wind Down

## P1

- Browser Notification
- Audio automatic deletion
- Carry-over history
- custom reminder presets
- optional Reflection

## P2

- PWA Push
- local whisper.cpp
- WASM ASR
- cloud sync
- multi-device
- long-term emotion trends

---

# 29. 不做

- AI Therapist
- 睡眠诊断
- Mood Score
- 大型 Todo Manager
- Calendar App
- Habit Tracker
- Community
- Gamification
- Multi-Agent
- RAG
- 实时 Emotion AI Chat

---

# 30. V2 Definition of Done

## Flow A

```text
Entry
→ Day Closure
→ Text / Voice
→ DONE + OPEN
→ Next Action
→ Low-confidence Choice
→ Preview
→ Reminder 08:00
→ Commit
→ Wind Down
→ Complete
→ next morning
→ Tomorrow Desk
```

## Flow B

```text
Entry
→ Emotion Bottle
→ Text / Voice
→ Free Expression
→ Complete
→ Seal Choice
→ Background AI Summary
→ Wind Down
→ Sleep
→ next morning
→ Bottle Ready
→ Open
→ Summary
```

---

# 31. Agent 执行硬约束

1. 先阅读现有代码。
2. 不重新初始化项目。
3. 不删除 V1 已完成能力。
4. 优先复用已有组件。
5. 先完成 data migration。
6. 再升级 Day Closure。
7. 再做 Voice。
8. 再做 Emotion Bottle。
9. 最后做 Tomorrow Desk。
10. Push notification 不得阻塞 P0。

每个 Phase 完成：

```text
npm run build
backend tests
regression check
```

都必须通过。

---

# 32. 最终评委记忆点

## 1. AI 真正关闭事情

```text
Done
Open
Waiting
Tomorrow
Release
Next Action
```

不是简单 Todo 分类。

## 2. AI 知道什么时候不说话

```text
Emotion Bottle:
Tonight = Receive
Tomorrow = Reflect
```

## 3. “交给明天”真的兑现

```text
Tonight
→ Commit
→ Reminder
→ Morning Handoff
```

---

# 33. 最终一句话

> **Last30 不只是让用户停止刷手机，而是帮助用户在睡前完成两种真正的“结束”：把还需要行动的事情交给明天，把今晚只需要表达的内容留在今晚。**
