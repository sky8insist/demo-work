import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, FlaskConical, LockKeyhole, Moon, RotateCcw, ShieldAlert, Sun } from "lucide-react";
import { AmbientMusicProvider, useAmbientMusic } from "./ambient/AmbientMusicProvider";
import { AmbientRecord } from "./ambient/AmbientRecord";
import { ClosureInterview } from "./closure-v3/ClosureInterview";
import { ClosureReceipt } from "./closure-v3/ClosureReceipt";
import { BottleFeedback } from "./emotion-v3/BottleFeedback";
import { BottleScene } from "./emotion-v3/BottleScene";
import { EmotionCapture } from "./emotion-v3/EmotionCapture";
import { EmotionEndMessage } from "./emotion-v3/EmotionEndMessage";
import { analyzeInput } from "./mock/closureV3Engine";
import { isBottleMorningCommand } from "./mock/commandParser";
import { closureDemo, closureDemoQuiet, closureDemoShort } from "./mock/demoCases";
import { createBottleMemory, detectMoodSignal, isHighDistress } from "./mock/emotionSignal";
import type { AppStage, BottleMemory, ClosureLoop, ClosureMapState, EntryMode } from "./types";
import "./ambient/ambientMusic.css";
import "./ambient/ambientRecordDrag.css";

gsap.registerPlugin(useGSAP);
const SESSION_KEY = "last30_v3_session";
const MEMORY_KEY = "last30_bottle_memory";
const emptyMap = (): ClosureMapState => ({ done: [], tomorrow: [], waiting: [], release: [] });
interface Session { stage: AppStage; mode: EntryMode | null; closureText: string; emotionText: string; loops: ClosureLoop[]; map: ClosureMapState; skipped: ClosureLoop[]; memory: BottleMemory | null; }
const initial: Session = { stage: "ENTRY", mode: null, closureText: "", emotionText: "", loops: [], map: emptyMap(), skipped: [], memory: null };
function loadSession(): Session { try { return { ...initial, ...JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}") }; } catch { return initial; } }
function loadMemory(): BottleMemory | null { try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || "null"); } catch { return null; } }

export default function App() { return <AmbientMusicProvider><Last30 /></AmbientMusicProvider>; }

