# Last30 V2

Last30 是一个本地优先的日终收尾 Demo。它包含两条闭环：事情通过 Day Closure 交给明天，情绪通过 Emotion Bottle 留到次日再做事实性回顾。

## 产品说明

这是一个面向睡前最后 30 分钟的 AI 收尾工具。我把它设计成“事情收尾”和“情绪释放”两条路径：用户可以用文字或语音记录今天做完、没做完和想说的话。AI 会整理待办、生成明天的下一步、识别需要确认的事项，并默认设置次日 8 点提醒；情绪内容则在今晚只负责接收，后台生成总结，第二天再由用户主动查看。这样做是希望 AI 不一直打扰用户，而是在该介入时帮助整理，在该退出时让用户真正放下手机。

## 本地运行

```powershell
npm run dev
python -m uvicorn backend.app.main:app --reload --port 8000
```

前端默认访问 `http://localhost:5173`，后端默认访问 `http://localhost:8000`。配置项见 `.env.example`。

## GitHub Pages

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动构建并发布静态预览。首次使用时，请在仓库的 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。

Pages 版本默认使用本地 Mock，不访问 FastAPI 或 `localhost`，因此 Closure、模拟语音、Emotion Bottle、IndexedDB 次日交接和 PWA 均可直接体验。访问地址通常为：

```text
https://<GitHub用户名>.github.io/<仓库名>/
```

## Mock 边界

- `/api/closure/analyze` 返回经过 V2 Schema 校验的确定性 Closure 结果。
- `/api/transcribe` 接收录音 Blob，但返回固定的模式化演示转写；原始录音不保存。
- `/api/emotion/process` 返回限定字段的事实性摘要，不诊断、不评分、不给建议。
- API 不可用时，前端自动回退到本地规则引擎。
- Reminder、Notification、PWA 和跨天读取均在浏览器本地运行，不依赖云服务。

## 验收

```powershell
npm run build
python -m unittest discover -s backend/tests -v
npm run test:e2e
```

手动流程见 `docs/DEMO_SCRIPT_V2.md`。建议分别在桌面和 390px 移动视口验收：

1. Day Closure 文本和模拟语音均能进入 V2 Review。
2. 低置信度条目必须由用户选择后才能提交。
3. 提交后 IndexedDB 记录包含 `scheduledFor`、`timezone` 和 `status`。
4. Emotion Bottle 的“明天让我看看”生成带 `revealAt` 的 sealed 记录；“留在今晚”不生成回顾。
5. “演示第二天早晨”优先读取 IndexedDB；无记录时明确标注示例数据。
6. 到期记录在下次打开时自动进入 Tomorrow Desk；通知权限拒绝不阻断流程。
