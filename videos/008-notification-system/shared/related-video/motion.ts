import {smoothProgress, type MotionProfile} from '@channel/motion-core';
import type {CardEntrance} from './types';
import {overlayTransitions} from '../overlay-transitions';

export const cardMotion = (timeMs: number, lastFrameMs: number, profile: MotionProfile, variant: CardEntrance) => {
  const {enterMs, exitMs} = overlayTransitions[profile];
  const enter = smoothProgress(timeMs, 0, enterMs);
  const exit = smoothProgress(timeMs, lastFrameMs - exitMs, lastFrameMs);
  const remaining = 1 - enter;
  const transforms = {
    side: `translateX(${-52 * remaining - 24 * exit}px)`,
    rise: `translateY(${48 * remaining + 24 * exit}px)`,
    focus: `scale(${1 - .06 * remaining - .03 * exit})`,
  } satisfies Record<CardEntrance, string>;
  return {opacity: enter * (1 - exit), transform: transforms[variant]};
};
