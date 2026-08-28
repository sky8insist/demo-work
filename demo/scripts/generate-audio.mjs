import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const rate = 8000, seconds = 24, samples = rate * seconds;
function wav(name, sample) {
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write("RIFF", 0); buffer.writeUInt32LE(36 + samples * 2, 4); buffer.write("WAVE", 8);
  buffer.write("fmt ", 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36); buffer.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) buffer.writeInt16LE(Math.max(-32767, Math.min(32767, sample(i / rate, i) * 32767)), 44 + i * 2);
  writeFileSync(resolve("public/audio", name), buffer);
}
mkdirSync(resolve("public/audio"), { recursive: true });
const fade = (t) => Math.min(1, t * 1.5, (seconds - t) * 1.5);
wav("night-light.wav", (t) => fade(t) * (.035 * Math.sin(2*Math.PI*110*t) + .022 * Math.sin(2*Math.PI*164.81*t) + .014 * Math.sin(2*Math.PI*220*t)) * (.72 + .28*Math.sin(2*Math.PI*t/8)));
wav("quiet-piano.wav", (t) => { const beat = t % 4, env = Math.exp(-beat * 1.7); return fade(t) * env * (.07*Math.sin(2*Math.PI*130.81*t) + .045*Math.sin(2*Math.PI*196*t) + .025*Math.sin(2*Math.PI*261.63*t)); });
let seed = 1337; const noise = () => ((seed = (seed * 16807) % 2147483647) / 1073741824 - 1);
let smooth = 0; wav("soft-rain.wav", (t) => { smooth = smooth * .82 + noise() * .18; const distant = Math.sin(2*Math.PI*.09*t) * .008; return fade(t) * (smooth * .045 + distant); });
