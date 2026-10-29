import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {ProducerField} from './settings';

export const scene = {
  startMs: anchors['producer-settings-start'],
  audioFile: 'generated/008-notification-system/p02-a01-producer-settings.wav',
};

const cueData = [
  {anchor: 'producer-settings-start', fields: []},
  {anchor: 'producer-settings-acks', fields: ['acks']},
  {anchor: 'producer-settings-idempotence', fields: ['idempotence']},
  {anchor: 'producer-settings-replication', fields: ['replication']},
  {anchor: 'producer-settings-min-isr', fields: ['min-isr']},
  {anchor: 'producer-settings-default', fields: ['default-isr']},
  {anchor: 'producer-settings-leader', fields: ['acks', 'default-isr']},
  {anchor: 'producer-settings-quorum', fields: ['min-isr']},
  {anchor: 'producer-settings-hold', fields: []},
  {anchor: 'producer-settings-durability', fields: ['acks', 'replication', 'min-isr']},
  {anchor: 'producer-settings-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly ProducerField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getProducerFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
