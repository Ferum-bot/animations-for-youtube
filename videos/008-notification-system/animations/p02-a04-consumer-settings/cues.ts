import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {ConsumerField} from './settings';

export const scene = {
  startMs: anchors['consumer-settings-start'],
  audioFile: 'generated/008-notification-system/p02-a04-consumer-settings.wav',
};

const cueData = [
  {anchor: 'consumer-settings-start', fields: []},
  {anchor: 'consumer-settings-manual-commit', fields: ['commit-note', 'manual-commit']},
  {anchor: 'consumer-settings-batch-size', fields: ['batch-size']},
  {anchor: 'consumer-settings-replay', fields: ['batch-note', 'batch-size']},
  {anchor: 'consumer-settings-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly ConsumerField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getConsumerFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
