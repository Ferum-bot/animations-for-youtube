import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {ClaimField} from './query';

export const scene = {
  startMs: anchors['postgres-queue-start'],
  audioFile: 'generated/008-notification-system/p02-a03-postgres-queue.wav',
};

const cueData = [
  {anchor: 'postgres-queue-start', fields: []},
  {anchor: 'postgres-queue-skip-locked', fields: ['lock']},
  {anchor: 'postgres-queue-one-system', fields: ['table']},
  {anchor: 'postgres-queue-atomic-claim', fields: ['claim', 'return']},
  {anchor: 'postgres-queue-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly ClaimField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getClaimFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
