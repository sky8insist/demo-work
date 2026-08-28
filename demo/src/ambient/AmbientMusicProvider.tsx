import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ambientTracks, type AmbientTrackId } from "./ambientTracks";

interface MusicSettings { trackId: AmbientTrackId; volume: number; enabled: boolean; }
interface AmbientMusicContextValue extends MusicSettings {
  isPlaying: boolean; play(): void; pause(): void; toggle(): void;
  selectTrack(id: AmbientTrackId): void; setVolume(value: number): void; duck(): void; restore(): void;
}
const key = "last30_music_settings";
const defaults: MusicSettings = { trackId: "night-light", volume: 0.22, enabled: true };
const AmbientMusicContext = createContext<AmbientMusicContextValue | null>(null);
function loadSettings(): MusicSettings {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return defaults; }
}
export function AmbientMusicProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);
  const [isPlaying, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousVolume = useRef(settings.volume);
  const fadeFrame = useRef<number | null>(null);
  const track = ambientTracks.find((item) => item.id === settings.trackId) || ambientTracks[0];
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(settings)); } catch { /* private mode */ } }, [settings]);
  useEffect(() => () => { if (fadeFrame.current) cancelAnimationFrame(fadeFrame.current); }, []);
  const fadeTo = useCallback((target: number, duration: number, onDone?: () => void) => {
    const audio = audioRef.current; if (!audio) return;
    if (fadeFrame.current) cancelAnimationFrame(fadeFrame.current);
    const start = audio.volume, began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / duration);
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * p));
      if (p < 1) fadeFrame.current = requestAnimationFrame(tick); else onDone?.();
    };
    fadeFrame.current = requestAnimationFrame(tick);
  }, []);
  const play = useCallback(() => {
    const audio = audioRef.current; if (!audio || !settings.enabled) return;
    audio.volume = 0;
    void audio.play().then(() => { setPlaying(true); fadeTo(settings.volume, 1000); }).catch(() => setPlaying(false));
  }, [fadeTo, settings.enabled, settings.volume]);
  const pause = useCallback(() => {
    const audio = audioRef.current; if (!audio) return;
    fadeTo(0, 600, () => { audio.pause(); setPlaying(false); });
  }, [fadeTo]);
  const toggle = useCallback(() => isPlaying ? pause() : play(), [isPlaying, pause, play]);
  const selectTrack = useCallback((trackId: AmbientTrackId) => {
    const wasPlaying = isPlaying; setSettings((v) => ({ ...v, trackId }));
    requestAnimationFrame(() => { audioRef.current?.load(); if (wasPlaying) play(); });
  }, [isPlaying, play]);
  const setVolume = useCallback((volume: number) => { setSettings((v) => ({ ...v, volume })); if (audioRef.current && isPlaying) audioRef.current.volume = volume; }, [isPlaying]);
  const duck = useCallback(() => { previousVolume.current = settings.volume; if (audioRef.current && isPlaying) fadeTo(0.04, 350); }, [fadeTo, isPlaying, settings.volume]);
  const restore = useCallback(() => { if (audioRef.current && isPlaying) fadeTo(previousVolume.current, 500); }, [fadeTo, isPlaying]);
  const value = useMemo(() => ({ ...settings, isPlaying, play, pause, toggle, selectTrack, setVolume, duck, restore }), [settings, isPlaying, play, pause, toggle, selectTrack, setVolume, duck, restore]);
  return <AmbientMusicContext.Provider value={value}><audio ref={audioRef} src={track.src} loop preload="auto" />{children}</AmbientMusicContext.Provider>;
}
export function useAmbientMusic() { const value = useContext(AmbientMusicContext); if (!value) throw new Error("AmbientMusicProvider is missing"); return value; }
