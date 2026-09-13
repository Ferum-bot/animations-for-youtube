import anchors from '../../anchors.json';
import metadata from './animation.json';

export const anatomyScene = {startMs: anchors['p02-anatomy-start'], durationMs: metadata.durationMs} as const;
type Anchor = Extract<keyof typeof anchors, `p02-anatomy-${string}`>;
const relative = (anchor: Anchor): number => anchors[anchor] - anatomyScene.startMs;
export const cues = {
  version: relative('p02-anatomy-version'), later: relative('p02-anatomy-later'),
  anatomy: relative('p02-anatomy-anatomy'), startLine: relative('p02-anatomy-start-line'),
  headers: relative('p02-anatomy-headers'), blank: relative('p02-anatomy-blank-line'),
  body: relative('p02-anatomy-body'), separator: relative('p02-anatomy-separator'),
  compare: relative('p02-anatomy-compare'), isolate: relative('p02-anatomy-isolate-line'),
  method: relative('p02-anatomy-method'), target: relative('p02-anatomy-target'),
  requestVersion: relative('p02-anatomy-request-version'), response: relative('p02-anatomy-response'),
  responseVersion: relative('p02-anatomy-response-version'), status: relative('p02-anatomy-status'),
  reason: relative('p02-anatomy-reason'),
} as const;
