import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
export default function VoiceCapture({
  mode,
  onTranscript,
}: {
  mode: "closure" | "emotion";
  onTranscript: (text: string) => void;
}) {
  const [recording, setRecording] = useState(false),
    [error, setError] = useState(""),
    [seconds, setSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null);
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
    onTranscript(
      mode === "closure"
        ? "今天首页已经写完了\n登录还有问题\n在等产品给最终文案\n老师邮件还没回\n明早交周报"
        : "项目推进得不太顺，和同学沟通也有点累。明天的事情都挤在一起，我一直在想时间够不够。",
    );
  };
  return (
    <div className={`voice-capture ${recording ? "is-recording" : ""}`}>
      {recording ? (
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
        <button className="voice-start" onClick={start}>
          <Mic /> 用语音说
        </button>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
          <button onClick={() => setError("")}>知道了</button>
        </p>
      )}
      {!recording && <small>演示版使用示例转写，原始录音不会保存。</small>}
    </div>
  );
}
