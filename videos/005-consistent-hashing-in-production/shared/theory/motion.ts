import {smoothProgress} from '@channel/motion-core';

export const progress = (timeMs: number, startMs: number, durationMs = 650): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
export const mix = (from: number, to: number, amount: number): number => from + (to - from) * amount;
