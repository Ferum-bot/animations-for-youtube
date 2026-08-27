import {Easing, interpolate} from 'remotion';
import {clamp} from '@channel/motion-core';

export const progressBetween = (elapsedMs: number, startMs: number, endMs: number): number =>
  interpolate(elapsedMs, [startMs, endMs], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

export const sceneOpacity = (
  elapsedMs: number,
  startMs: number,
  endMs: number,
  fadeMs = 540,
): number => {
  const enter = progressBetween(elapsedMs, startMs, startMs + fadeMs);
  const exit = 1 - progressBetween(elapsedMs, endMs - fadeMs, endMs);
  return enter * exit;
};
