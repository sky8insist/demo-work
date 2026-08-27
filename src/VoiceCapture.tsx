import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { mockTranscript, transcribeAudio } from "./api/transcriptionApi";
export default function VoiceCapture({
  mode,
  onTranscript,
}: {
  mode: "closure" | "emotion";
  onTranscript: (text: string) => void;
}) {
  const [recording, setRecording] = useState(false),
    [error, setError] = useState(""),
    [seconds, setSeconds] = useState(0),
    [processing, setProcessing] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    chunks = useRef<Blob[]>([]);
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);
  useEffect(
    () => () => stream.current?.getTracks().forEach((track) => track.stop()),
    [],
  );
  const start = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("当前浏览器不支持录音，请改用文字。");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      recorder.current = new MediaRecorder(stream.current);
      chunks.current = [];
      recorder.current.ondataavailable = (event) => event.data.size && chunks.current.push(event.data);
      recorder.current.onstop = async () => {
        setProcessing(true);
        try {
          const blob = new Blob(chunks.current, { type: recorder.current?.mimeType || "audio/webm" });
          onTranscript(await transcribeAudio(blob, mode));
        } catch {
          onTranscript(mockTranscript(mode));
        } finally {
          chunks.current = [];
          setProcessing(false);
        }
      };
      recorder.current.start();
      setSeconds(0);
      setRecording(true);
    } catch {
      setError("没有获得麦克风权限，请改用文字输入。");
    }
  };
  const stop = () => {
    recorder.current?.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };
  return (
    <div className={`voice-capture ${recording ? "is-recording" : ""}`}>
      {processing ? (
        <p className="voice-processing" role="status">正在生成模拟转写…</p>
      ) : recording ? (
        <>
          <div className="wave" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="recording-meta">
            <span>正在接住你的话</span>
            <b>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </b>
          </div>
          <button className="voice-stop" onClick={stop}>
            <Square /> 已完成
          </button>
        </>
      ) : (
        <div className="voice-actions">
          <button className="voice-start" onClick={start}><Mic /> 用语音说</button>
          <button className="voice-demo" onClick={() => onTranscript(mockTranscript(mode))}>模拟一段语音</button>
        </div>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
          <button onClick={() => setError("")}>知道了</button>
        </p>
      )}
      {!recording && !processing && <small>转写使用本地演示服务，原始录音不会保存。</small>}
    </div>
  );
}
