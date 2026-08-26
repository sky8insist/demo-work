# Last30

> An AI ritual for ending the day.

Last30 不负责让你睡着，它负责帮你结束今天。V2 通过两条路径分别处理行动与表达：Day Closure 整理完成、未完、等待与低置信度事项；Emotion Bottle 今晚只接住内容，第二天才由用户主动打开简短回顾。两条路径最终汇入逐渐安静的 30 分钟收尾界面。

## 本地运行

```bash
npm install
npm run dev
```

前端默认使用内置 Demo Engine，无需 API Key。两个输入页面均提供“填入演示内容”；倒计时页面提供演示跳过入口，完成页可以直接进入第二天。

`backend/` 保留 V1 的可选 FastAPI 示例，但 V2 演示不依赖它：

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

## 当前范围

- 双入口：Day Closure / Emotion Bottle
- 文字与录音演示、Done/Open/Waiting/Release、Next Action 和低置信度确认
- 默认 08:00 提醒、IndexedDB 夜间记录、localStorage 活跃状态恢复
- 情绪隐私选择、延迟揭示、Tomorrow Desk 次日交接
- Wind Down 倒计时与 Quick Capture
- 无密钥 Demo fallback、响应式与 reduced-motion

## 演示说明

建议先演示 Day Closure，突出 AI 如何区分完成、行动、等待、释放与不确定事项；然后重置并演示 Emotion Bottle，选择“明天让我看看”，跳过倒计时后进入 Tomorrow Desk 打开回顾。完整讲解脚本见 `docs/DEMO_SCRIPT_V2.md`。

## 数据与隐私

- 活跃流程保存在 `localStorage`，提交记录保存在浏览器 `IndexedDB`。
- 录音仅演示 MediaRecorder 权限与反馈，停止后注入固定转写，不上传、不长期保存音频。
- 选择“就留在今晚”不会生成第二天回顾。

这是演示版。前端不调用真实模型；分析、转写和情绪总结均为确定性模拟，确保离线展示稳定。
