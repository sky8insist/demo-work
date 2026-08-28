import { Check, Volume1 } from "lucide-react";
import { ambientTracks } from "./ambientTracks";
import { useAmbientMusic } from "./AmbientMusicProvider";
export function TrackPopover() {
  const music = useAmbientMusic();
  return <div className="track-popover" role="dialog" aria-label="环境音乐设置">
    <div className="track-list">{ambientTracks.map((track) => <button key={track.id} onClick={() => music.selectTrack(track.id)}>{music.trackId === track.id ? <Check /> : <span />} {track.name}</button>)}</div>
    <label><Volume1 /><span className="sr-only">音量</span><input type="range" min="0" max="0.45" step="0.01" value={music.volume} onChange={(e) => music.setVolume(Number(e.target.value))} /></label>
  </div>;
}