function Last30() {
  const [session, setSession] = useState<Session>(loadSession); const [morningMemory, setMorningMemory] = useState<BottleMemory | null>(loadMemory); const [command, setCommand] = useState(""); const [windSeconds, setWindSeconds] = useState(30 * 60);
  const root = useRef<HTMLDivElement>(null); const music = useAmbientMusic();
  const patch = (next: Partial<Session>) => setSession((value) => ({ ...value, ...next }));
  useEffect(() => { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* demo remains usable */ } }, [session]);
  useEffect(() => { if (session.stage !== "WIND_DOWN") return; const id = window.setInterval(() => setWindSeconds((v) => Math.max(0, v - 1)), 1000); return () => clearInterval(id); }, [session.stage]);
  useGSAP(() => { const mm = gsap.matchMedia(); mm.add("(prefers-reduced-motion: no-preference)", () => { gsap.fromTo(".stage-in", { autoAlpha: .01, y: 22, clipPath: "inset(0 0 16% 0)" }, { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: .78, ease: "expo.out", clearProps: "transform,opacity,visibility,clipPath" }); }); return () => mm.revert(); }, { scope: root, dependencies: [session.stage], revertOnUpdate: true });
  const enter = (mode: EntryMode) => { music.play(); patch({ mode, stage: mode === "closure" ? "CLOSURE_CAPTURE" : "BOTTLE_CLOSED" }); };
  const analyze = () => { const loops = analyzeInput(session.closureText); patch({ loops, stage: "CLOSURE_EXTRACT" }); window.setTimeout(() => patch({ stage: "CLOSURE_INTERVIEW" }), 900); };
  const reset = () => { sessionStorage.removeItem(SESSION_KEY); setSession(initial); setWindSeconds(1800); };
  const status = session.stage === "ENTRY" ? "今晚尚未交接" : session.stage === "WIND_DOWN" ? "正在离线" : session.stage === "COMPLETE" ? "今晚已经结束" : session.stage === "MORNING" || session.stage === "BOTTLE_FEEDBACK" ? "次晨交接" : "正在收尾";
  const bottleState = session.stage === "BOTTLE_CLOSED" ? "closed" : session.stage === "BOTTLE_OPENING" ? "opening" : session.stage === "BOTTLE_SEAL" ? "sealing" : session.stage === "BOTTLE_LOCKED" ? "locked" : "open";
  const finishEmotion = () => { if (isHighDistress(session.emotionText)) return; patch({ stage: "BOTTLE_SEAL" }); const unlock = new Date(); unlock.setDate(unlock.getDate() + 1); unlock.setHours(8,0,0,0); const memory = createBottleMemory(session.emotionText, unlock.toISOString()); window.setTimeout(() => { localStorage.setItem(MEMORY_KEY, JSON.stringify(memory)); setMorningMemory(memory); patch({ memory, stage: "BOTTLE_LOCKED" }); }, 1050); };
  const goMorning = () => { setMorningMemory(loadMemory() || session.memory); patch({ stage: "MORNING" }); };
  return <div ref={root} className={`app-v3 mode-${session.mode || "none"} stage-${session.stage.toLowerCase()}`}>
    <div className="night-field" aria-hidden="true"><span/><span/><span/></div>
    <header className="app-header"><div className="wordmark-wrap"><button className="wordmark" onClick={reset} aria-label="Dayend，返回今晚首页" aria-describedby="dayend-note">Day<i>end</i></button><span className="wordmark-note" id="dayend-note" role="tooltip">收好未完的事，也安放没说完的话。</span></div><div className="status"><i/><span>{status}</span></div></header>
    <AmbientRecord />
    <main>
      {session.stage === "ENTRY" && <Entry onChoose={enter} onMorning={goMorning} />}
      {session.stage === "CLOSURE_CAPTURE" && <ClosureCapture value={session.closureText} onChange={(closureText) => patch({ closureText })} onAnalyze={analyze} onBack={() => patch({ stage: "ENTRY", mode: null })}/>}
      {session.stage === "CLOSURE_EXTRACT" && <section className="extract-stage stage-in"><div className="extract-mark"><i/><i/><i/></div><h1>把悬着的事情，<br/>一件件放下来。</h1><p>正在识别 open loops。不会替你增加任务。</p></section>}
      {session.stage === "CLOSURE_INTERVIEW" && <section className="interview-stage stage-in"><button className="back-button" onClick={() => patch({ stage: "CLOSURE_CAPTURE" })}><ArrowLeft/>返回重写</button><ClosureInterview loops={session.loops} onComplete={(map, skipped) => patch({ map, skipped, stage: "CLOSURE_RECEIPT" })}/></section>}
      {session.stage === "CLOSURE_RECEIPT" && <ClosureReceipt map={session.map} skipped={session.skipped.length} onEnd={() => patch({ stage: "WIND_DOWN" })}/>}
      {["BOTTLE_CLOSED","BOTTLE_OPENING","BOTTLE_CAPTURE","BOTTLE_SEAL","BOTTLE_LOCKED"].includes(session.stage) && <section className="bottle-stage stage-in">
        {session.stage === "BOTTLE_CLOSED" && <div className="bottle-intro"><button className="back-button" onClick={() => patch({ stage: "ENTRY", mode: null })}><ArrowLeft/>返回</button><h1>今晚想说的话，<br/>可以留在这里。</h1><p>不用整理，也不会在你说话时分析。</p></div>}
        <BottleScene state={bottleState} active={session.stage === "BOTTLE_CAPTURE"} onOpen={() => { patch({ stage: "BOTTLE_OPENING" }); window.setTimeout(() => patch({ stage: "BOTTLE_CAPTURE" }), 950); }}/>
        {session.stage === "BOTTLE_OPENING" && <p className="bottle-opening-copy">瓶口正在打开</p>}
        {session.stage === "BOTTLE_CAPTURE" && <EmotionCapture value={session.emotionText} onChange={(emotionText) => patch({ emotionText })} onFinish={finishEmotion}/>}
        {session.stage === "BOTTLE_CAPTURE" && isHighDistress(session.emotionText) && <div className="safety-message" role="alert"><ShieldAlert/><div><b>现在先不要独自留在这里。</b><p>如果你现在可能会伤害自己，请先联系当地紧急服务，或联系一个你信任且现在能陪在你身边的人。</p></div></div>}
        {session.stage === "BOTTLE_SEAL" && <div className="seal-copy"><p>这些话正在留在这里。</p></div>}
        {session.stage === "BOTTLE_LOCKED" && session.memory && <div className="locked-copy"><LockKeyhole/><EmotionEndMessage mood={session.memory.moodSignal === "high_distress" ? "neutral" : session.memory.moodSignal}/><p className="unlock-time">明早 08:00 解锁</p><button className="primary-action" onClick={() => patch({ stage: "WIND_DOWN" })}>进入安静时间 <ArrowRight/></button></div>}
      </section>}
      {session.stage === "WIND_DOWN" && <WindDown seconds={windSeconds} mode={session.mode} onFinish={() => patch({ stage: "COMPLETE" })}/>}
      {session.stage === "COMPLETE" && <section className="complete-stage stage-in"><Moon/><h1>今天结束了。</h1><p>屏幕可以留在这里。明天的事，明天再打开。</p><button className="morning-button" onClick={goMorning}>演示明天早晨 <Sun/></button></section>}
      {session.stage === "MORNING" && (
        <Morning map={session.map} memory={morningMemory} command={command} onCommand={setCommand} onBottle={() => patch({ stage: "BOTTLE_FEEDBACK" })} onReset={reset}/>
      )}
      {session.stage === "BOTTLE_FEEDBACK" && morningMemory && (
        <BottleFeedback memory={morningMemory} onBack={() => patch({ stage: "MORNING" })} onComplete={reset}/>
      )}
    </main>
    <footer className="app-footer"><span>DAYEND / {session.mode === "emotion" ? "EMOTION BOTTLE" : "DAY CLOSURE"}</span><span>LOCAL MOCK · V3</span></footer>
  </div>;
}

