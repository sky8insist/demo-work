import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Eye,
  FlaskConical,
  Inbox,
  LockKeyhole,
  Mic,
  Moon,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import VoiceCapture from "./VoiceCapture";
import { analyzeClosure, summarizeEmotion } from "./mockEngine";
import { closureApi } from "./api/closureApi";
import { emotionApi } from "./api/emotionApi";
import {
  clearSession,
  defaultSession,
  loadSession,
  loadMorningHandoff,
  nextOccurrence,
  saveRecord,
  saveSession,
} from "./storage";
import type { AppSession, OpenLoop } from "./types";

gsap.registerPlugin(useGSAP);
const closureDemo =
  "今天首页已经写完了\n登录还有问题\n在等产品给最终文案\n老师邮件还没回\n明早交周报\n今天感觉效率有点低";
const emotionDemo =
  "项目推进得不太顺，和同学沟通也有点累。明天的事情都挤在一起，我一直在想时间够不够。";

export default function App() {
  const [s, setS] = useState<AppSession>(loadSession);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [capture, setCapture] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const set = (next: Partial<AppSession>) => setS((v) => ({ ...v, ...next }));
  useEffect(() => saveSession(s), [s]);
  useEffect(() => {
    loadMorningHandoff().then((handoff) => {
      if (!handoff.closure && !handoff.emotion) return;
      setS((current) => ({
        ...current,
        stage: "TOMORROW_DESK",
        mode: handoff.closure ? "closure" : "emotion",
        closure: handoff.closure ? { completed: [], tomorrow: handoff.closure.tomorrow, waiting: handoff.closure.waiting, released: [], needsChoice: [], closureMessage: "昨晚的交接已到达。" } : null,
        emotionRetention: handoff.emotion ? "reveal_tomorrow" : null,
        emotionSummary: handoff.emotion?.summary || null,
        demoMorning: false,
        dataNotice: "已读取昨晚到期的本地交接。",
      }));
      if ("Notification" in window && Notification.permission === "granted")
        new Notification("Last30", { body: "昨晚留下的交接已经可以查看。" });
    }).catch(() => set({ dataNotice: "本地记录暂时无法读取，当前流程仍可继续。" }));
  }, []);
  useEffect(() => {
    if (s.stage !== "WIND_DOWN") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [s.stage]);
  useEffect(() => {
    if (s.stage === "WIND_DOWN" && s.windDownEndsAt && now >= s.windDownEndsAt)
      set({ stage: "COMPLETE" });
  }, [now, s.stage, s.windDownEndsAt]);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".stage-in",
          { autoAlpha: 0.01, y: 22, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.68,
            ease: "expo.out",
            clearProps: "filter,transform,opacity,visibility",
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [s.stage], revertOnUpdate: true },
  );

  const remaining = Math.max(0, (s.windDownEndsAt || now) - now);
  const mins = Math.floor(remaining / 60000)
      .toString()
      .padStart(2, "0"),
    secs = Math.floor((remaining % 60000) / 1000)
      .toString()
      .padStart(2, "0");
  const sleep = s.windDownEndsAt
    ? Math.min(1, Math.max(0, 1 - remaining / 1800000))
    : 0;
  const choiceResolved = !s.closure?.needsChoice.some(
    (item) => !s.choices[item.id],
  );
  const tomorrowItems = useMemo(
    () => [
      ...(s.closure?.tomorrow || []),
      ...(s.closure?.needsChoice || []).filter(
        (i) => s.choices[i.id] === "tomorrow",
      ),
    ],
    [s.closure, s.choices],
  );
  const waitingItems = useMemo(
    () => [
      ...(s.closure?.waiting || []),
      ...(s.closure?.needsChoice || []).filter(
        (i) => s.choices[i.id] === "waiting",
      ),
    ],
    [s.closure, s.choices],
  );
  const archivedCount =
    (s.closure?.completed.length || 0) +
    Object.values(s.choices).filter((value) => value === "tonight").length;
  const status =
    s.stage === "ENTRY"
      ? "今晚尚未交接"
      : s.stage === "WIND_DOWN"
        ? "正在离线"
        : s.stage === "COMPLETE"
          ? "今晚已结束"
          : s.stage.includes("TOMORROW") || s.stage === "BOTTLE_REFLECTION"
            ? "早晨交接"
            : "正在收尾";
  const reset = () => {
    clearSession();
    setS(defaultSession);
  };
  const goBack = () => set({ stage: "ENTRY", mode: null });
  const analyze = async () => {
    if (busy) return;
    setBusy(true);
    set({ stage: "CLOSURE_PROCESSING" });
    const closure = await closureApi.analyze(s.closureText);
    set({ closure, stage: "CLOSURE_REVIEW" });
    setBusy(false);
  };
  const remove = (
    group: "completed" | "tomorrow" | "waiting" | "released" | "needsChoice",
    id: string,
  ) =>
    s.closure &&
    set({
      closure: {
        ...s.closure,
        [group]: s.closure[group].filter((item) => item.id !== id),
      },
    });
  const updateNextAction = (id: string, nextAction: string) =>
    s.closure &&
    set({
      closure: {
        ...s.closure,
        tomorrow: s.closure.tomorrow.map((item) =>
          item.id === id ? { ...item, nextAction } : item,
        ),
      },
    });
  const commitClosure = async () => {
    if (busy) return;
    setBusy(true);
    const scheduledFor = nextOccurrence(s.reminderTime);
    try {
      await saveRecord({
        id: crypto.randomUUID(),
        kind: "closure",
        createdAt: new Date().toISOString(),
        reminderTime: s.reminderTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        scheduledFor: scheduledFor.toISOString(),
        status: "scheduled",
        tomorrow: tomorrowItems,
        waiting: waitingItems,
      });
      if ("Notification" in window && Notification.permission === "default")
        void Notification.requestPermission();
    } catch {
      set({ dataNotice: "交接未写入 IndexedDB，但当前页面内容仍已保留。" });
    }
    set({ stage: "CLOSURE_COMMIT" });
    setBusy(false);
  };
  const startWind = () =>
    set({ stage: "WIND_DOWN", windDownEndsAt: Date.now() + 1800000 });
  const sealEmotion = async (
    retention: "reveal_tomorrow" | "release_tonight",
  ) => {
    if (busy) return;
    setBusy(true);
    const summary = retention === "reveal_tomorrow" ? await emotionApi.process(s.emotionText) : null;
    try {
      await saveRecord({
        id: crypto.randomUUID(),
        kind: "emotion",
        createdAt: new Date().toISOString(),
        revealAt: retention === "reveal_tomorrow" ? nextOccurrence(s.reminderTime).toISOString() : undefined,
        retention,
        summary,
        status: retention === "reveal_tomorrow" ? "sealed" : "released",
      });
    } catch {
      set({ dataNotice: "情绪瓶未写入 IndexedDB，但当前页面内容仍已保留。" });
    }
    set({
      emotionRetention: retention,
      emotionSummary: summary,
      emotionText: retention === "release_tonight" ? "" : s.emotionText,
      stage: "WIND_DOWN",
      windDownEndsAt: Date.now() + 1800000,
    });
    setBusy(false);
  };
  const openMorning = async () => {
    setBusy(true);
    try {
      const handoff = await loadMorningHandoff(new Date(), true);
      if (handoff.closure || handoff.emotion) {
        set({
          stage: "TOMORROW_DESK", mode: handoff.closure ? "closure" : "emotion", demoMorning: true,
          closure: handoff.closure ? { completed: [], tomorrow: handoff.closure.tomorrow, waiting: handoff.closure.waiting, released: [], needsChoice: [], closureMessage: "昨晚的交接已到达。" } : null,
          emotionRetention: handoff.emotion ? "reveal_tomorrow" : null,
          emotionSummary: handoff.emotion?.summary || null,
          dataNotice: "演示时间已推进到明早，数据来自 IndexedDB。",
        });
      } else {
        set({ stage: "TOMORROW_DESK", mode: "closure", demoMorning: true,
          closure: analyzeClosure(closureDemo), emotionRetention: "reveal_tomorrow",
          emotionSummary: summarizeEmotion(emotionDemo), dataNotice: "暂无昨晚记录，当前展示标注过的示例数据。" });
      }
    } finally { setBusy(false); }
  };
  const addCapture = () => {
    if (!capture.trim()) return;
    set({
      captures: [
        ...s.captures,
        {
          id: crypto.randomUUID(),
          text: capture.trim(),
          createdAt: Date.now(),
        },
      ],
    });
    setCapture("");
  };

  return (
    <div
      ref={root}
      className={`app stage-${s.stage.toLowerCase()} mode-${s.mode || "none"}`}
      style={{ "--sleep": sleep } as React.CSSProperties}
    >
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
      </div>
      <header>
        <button className="brand" onClick={reset} aria-label="重置并回到首页">
          LAST<i>30</i>
        </button>
        <div className="night-status">
          <b />
          <span>{status}</span>
        </div>
      </header>
      <main>
        {s.dataNotice && <div className="data-notice" role="status"><span>{s.dataNotice}</span><button onClick={() => set({ dataNotice: null })} aria-label="关闭提示"><X /></button></div>}
        {s.stage === "ENTRY" && (
          <EntryStage
            onChoose={(mode) =>
              set({
                mode,
                stage: mode === "closure" ? "CLOSURE_CAPTURE" : "EMOTION_READY",
              })
            }
            onMorning={openMorning}
          />
        )}
        {s.stage === "CLOSURE_CAPTURE" && (
          <section className="capture-stage stage-in">
            <Back onClick={goBack} />
            <h1>
              把今天摊开，
              <br />
              不必整理。
            </h1>
            <p className="lead">
              做完的、没做完的、正在等的，以及明天还要记住的。
            </p>
            <InputSwitch
              value={s.inputType}
              onChange={(inputType) => set({ inputType })}
            />
            {s.inputType === "text" ? (
              <WritingSurface
                value={s.closureText}
                onChange={(value) => set({ closureText: value })}
                onDemo={() => set({ closureText: closureDemo })}
                placeholder="今天首页写完了\n登录还有问题\n在等产品给最终文案……"
              />
            ) : (
              <VoiceCapture
                mode="closure"
                onTranscript={(text) =>
                  set({ closureText: text, inputType: "text" })
                }
              />
            )}
            <button
              className="primary"
              disabled={!s.closureText.trim() || busy}
              onClick={analyze}
            >
              整理今天 <ArrowRight />
            </button>
          </section>
        )}
        {s.stage === "CLOSURE_PROCESSING" && (
          <section className="processing stage-in">
            <div className="sorting-mark">
              <span />
              <span />
              <span />
            </div>
            <h2>
              正在分清什么已经结束，
              <br />
              什么值得交给明天。
            </h2>
            <p>不增加任务，只为每件事找到去处。</p>
          </section>
        )}
        {s.stage === "CLOSURE_REVIEW" && s.closure && (
          <section className="review stage-in">
            <Back onClick={() => set({ stage: "CLOSURE_CAPTURE" })} />
            <h1>
              今天，已经
              <br />
              整理完毕。
            </h1>
            <p className="review-summary">
              <strong>{s.closure.completed.length}</strong> 件完成 ·{" "}
              <strong>{tomorrowItems.length}</strong> 件留给明天 ·{" "}
              <strong>{waitingItems.length}</strong> 件等待中
            </p>
            <ClosureGroup
              icon={<Archive />}
              title="今天已经完成"
              tone="done"
              items={s.closure.completed.map((v) => ({
                id: v.id,
                text: v.summary,
              }))}
              onRemove={(id) => remove("completed", id)}
            />
            <ClosureGroup
              icon={<Sun />}
              title="真正留给明天"
              tone="tomorrow"
              items={s.closure.tomorrow.map((v) => ({
                id: v.id,
                text: v.normalizedText,
                detail: v.nextAction,
              }))}
              onRemove={(id) => remove("tomorrow", id)}
              onDetailChange={updateNextAction}
            />
            <ClosureGroup
              icon={<Clock3 />}
              title="正在等待"
              tone="waiting"
              items={s.closure.waiting.map((v) => ({
                id: v.id,
                text: v.normalizedText,
              }))}
              onRemove={(id) => remove("waiting", id)}
            />
            <ClosureGroup
              icon={<Moon />}
              title="今晚可以放下"
              tone="release"
              items={s.closure.released.map((v) => ({
                id: v.id,
                text: v.normalizedText,
              }))}
              onRemove={(id) => remove("released", id)}
            />
            {s.closure.needsChoice.length > 0 && (
              <ChoiceBlock
                items={s.closure.needsChoice}
                choices={s.choices}
                onChoose={(id, value) =>
                  set({ choices: { ...s.choices, [id]: value } })
                }
              />
            )}
            <ReminderPicker
              value={s.reminderTime}
              onChange={(reminderTime) => set({ reminderTime })}
            />
            <button
              className="primary"
              disabled={!choiceResolved || busy}
              onClick={commitClosure}
            >
              一键结束今天 <ArrowRight />
            </button>
          </section>
        )}
        {s.stage === "CLOSURE_COMMIT" && (
          <section className="commit stage-in">
            <div className="handover-stamp">
              <Check />
            </div>
            <h1>{s.closure?.closureMessage}</h1>
            <div className="commit-ledger">
              <span>
                <b>{archivedCount}</b> 已完成归档
              </span>
              <span>
                <b>{tomorrowItems.length}</b> 明天继续
              </span>
              <span>
                <b>{waitingItems.length}</b> 等待后续
              </span>
            </div>
            <p className="commit-reminder">
              <Clock3 /> 明早 {s.reminderTime} 查看交接
            </p>
            <button className="primary pale" onClick={startWind}>
              进入安静时间 <Moon />
            </button>
          </section>
        )}
        {s.stage === "EMOTION_READY" && (
          <section className="emotion-ready stage-in">
            <Back onClick={goBack} />
            <div className="bottle-visual" aria-hidden="true">
              <span />
              <i />
            </div>
            <h1>
              这里不急着
              <br />
              给出答案。
            </h1>
            <p className="lead">
              把想说的话留在这里。今晚只接住，不分析、不建议。
            </p>
            <button
              className="primary emotion"
              onClick={() => set({ stage: "EMOTION_CAPTURE" })}
            >
              打开情绪瓶 <ArrowRight />
            </button>
            <small className="privacy">
              <LockKeyhole /> 内容仅保存在这台设备
            </small>
          </section>
        )}
        {s.stage === "EMOTION_CAPTURE" && (
          <section className="emotion-capture stage-in">
            <Back onClick={() => set({ stage: "EMOTION_READY" })} />
            <h1>
              想说什么，
              <br />
              都可以。
            </h1>
            <InputSwitch
              value={s.inputType}
              onChange={(inputType) => set({ inputType })}
              emotion
            />
            {s.inputType === "text" ? (
              <WritingSurface
                value={s.emotionText}
                onChange={(value) => set({ emotionText: value })}
                onDemo={() => set({ emotionText: emotionDemo })}
                placeholder="不用完整，也不用解释。这里不会立即回应你。"
                emotion
              />
            ) : (
              <VoiceCapture
                mode="emotion"
                onTranscript={(text) =>
                  set({ emotionText: text, stage: "EMOTION_SEAL" })
                }
              />
            )}{" "}
            {s.inputType === "text" && (
              <button
                className="primary emotion"
                disabled={!s.emotionText.trim()}
                onClick={() => set({ stage: "EMOTION_SEAL" })}
              >
                说完了 <Check />
              </button>
            )}
          </section>
        )}
        {s.stage === "EMOTION_SEAL" && (
          <section className="emotion-seal stage-in">
            <div className="seal-mark">
              <LockKeyhole />
            </div>
            <h1>都放在这里了。</h1>
            <p className="lead">
              今晚不用再整理这些话。你决定它们是否来到明天。
            </p>
            <div className="seal-options">
              <button onClick={() => sealEmotion("reveal_tomorrow")}>
                <Eye />
                <span>
                  <b>明天让我看看</b>
                  <small>早上只显示简短事实整理</small>
                </span>
                <ArrowRight />
              </button>
              <button onClick={() => sealEmotion("release_tonight")}>
                <Trash2 />
                <span>
                  <b>就留在今晚</b>
                  <small>释放内容，不带到明天</small>
                </span>
                <ArrowRight />
              </button>
            </div>
            <p className="privacy-note">
              <LockKeyhole /> 原始录音不保存；选择“留在今晚”后不生成回顾。
            </p>
          </section>
        )}
        {s.stage === "WIND_DOWN" && (
          <section className="wind stage-in">
            <p className="wind-source">
              {s.mode === "emotion"
                ? "想说的话已经留在这里"
                : "明天的事情已经留下"}
            </p>
            <div className="timer" aria-label={`剩余 ${mins} 分 ${secs} 秒`}>
              {mins}
              <b>:</b>
              {secs}
            </div>
            <p>接下来的时间，不必再完成什么。</p>
            <div className="quick-capture">
              <input
                value={capture}
                onChange={(e) => setCapture(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCapture()}
                placeholder="突然想起一件事，留给明天……"
              />
              <button onClick={addCapture} aria-label="保存到明天">
                <Plus />
              </button>
            </div>
            {s.captures.length > 0 && (
              <small>{s.captures.length} 件新想法已留给明天</small>
            )}
            <button
              className="demo-link"
              onClick={() => set({ stage: "COMPLETE" })}
            >
              演示：结束倒计时
            </button>
          </section>
        )}
        {s.stage === "COMPLETE" && (
          <section className="complete stage-in">
            <Moon />
            <h1>今天结束了。</h1>
            <p>屏幕可以留在这里。明天的事，明天再打开。</p>
            <button
              className="morning-link"
              onClick={openMorning}
            >
              演示第二天早晨 <Sun />
            </button>
          </section>
        )}
        {s.stage === "TOMORROW_DESK" && (
          <TomorrowDesk
            s={s}
            tomorrowItems={tomorrowItems}
            onOpenBottle={() => set({ stage: "BOTTLE_REFLECTION" })}
            onReset={reset}
          />
        )}
        {s.stage === "BOTTLE_REFLECTION" && s.emotionSummary && (
          <Reflection
            summary={s.emotionSummary}
            onBack={() => set({ stage: "TOMORROW_DESK" })}
          />
        )}
      </main>
      <footer>
        <span>
          LAST30 / {s.mode === "emotion" ? "EMOTION BOTTLE" : "DAY CLOSURE"}
        </span>
        <span>LOCAL FIRST · DEMO</span>
      </footer>
    </div>
  );
}

function EntryStage({
  onChoose,
  onMorning,
}: {
  onChoose: (mode: "closure" | "emotion") => void;
  onMorning: () => void;
}) {
  return (
    <section className="entry stage-in">
      <div className="entry-copy">
        <h1>
          今天准备
          <br />
          结束了吗？
        </h1>
        <p className="lead">该行动的交给明天，只需表达的留在今晚。</p>
      </div>
      <div className="entry-routes">
        <button
          className="route closure-route"
          onClick={() => onChoose("closure")}
        >
          <span className="route-index">A</span>
          <div>
            <b>收尾今天的事情</b>
            <p>完成、未完、等待与明天的第一步</p>
          </div>
          <ArrowRight />
        </button>
        <button
          className="route emotion-route"
          onClick={() => onChoose("emotion")}
        >
          <span className="route-index">B</span>
          <div>
            <b>打开情绪宣泄瓶</b>
            <p>只是想把一些话安静地说出来</p>
          </div>
          <ArrowRight />
        </button>
      </div>
      <button className="morning-peek" onClick={onMorning}>
        <Sun /> 演示次日交接
      </button>
    </section>
  );
}
function Back({ onClick }: { onClick: () => void }) {
  return (
    <button className="back" onClick={onClick}>
      <ArrowLeft /> 返回
    </button>
  );
}
function InputSwitch({
  value,
  onChange,
  emotion = false,
}: {
  value: "text" | "voice";
  onChange: (value: "text" | "voice") => void;
  emotion?: boolean;
}) {
  return (
    <div className="input-switch">
      <button
        className={value === "text" ? "active" : ""}
        onClick={() => onChange("text")}
      >
        {emotion ? "写下来" : "文字"}
      </button>
      <button
        className={value === "voice" ? "active" : ""}
        onClick={() => onChange("voice")}
      >
        {emotion ? <Volume2 /> : <Mic />}
        {emotion ? "说出来" : "语音"}
      </button>
    </div>
  );
}
function WritingSurface({
  value,
  onChange,
  onDemo,
  placeholder,
  emotion = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onDemo: () => void;
  placeholder: string;
  emotion?: boolean;
}) {
  return (
    <div className={`writing-surface ${emotion ? "emotion-paper" : ""}`}>
      <textarea
        autoFocus
        value={value}
        maxLength={1200}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div>
        <button onClick={onDemo}>填入演示内容</button>
        <span>{value.length} / 1200</span>
      </div>
    </div>
  );
}
function ClosureGroup({
  icon,
  title,
  tone,
  items,
  onRemove,
  onDetailChange,
}: {
  icon: React.ReactNode;
  title: string;
  tone: string;
  items: { id: string; text: string; detail?: string }[];
  onRemove: (id: string) => void;
  onDetailChange?: (id: string, value: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className={`closure-group ${tone}`}>
      <div className="section-label">
        {icon}
        <span>{title}</span>
        <em>{items.length}</em>
      </div>
      {items.map((item) => (
        <div className="closure-row" key={item.id}>
          <Check />
          <div>
            <b>{item.text}</b>
            {item.detail && onDetailChange ? (
              <label className="next-action">
                <span>明天第一步</span>
                <input
                  value={item.detail}
                  onChange={(event) =>
                    onDetailChange(item.id, event.target.value)
                  }
                />
              </label>
            ) : (
              item.detail && <small>{item.detail}</small>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`移除 ${item.text}`}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
function ChoiceBlock({
  items,
  choices,
  onChoose,
}: {
  items: OpenLoop[];
  choices: AppSession["choices"];
  onChoose: (id: string, value: "tonight" | "tomorrow" | "waiting") => void;
}) {
  return (
    <div className="uncertain">
      <div className="section-label">
        <Sparkles />
        <span>需要你决定</span>
        <em>最多 2 项</em>
      </div>
      {items.map((item) => (
        <div className="question-row" key={item.id}>
          <p>{item.originalText}</p>
          <small>这件事的下一步不够明确</small>
          <div>
            {(
              [
                ["tonight", "已处理，归档"],
                ["tomorrow", "明天提醒"],
                ["waiting", "等待后续"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                className={choices[item.id] === value ? "active" : ""}
                onClick={() => onChoose(item.id, value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function ReminderPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="reminder">
      <div>
        <Clock3 />
        <span>明早提醒我查看</span>
      </div>
      <div className="time-presets">
        {["07:30", "08:00", "09:00"].map((time) => (
          <button
            key={time}
            className={value === time ? "active" : ""}
            onClick={() => onChange(time)}
          >
            {time}
          </button>
        ))}
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="自定义提醒时间"
        />
      </div>
      <small>
        {Intl.DateTimeFormat().resolvedOptions().timeZone} · 页面下次打开时检查
      </small>
    </div>
  );
}
function TomorrowDesk({
  s,
  tomorrowItems,
  onOpenBottle,
  onReset,
}: {
  s: AppSession;
  tomorrowItems: OpenLoop[];
  onOpenBottle: () => void;
  onReset: () => void;
}) {
  const items = [
    ...tomorrowItems,
    ...s.captures.map(
      (v) => ({ id: v.id, normalizedText: v.text }) as OpenLoop,
    ),
  ];
  return (
    <section className="tomorrow-desk stage-in">
      <p className="morning-time">
        {s.demoMorning ? "演示数据 · " : ""}早上好 · 昨晚的交接已到达
      </p>
      <h1>
        今天，只从
        <br />
        留下的地方开始。
      </h1>
      <div className="desk-grid">
        <div className="handoff-list">
          <div className="section-label">
            <Inbox />
            <span>昨晚留给今天</span>
            <em>{items.length} 件</em>
          </div>
          {items.map((item, i) => (
            <div className="morning-item" key={item.id}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <b>{item.normalizedText}</b>
                {item.nextAction && <small>下一步：{item.nextAction}</small>}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="empty-note">昨晚没有留下待办。今天可以从空白开始。</p>
          )}
        </div>
        {s.emotionRetention === "reveal_tomorrow" && s.emotionSummary && (
          <button className="bottle-ready" onClick={onOpenBottle}>
            <div>
              <FlaskConical />
              <span>昨晚的情绪瓶</span>
            </div>
            <b>可以打开了</b>
            <ArrowRight />
          </button>
        )}
      </div>
      <button className="reset-day" onClick={onReset}>
        <RotateCcw /> 完成演示，重新开始
      </button>
    </section>
  );
}
function Reflection({
  summary,
  onBack,
}: {
  summary: NonNullable<AppSession["emotionSummary"]>;
  onBack: () => void;
}) {
  return (
    <section className="reflection stage-in">
      <Back onClick={onBack} />
      <p className="morning-time">昨晚的情绪瓶</p>
      <h1>
        这是你昨晚
        <br />
        留下的轮廓。
      </h1>
      <div className="reflection-body">
        <div>
          <h2>你主要提到了</h2>
          <ul>
            {summary.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
        {summary.repeatedConcerns.length > 0 && (
          <div>
            <h2>反复出现的内容</h2>
            <p>你多次提到{summary.repeatedConcerns[0]}。</p>
          </div>
        )}
        <blockquote>{summary.conciseSummary}</blockquote>
      </div>
      <button className="primary morning" onClick={onBack}>
        回到今天 <Sun />
      </button>
    </section>
  );
}
