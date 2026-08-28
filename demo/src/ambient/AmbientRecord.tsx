import { Grip, MoreHorizontal, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useAmbientMusic } from "./AmbientMusicProvider";
import { ambientTracks } from "./ambientTracks";
import { MusicNotes } from "./MusicNotes";
import { TrackPopover } from "./TrackPopover";

gsap.registerPlugin(Draggable);
const positionKey = "last30_music_position_v2";
const playerSize = 70;
const margin = 12;
const defaultRightInset = 136;
const defaultTop = 110;

function loadPosition() {
  try { return JSON.parse(localStorage.getItem(positionKey) || "null") as { x: number; y: number } | null; }
  catch { return null; }
}

export function AmbientRecord() {
  const music = useAmbientMusic();
  const [open, setOpen] = useState(false);
  const [edge, setEdge] = useState("");
  const root = useRef<HTMLElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const drag = useRef<Draggable | null>(null);
  const name = ambientTracks.find((item) => item.id === music.trackId)?.name;
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const save = (x: number, y: number) => { try { localStorage.setItem(positionKey, JSON.stringify({ x, y })); } catch { /* private mode */ } };
  const updateEdge = (x: number, y: number) => setEdge(`${x < 235 ? "near-left" : ""} ${y > window.innerHeight - 290 ? "near-bottom" : ""}`.trim());
  const moveTo = (x: number, y: number, animate = false) => {
    const node = root.current; if (!node) return;
    const nextX = clamp(x, margin, Math.max(margin, window.innerWidth - playerSize));
    const nextY = clamp(y, margin, Math.max(margin, window.innerHeight - playerSize));
    gsap.to(node, { x: nextX, y: nextY, duration: animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? .22 : 0, ease: "power2.out", overwrite: true });
    drag.current?.update(); updateEdge(nextX, nextY); save(nextX, nextY);
  };

  useGSAP(() => {
    const node = root.current, trigger = handle.current; if (!node || !trigger) return;
    const saved = loadPosition();
    moveTo(saved?.x ?? window.innerWidth - defaultRightInset, saved?.y ?? defaultTop);
    const instance = Draggable.create(node, {
      type: "x,y", trigger,
      bounds: { minX: margin, maxX: Math.max(margin, window.innerWidth - playerSize), minY: margin, maxY: Math.max(margin, window.innerHeight - playerSize) },
      edgeResistance: .86, cursor: "grabbing", onPress: () => setOpen(false),
      onDrag: function () { updateEdge(this.x, this.y); },
      onDragEnd: function () { updateEdge(this.x, this.y); save(this.x, this.y); },
    })[0];
    drag.current = instance;
    const onResize = () => {
      instance.applyBounds({ minX: margin, maxX: Math.max(margin, window.innerWidth - playerSize), minY: margin, maxY: Math.max(margin, window.innerHeight - playerSize) });
      moveTo(instance.x, instance.y);
    };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); instance.kill(); drag.current = null; };
  }, { scope: root });

  const nudge = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key]; if (!direction || !drag.current) return;
    event.preventDefault(); const step = event.shiftKey ? 24 : 10;
    moveTo(drag.current.x + direction[0] * step, drag.current.y + direction[1] * step, true);
  };

  return <aside ref={root} className={`ambient-record ${edge} ${music.isPlaying ? "is-playing" : "is-paused"}`} aria-label="环境音乐播放器">
    <MusicNotes />
    <button ref={handle} className="record-drag-handle" onKeyDown={nudge} aria-label="拖动音乐播放器；也可使用方向键移动"><Grip /></button>
    <button className="vinyl-button" onClick={music.toggle} aria-label={music.isPlaying ? `暂停${name}` : `播放${name}`}>
      <span className="vinyl"><i /></span><span className="play-state">{music.isPlaying ? <Pause /> : <Play />}</span>
    </button>
    <button className="track-trigger" onClick={() => setOpen((value) => !value)} aria-label="选择环境音乐" aria-expanded={open}><MoreHorizontal /></button>
    {open && <TrackPopover />}
  </aside>;
}
