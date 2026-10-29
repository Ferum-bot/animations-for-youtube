import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {RetryFocus} from './topics';

export const scene = {
  startMs: anchors['retry-topics-start'],
  audioFile: 'generated/008-notification-system/p02-a07-retry-topics.wav',
};

const cueData = [
  {anchor: 'retry-topics-start', fields: []},
  {anchor: 'retry-topics-retries', fields: ['retries']},
  {anchor: 'retry-topics-dlq', fields: ['dlq']},
  {anchor: 'retry-topics-manual', fields: ['manual']},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly RetryFocus[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getRetryFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
