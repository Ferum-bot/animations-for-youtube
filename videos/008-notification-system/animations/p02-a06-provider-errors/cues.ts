import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {ErrorFocus} from './examples';

export const scene = {
  startMs: anchors['provider-errors-start'],
  audioFile: 'generated/008-notification-system/p02-a06-provider-errors.wav',
};

const cueData = [
  {anchor: 'provider-errors-start', fields: []},
  {anchor: 'provider-errors-retryable', fields: ['retryable']},
  {anchor: 'provider-errors-terminal', fields: ['terminal']},
  {anchor: 'provider-errors-backoff', fields: ['backoff']},
  {anchor: 'provider-errors-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly ErrorFocus[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getErrorFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
