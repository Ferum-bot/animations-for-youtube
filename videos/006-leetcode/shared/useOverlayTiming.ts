import {useCurrentFrame, useVideoConfig} from 'remotion';
import {smoothProgress, type MotionProfile} from '@channel/motion-core';

const transitions = {
  calm: {enterMs: 400, exitMs: 500},
  technical: {enterMs: 300, exitMs: 400},
  energetic: {enterMs: 200, exitMs: 300},
} as const satisfies Record<MotionProfile, {readonly enterMs: number; readonly exitMs: number}>;

export const useOverlayTiming = (durationMs: number, profile: MotionProfile) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeMs = frame * 1000 / fps;
  const timing = transitions[profile];
  const enter = smoothProgress(timeMs, 0, timing.enterMs);
  const lastMs = (Math.round(durationMs * fps / 1000) - 1) * 1000 / fps;
  const exit = smoothProgress(timeMs, lastMs - timing.exitMs, lastMs);
  return {timeMs, opacity: enter * (1 - exit), offsetY: (1 - enter) * 12 - exit * 6};
};
