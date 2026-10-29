import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {SweeperField} from './query';

export const scene = {
  startMs: anchors['sweeper-start'],
  audioFile: 'generated/008-notification-system/p02-a08-sweeper.wav',
};

const cueData = [
  {anchor: 'sweeper-start', fields: []},
  {anchor: 'sweeper-cadence', fields: ['cadence']},
  {anchor: 'sweeper-table', fields: ['table']},
  {anchor: 'sweeper-accepted', fields: ['accepted']},
  {anchor: 'sweeper-attempts', fields: ['attempts']},
  {anchor: 'sweeper-sending', fields: ['sending']},
  {anchor: 'sweeper-timeout', fields: ['timeout']},
  {anchor: 'sweeper-duplicate', fields: ['duplicate']},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly SweeperField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getSweeperFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
