import {msToFrames, smoothProgress} from '@channel/motion-core';
import type {MotionProfile} from '@channel/motion-core';
import type {WaitingClockPlayback} from './types';

type ClockTiming = {
  readonly cycleMs: number;
  readonly enterMs: number;
  readonly exitMs: number;
};

const clockTimings = {
  calm: {cycleMs: 3000, enterMs: 300, exitMs: 400},
  technical: {cycleMs: 2400, enterMs: 267, exitMs: 333},
  energetic: {cycleMs: 1500, enterMs: 200, exitMs: 267},
} as const satisfies Readonly<Record<MotionProfile, ClockTiming>>;

/** A whole number of frames keeps the loop seam at exactly one angular step. */
export const clockCycleFrames = (motionProfile: MotionProfile, fps: number): number =>
  Math.max(1, msToFrames(clockTimings[motionProfile].cycleMs, fps));

export const getClockMotion = ({
  frame,
  fps,
  durationInFrames,
  motionProfile,
  mode,
}: {
  readonly frame: number;
  readonly fps: number;
  readonly durationInFrames: number;
  readonly motionProfile: MotionProfile;
  readonly mode: WaitingClockPlayback['mode'];
}) => {
  const cycleFrames = clockCycleFrames(motionProfile, fps);
  const phase = ((frame % cycleFrames) + cycleFrames) % cycleFrames;
  const angleDegrees = (60 + (phase / cycleFrames) * 360) % 360;

  if (mode === 'loop') return {angleDegrees, opacity: 1, translateY: 0};
  if (durationInFrames <= 2) return {angleDegrees, opacity: 0, translateY: 0};

  const timing = clockTimings[motionProfile];
  const lastFrame = durationInFrames - 1;
  const enterFrames = Math.min(Math.max(1, msToFrames(timing.enterMs, fps)), Math.floor(lastFrame / 2));
  const exitFrames = Math.min(Math.max(1, msToFrames(timing.exitMs, fps)), lastFrame - enterFrames);
  const enter = smoothProgress(frame, 0, enterFrames);
  const exit = smoothProgress(frame, lastFrame - exitFrames, lastFrame);

  return {
    angleDegrees,
    opacity: enter * (1 - exit),
    translateY: -8 * (1 - enter + exit),
  };
};
