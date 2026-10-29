import anchors from '../../anchors.json';
import {getFieldFocus, getTableTransition} from '../../shared/cue-transition';
import type {TimerField} from './code';

export const scene = {
  startMs: anchors['timers-claim-start'],
  audioFile: 'generated/008-notification-system/p05-a01-timers-claim.wav',
};

const cueData = [
  {anchor: 'timers-claim-start', fields: []},
  {anchor: 'timers-claim-table', fields: ['table']},
  {anchor: 'timers-claim-day', fields: ['partition', 'range']},
  {anchor: 'timers-claim-minute', fields: ['minute']},
  {anchor: 'timers-claim-shards', fields: ['shards']},
  {anchor: 'timers-claim-range', fields: ['range']},
  {anchor: 'timers-claim-topic', fields: ['topic']},
  {anchor: 'timers-claim-workers', fields: ['shards']},
  {anchor: 'timers-claim-hold', fields: []},
  {anchor: 'timers-claim-transaction', fields: ['transaction']},
  {anchor: 'timers-claim-update', fields: ['claim']},
  {anchor: 'timers-claim-overdue', fields: ['overdue']},
  {anchor: 'timers-claim-lock', fields: ['lock']},
  {anchor: 'timers-claim-lease', fields: ['lease', 'claim']},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly TimerField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));

export const getTimerState = (timeMs: number) => ({
  ...getTableTransition(timeMs, anchors['timers-claim-switch'] - scene.startMs),
  fieldStrength: getFieldFocus<TimerField>(cues, timeMs),
});