function Entry({ onChoose, onMorning }: { onChoose: (mode: EntryMode) => void; onMorning: () => void }) {
  return <section className="entry-stage stage-in"><div className="entry-copy"><p>{new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date())}</p><h1>把没结束的，<br/><em>安放在今晚。</em></h1><span>未完的事，找到去处；没说的话，留进瓶里。</span></div><div className="entry-paths"><button className="closure-path" onClick={() => onChoose("closure")}><span className="path-line"/><div><b>收尾今天</b><p>逐项关闭仍然悬着的事</p></div><ArrowRight/></button><button className="emotion-path" onClick={() => onChoose("emotion")}><FlaskConical/><div><b>打开情绪瓶</b><p>把想说的话安静倒进去</p></div><ArrowRight/></button></div><button className="demo-morning" onClick={onMorning}><Sun/>演示明天早晨</button></section>;
}

function ClosureCapture({ value, onChange, onAnalyze, onBack }: { value: string; onChange: (v:string)=>void; onAnalyze:()=>void; onBack:()=>void }) {
  const [caseIndex, setCaseIndex] = useState(0); const cases = useMemo(() => [closureDemo, closureDemoShort, closureDemoQuiet], []);
  return <section className="closure-capture stage-in"><button className="back-button" onClick={onBack}><ArrowLeft/>返回</button><div className="capture-heading"><h1>今天，还有什么<br/>没有真正结束？</h1><p>做完的、没做完的、正在等的，或者只是脑子里一直挂着的，都可以说。不用整理。</p></div><div className="sweep-sheet"><textarea autoFocus value={value} onChange={(e) => onChange(e.target.value)} placeholder="一件一行，或者直接写一段……"/><div><button onClick={() => { onChange(cases[caseIndex]); setCaseIndex((v) => (v + 1) % cases.length); }}>填入演示案例 {caseIndex + 1}/3</button><span>{value.length} / 1200</span></div></div><button className="primary-action" disabled={!value.trim()} onClick={onAnalyze}>开始逐项收尾 <ArrowRight/></button></section>;
}

function WindDown({ seconds, mode, onFinish }: { seconds:number; mode:EntryMode|null; onFinish:()=>void }) {
  const mins = String(Math.floor(seconds / 60)).padStart(2,"0"), secs = String(seconds % 60).padStart(2,"0");
  return <section className="wind-stage stage-in"><p>{mode === "emotion" ? "想说的话已经留在这里" : "明天的事情已经交给明天"}</p><div className="wind-clock"><span>{mins}</span><i>:</i><span>{secs}</span></div><h1>接下来的时间，<br/>不必再完成什么。</h1><button onClick={onFinish}>演示：结束倒计时</button></section>;
}

function Morning({ map, memory, command, onCommand, onBottle, onReset }: { map:ClosureMapState; memory:BottleMemory|null; command:string; onCommand:(v:string)=>void; onBottle:()=>void; onReset:()=>void }) {
  const tomorrow = map.tomorrow; const commandReady = isBottleMorningCommand(command);
  return <section className="morning-stage stage-in"><p className="morning-date"><Sun/>早上好 · 昨晚的交接已到达</p><h1>从最明确的<br/>一件事开始。</h1><div className="morning-grid"><article className="handoff"><header><span>昨晚留给今天</span><b>{tomorrow.length}</b></header>{tomorrow.length ? tomorrow.map((item, i) => <div key={item.id} className="handoff-item"><span>{String(i+1).padStart(2,"0")}</span><div><b>{item.summary}</b>{item.nextAction && <p>{item.nextAction}</p>}</div></div>) : <p className="morning-empty">昨晚没有留下待办。今天可以从空白开始。</p>}</article>{memory && <button className="morning-bottle" onClick={onBottle}><FlaskConical/><span>昨晚的情绪瓶</span><b>可以打开了</b><ArrowRight/></button>}</div><div className="command-unlock"><label htmlFor="morning-command">也可以直接告诉我</label><div><input id="morning-command" value={command} onChange={(e)=>onCommand(e.target.value)} placeholder="打开昨晚的瓶子"/><button disabled={!commandReady} onClick={onBottle}>打开</button></div></div><button className="reset-demo" onClick={onReset}><RotateCcw/>重新演示今晚</button></section>;
}
