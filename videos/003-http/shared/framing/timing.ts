import anchors from '../../anchors.json';
import boundary from '../../animations/p06-a01-message-boundary/animation.json';
import chunked from '../../animations/p06-a02-chunked-stream/animation.json';
import choice from '../../animations/p06-a03-framing-choice/animation.json';

export const framingScenes = {
  boundary: {startMs: anchors['p06-a01-message-boundary-start'], durationMs: boundary.durationMs},
  chunked: {startMs: anchors['p06-a02-chunked-stream-start'], durationMs: chunked.durationMs},
  choice: {startMs: anchors['p06-a03-framing-choice-start'], durationMs: choice.durationMs},
} as const;

type FramingAnchor = Extract<keyof typeof anchors, `p06-${string}`>;
export const cue = (scene: keyof typeof framingScenes, anchor: FramingAnchor): number =>
  anchors[anchor] - framingScenes[scene].startMs;
