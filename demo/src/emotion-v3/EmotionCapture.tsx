import { Mic, Square, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useAmbientMusic } from "../ambient/AmbientMusicProvider";
import { emotionDemo } from "../mock/demoCases";
export function EmotionCapture({ value, onChange, onFinish }: { value: string; onChange: (value: string) => void; onFinish: () => void }) {
  const [mode, setMode] = useState<"text" | "voice">("text"); const [recording, setRecording] = useState(false); const [seconds, setSeconds] = useState(0); const music = useAmbientMusic();
  useEffect(() => { if (!recording) return; const id = window.setInterval(() => setSeconds((v) => v + 1), 1000); return () => clearInterval(id); }, [recording]);
  const startVoice = () => { setMode("voice"); setRecording(true); setSeconds(0); music.duck(); };
  const finishVoice = () => { setRecording(false); music.restore(); onChange(emotionDemo); };
  useEffect(() => () => music.restore(), [music]);
  return <div className="emotion-capture"><div className="capture-modes"><button className={mode === "text" ? "active" : ""} onClick={() => { if (recording) finishVoice(); setMode("text"); }}><Type />写下来</button><button className={mode === "voice" ? "active" : ""} onClick={startVoice}><Mic />说出来</button></div>{mode === "text" ? <div className="emotion-writing"><textarea autoFocus value={value} onChange={(e) => onChange(e.target.value)} placeholder="把想说的话留在这里。不用整理。" maxLength={1200}/><button onClick={() => onChange(emotionDemo)}>填入演示内容</button></div> : <div className={`voice-pour ${recording ? "active" : ""}`}><div className="voice-bars" aria-hidden="true">{Array.from({ length: 15 }, (_, i) => <i key={i}/>)}</div><p>{recording ? "瓶子在听" : "这段话已经进入瓶子"}</p>{recording && <b>{String(Math.floor(seconds / 60)).padStart(2,"0")}:{String(seconds % 60).padStart(2,"0")}</b>}<button onClick={recording ? finishVoice : startVoice}>{recording ? <Square /> : <Mic />}{recording ? "已完成" : "再说一段"}</button></div>}<button className="finish-expression" disabled={!value.trim()} onClick={onFinish}>说完了</button></div>;
}
