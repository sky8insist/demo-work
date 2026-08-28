import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Clock3, Feather, Sunrise } from "lucide-react";
import { resolveLoop } from "../mock/closureV3Engine";
import type { ClosureLoop, ClosureMapState, OpenReason, Resolution } from "../types";
import { ClosureCoverage } from "./ClosureCoverage";
import { ClosureMap } from "./ClosureMap";
import { NextActionPicker } from "./NextActionPicker";
import { OpenLoopCard } from "./OpenLoopCard";
import { OpenReasonPicker } from "./OpenReasonPicker";

const emptyMap = (): ClosureMapState => ({ done: [], tomorrow: [], waiting: [], release: [] });
const interviewKey = "last30_v3_closure_interview";
interface InterviewProgress { signature: string; map: ClosureMapState; cursor: number; reason: OpenReason | null; skipped: ClosureLoop[]; }
export function ClosureInterview({ loops, onComplete }: { loops: ClosureLoop[]; onComplete: (map: ClosureMapState, skipped: ClosureLoop[]) => void }) {
  const initialMap = useMemo(() => ({ ...emptyMap(), done: loops.filter((v) => v.resolution === "done") }), [loops]);
  const signature = useMemo(() => loops.map((v) => v.id).join("|"), [loops]);
  const restored = useMemo<InterviewProgress | null>(() => { try { const value = JSON.parse(sessionStorage.getItem(interviewKey) || "null") as InterviewProgress | null; return value?.signature === signature ? value : null; } catch { return null; } }, [signature]);
  const [map, setMap] = useState<ClosureMapState>(restored?.map || initialMap);
  const queue = useMemo(() => loops.filter((v) => v.resolution !== "done"), [loops]);
  const [cursor, setCursor] = useState(restored?.cursor || 0); const [reason, setReason] = useState<OpenReason | null>(restored?.reason || null);
  const [skipped, setSkipped] = useState<ClosureLoop[]>(restored?.skipped || []); const [moving, setMoving] = useState(false);
  const root = useRef<HTMLDivElement>(null); const completed = useRef(false); const current = queue[cursor];
  useEffect(() => { if (completed.current) return; try { sessionStorage.setItem(interviewKey, JSON.stringify({ signature, map, cursor, reason, skipped } satisfies InterviewProgress)); } catch { /* session persistence is best effort */ } }, [signature, map, cursor, reason, skipped]);
  const { contextSafe } = useGSAP(() => {}, { scope: root });
  const total = loops.length; const resolved = Object.values(map).flat().length;
  const transfer = contextSafe((lane: keyof ClosureMapState, commit: () => void) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { commit(); return; }
    const source = root.current?.querySelector<HTMLElement>(".open-loop-card");
    const target = root.current?.querySelector<HTMLElement>(`.map-${lane}`);
    if (!source || !target) { commit(); return; }
    const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
    const ghost = source.cloneNode(true) as HTMLElement; ghost.className = "closure-transfer-ghost"; ghost.setAttribute("aria-hidden", "true");
    Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` }); document.body.appendChild(ghost);
    gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => { ghost.remove(); commit(); } })
      .to(ghost, { scale: .94, duration: .18 })
      .to(ghost, { x: to.left - from.left, y: to.top - from.top, scale: Math.min(.42, to.width / from.width), autoAlpha: .18, filter: "blur(3px)", duration: .55 })
      .to(ghost, { autoAlpha: 0, duration: .12 });
  });
  const finishItem = (resolution: Resolution, extra?: Partial<ClosureLoop>) => {
    if (moving) return;
    const item = resolveLoop(current, reason || "other", resolution, extra);
    const lane = resolution === "done" ? "done" : resolution === "acknowledged" ? "release" : resolution;
    setMoving(true);
    transfer(lane, () => {
      const nextMap = { ...map, [lane]: [...map[lane], item] };
      setMap(nextMap); setReason(null); setMoving(false);
      if (cursor + 1 >= queue.length) { completed.current = true; sessionStorage.removeItem(interviewKey); onComplete(nextMap, skipped); } else setCursor((v) => v + 1);
    });
  };
  const skip = () => { if (moving) return; const item = { ...current, skipped: true }; const nextSkipped = [...skipped, item]; setSkipped(nextSkipped); setReason(null); if (cursor + 1 >= queue.length) { completed.current = true; sessionStorage.removeItem(interviewKey); onComplete(map, nextSkipped); } else setCursor((v) => v + 1); };
  const branch = () => {
    if (!reason) return <OpenReasonPicker onChoose={setReason} onSkip={skip} />;
    if (reason === "unclear_next_step") return <NextActionPicker loop={current} onChoose={(nextAction) => finishItem("tomorrow", { nextAction, reminderTime: "08:00" })} />;
    if (reason === "fear_of_forgetting") return <div className="branch-panel"><p>那今晚不需要继续记住它。什么时候交给明天？</p><div className="branch-options compact">{["08:00", "09:00", "只放到明天"].map((time) => <button key={time} onClick={() => finishItem("tomorrow", { reminderTime: time })}><Sunrise />{time}</button>)}</div></div>;
    if (reason === "waiting_for_external") return <div className="branch-panel"><p>那现在不是你的下一步。</p><div className="branch-options"><button onClick={() => finishItem("waiting")}><Clock3 />等对方回复</button><button onClick={() => finishItem("waiting", { reminderTime: "明天确认" })}><Clock3 />明天再确认一次</button></div></div>;
    if (reason === "uncertain_obligation") return <div className="branch-panel"><p>先不用把它变成任务。责任现在在谁手里？</p><div className="branch-options"><button onClick={() => finishItem("tomorrow", { nextAction: "明早确认是否需要我处理" })}><Sunrise />需要我确认一次</button><button onClick={() => finishItem("waiting")}><Clock3 />目前在别人手里</button><button onClick={() => finishItem("acknowledged")}><Feather />今晚不需要处理</button></div></div>;
    return <div className="branch-panel"><p>想到它，不代表今晚还要回应它。</p><button className="release-action" onClick={() => finishItem("acknowledged")}><Feather />允许它留在今晚</button></div>;
  };
  if (!current) return null;
  return <div ref={root} className={`closure-workbench ${moving ? "is-transferring" : ""}`}><div className="interview-pane"><ClosureCoverage resolved={resolved} total={total} /><OpenLoopCard loop={current} index={resolved} total={total} /><div key={`${current.id}-${reason || "reason"}`} className="branch-in">{branch()}</div></div><ClosureMap map={map} /></div>;
}
