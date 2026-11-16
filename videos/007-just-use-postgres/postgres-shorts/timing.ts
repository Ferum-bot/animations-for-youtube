import clips from './clips.json';

export type Clip = (typeof clips)[number];
export const clipByNumber = (number: number): Clip => {
  const clip = clips.find((item) => item.number === number);
  if (!clip) throw new Error(`Unknown vertical clip ${number}`);
  return clip;
};
export const bodyDuration = (clip: Clip) =>
  clip.cuts.reduce((sum, cut) => sum + cut.endMs - cut.startMs, 0);

/** All semantic cues use published-video time. A splice cannot silently shift later cues. */
export function sourceSeconds(clip: Clip, elapsedMs: number): number {
  let remaining = elapsedMs;
  for (const cut of clip.cuts) {
    const duration = cut.endMs - cut.startMs;
    if (remaining < duration) return (cut.startMs + remaining) / 1000;
    remaining -= duration;
  }
  return (clip.cuts.at(-1)?.endMs ?? 0) / 1000;
}
