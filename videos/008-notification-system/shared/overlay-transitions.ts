import type {MotionProfile} from '@channel/motion-core';

export const overlayTransitions = {
  calm: {enterMs: 400, exitMs: 500},
  technical: {enterMs: 300, exitMs: 400},
  energetic: {enterMs: 200, exitMs: 300},
} as const satisfies Record<MotionProfile, {readonly enterMs: number; readonly exitMs: number}>;
