import {chapterProgress, mix} from '../chapter-motion';

// A bounded gesture followed by a real hold. Milliseconds, never wall-clock time.
export const arrive = (timeMs: number, startMs: number, durationMs = 400): number =>
  chapterProgress(timeMs, startMs, startMs + durationMs);

export const presence = (timeMs: number, startMs: number, endMs: number, fadeMs = 180): number =>
  arrive(timeMs, startMs, fadeMs) * (1 - arrive(timeMs, endMs - fadeMs, fadeMs));

export {mix};
