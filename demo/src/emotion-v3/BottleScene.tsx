import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LiquidWave } from "./LiquidWave";
export function BottleScene({ state, active = false, onOpen }: { state: "closed" | "opening" | "open" | "sealing" | "locked"; active?: boolean; onOpen?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (state === "opening") gsap.timeline({ defaults: { ease: "expo.out" } }).to(".bottle-cap", { y: -70, rotation: 9, duration: .78 }).to(".bottle-body", { scale: 1.035, duration: .7 }, "<.08").fromTo(".liquid-wave", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .6 }, "<.18");
      if (state === "sealing") gsap.timeline({ defaults: { ease: "power3.inOut" } }).to(".liquid-wave", { scaleY: .94, duration: .5 }).to(".bottle-cap", { y: 0, rotation: 0, duration: .78 }, "<.12").to(".bottle-body", { scale: .92, duration: .6 }, "<.2");
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [state], revertOnUpdate: true });
  const closed = state === "closed";
  return <div ref={root} className={`bottle-scene state-${state}`}><button className="bottle-object" onClick={closed ? onOpen : undefined} aria-label={closed ? "打开情绪瓶" : undefined} disabled={!closed}><span className="bottle-cap"><i /><i /><i /></span><span className="bottle-neck"/><span className="bottle-body"><LiquidWave active={active}/><span className="bottle-glint"/><span className="bottle-label">LAST<br/><b>30</b></span></span></button>{closed && <span className="open-whisper">轻触瓶盖打开</span>}</div>;
}
