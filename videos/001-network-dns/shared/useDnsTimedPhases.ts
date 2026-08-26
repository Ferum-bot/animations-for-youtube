import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {getActiveTimedPhaseIndex} from './getActiveTimedPhaseIndex';

type TimedPhase = {
  readonly startMs: number;
};

export const useDnsTimedPhases = <const Phases extends readonly [TimedPhase, ...TimedPhase[]]>(
  phases: Phases,
  transitionMs = 620,
) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const activeIndex = getActiveTimedPhaseIndex(phases, elapsedMs);
  const phase: Phases[number] = phases[activeIndex] ?? phases[0];
  const phaseProgress = smoothProgress(
    frame,
    msToFrames(phase.startMs, fps),
    msToFrames(phase.startMs + transitionMs, fps),
  );

  return {
    activeIndex,
    phase,
    phaseProgress,
    reveal: smoothProgress(frame, 4, 18),
    runtimeProgress: interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp),
  } as const;
};
