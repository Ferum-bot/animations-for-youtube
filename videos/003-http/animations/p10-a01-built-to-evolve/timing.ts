import anchors from '../../anchors.json';
import metadata from './animation.json';

export const finaleTiming = {
  startMs: anchors['p10-a01-built-to-evolve-start'],
  durationMs: metadata.durationMs,
};

export type FinaleAnchor = Extract<keyof typeof anchors, `p10-finale-${string}`>;
export const cue = (anchor: FinaleAnchor): number => anchors[anchor] - finaleTiming.startMs;
