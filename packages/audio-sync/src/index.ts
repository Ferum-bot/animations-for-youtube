import {msToFrames} from '@channel/motion-core';

export type TranscriptSegment = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
};

export type VideoAnchors = Record<string, number>;

export type AnimationCue = {
  id: string;
  animation: string;
  anchor: string;
  offsetMs: number;
  durationMs: number;
  props: Record<string, unknown>;
};

export type ResolvedCue = AnimationCue & {
  fromFrame: number;
  durationInFrames: number;
};

export const resolveCue = (
  cue: AnimationCue,
  anchors: VideoAnchors,
  fps: number,
): ResolvedCue => {
  const anchorMs = anchors[cue.anchor];
  if (anchorMs === undefined) {
    throw new Error(`Timeline cue "${cue.id}" uses missing anchor "${cue.anchor}"`);
  }

  return {
    ...cue,
    fromFrame: Math.max(0, msToFrames(anchorMs + cue.offsetMs, fps)),
    durationInFrames: Math.max(1, msToFrames(cue.durationMs, fps)),
  };
};

export const resolveTimeline = (
  cues: AnimationCue[],
  anchors: VideoAnchors,
  fps: number,
): ResolvedCue[] => cues.map((cue) => resolveCue(cue, anchors, fps));

