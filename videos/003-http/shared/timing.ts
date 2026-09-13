import {smoothProgress} from '@channel/motion-core';
import {useCurrentFrame, useVideoConfig} from 'remotion';

/** Persisted timings stay in milliseconds; frames enter only at this boundary. */
export const useTimeMs = (): number => {
  const {fps} = useVideoConfig();
  return useCurrentFrame() * 1000 / fps;
};

export const reveal = (timeMs: number, startMs: number, durationMs = 320): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);

export const visibility = (timeMs: number, durationMs: number): number =>
  reveal(timeMs, 0, 300) * (1 - reveal(timeMs, durationMs - 450, 416));

export type TimedState = {readonly startMs: number};

export const activeStateIndex = (states: readonly TimedState[], timeMs: number): number =>
  states.reduce((active, state, index) => timeMs >= state.startMs ? index : active, -1);

/** Consecutive explanations leave a brief clear interval for the eye. */
export const shotOpacity = (timeMs: number, startMs: number, endMs: number): number =>
  reveal(timeMs, startMs, 280) * (1 - reveal(timeMs, endMs - 330, 250));

export const flightOpacity = (timeMs: number, startMs: number, durationMs: number): number =>
  reveal(timeMs, startMs, 120) * (1 - reveal(timeMs, startMs + durationMs, 150));
