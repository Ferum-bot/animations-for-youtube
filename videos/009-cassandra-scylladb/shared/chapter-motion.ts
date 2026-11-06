import {Easing, interpolate} from 'remotion';
import {clamp, type MotionProfile} from '@channel/motion-core';

const entranceSpeed: Readonly<Record<MotionProfile, number>> = {
  calm: 1,
  technical: 1.12,
  energetic: 1.25,
};

export const chapterEasing = {
  arrive: Easing.bezier(0.16, 1, 0.3, 1),
  transform: Easing.bezier(0.65, 0, 0.25, 1),
  leave: Easing.bezier(0.7, 0, 0.84, 0),
};

/** Milliseconds throughout. Entrance speed changes independently of the final hold/exit. */
export const chapterProgress = (
  timeMs: number,
  startMs: number,
  endMs: number,
  easing: (value: number) => number = chapterEasing.arrive,
): number => interpolate(timeMs, [startMs, endMs], [0, 1], {...clamp, easing});

export const entranceTime = (timeMs: number, profile: MotionProfile): number =>
  timeMs * entranceSpeed[profile];

export const mix = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;
