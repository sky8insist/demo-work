const audioAsset = (name: string) => `${import.meta.env.BASE_URL}audio/${name}.wav`;
export const ambientTracks = [
  { id: "night-light", name: "夜晚微光", src: audioAsset("night-light") },
  { id: "quiet-piano", name: "安静钢琴", src: audioAsset("quiet-piano") },
  { id: "soft-rain", name: "雨夜", src: audioAsset("soft-rain") },
] as const;
export type AmbientTrackId = (typeof ambientTracks)[number]["id"];
