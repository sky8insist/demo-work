# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

需要在睡前从工作与情绪中退出的人。他们不是来管理完整待办清单，而是希望在一天最后 30 分钟里，把仍悬而未决的事情放到明确位置，或把未说完的情绪安静留下。

## Product Purpose

Dayend 将睡前的“放不下”拆成两种不同任务：Day Closure 逐项理解并关闭 open loops；Emotion Bottle 提供尽量少打扰的自由表达与延迟反馈。成功意味着用户能够结束今天，而不是继续整理更多事情。

## Positioning

Day Closure 通过“一次只处理一个 open loop”的动态访谈完成决策；Emotion Bottle 通过“打开、倾倒、封存、次晨解锁”的具象交互承接情绪。两者不是同一套输入与分析页面的换皮。

## Operating Context

产品用于夜间、睡前和次日早晨的短时段体验。核心流程为：夜间入口 → 收尾或情绪瓶 → Wind Down → Complete → 次晨交接/回看。全局低音量环境音乐在核心流程间持续存在。

## Capabilities and Constraints

- React + TypeScript + Vite 单页 Demo。
- 所有 AI、语音识别、提醒和情绪信号均使用稳定 Mock；不接真实 LLM、ASR、数据库、Push、认证或心理诊断。
- Closure 支持动态原因路由、下一步编译、等待、释放、跳过、Closure Map、覆盖率与 Receipt。
- Emotion Bottle 支持文字、Mock Voice、液体波动、开合封存、条件承接、安全边界、反馈锁与 Demo Morning。
- Ambient Music 支持首次核心交互启动、暂停/恢复、切换三条本地音轨、音量、持久化与 Voice Ducking。
- 必须支持移动端、键盘操作、刷新恢复与 reduced motion。

## Brand Commitments

品牌名称固定为 Dayend。语气克制、非诊断、非效率施压；不使用 Mood Score，不把所有 open loop 都转成明日 Todo，不在情绪表达过程中持续分析或建议。

## Evidence on Hand

- 产品与验收依据：`C:\Users\xingk\Desktop\Last30_V3_Agent_Execution_Plan.md`
- 现有 V2 React Demo 与本地存储/次晨交接实现。
- 无真实用户评价、商业指标或临床证据，不得虚构。

## Product Principles

- 核心体验优先于功能数量。
- 交互机制优先于静态结果页。
- Mock 稳定性优先于真实 API 复杂度。
- 复用现有可运行基础，不扩大到计划外功能。
- 产品在该退出时退出用户的注意力。

## Accessibility & Inclusion

支持 reduced motion、可见键盘焦点、语义化控件与窄屏布局；高风险自伤表达必须立即显示安全提示，不延迟到次日，也不输出风险评分或诊断。
