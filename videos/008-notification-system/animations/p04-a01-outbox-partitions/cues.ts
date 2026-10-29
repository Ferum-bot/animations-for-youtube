import anchors from '../../anchors.json';
import {getFieldFocus, getTableTransition} from '../../shared/cue-transition';
import type {PartitionField} from './schema';

export const scene = {
  startMs: anchors['outbox-partitions-start'],
  audioFile: 'generated/008-notification-system/p04-a01-outbox-partitions.wav',
};

const cueData = [
  {anchor: 'outbox-partitions-start', fields: []},
  {anchor: 'outbox-partitions-parent', fields: ['parent']},
  {anchor: 'outbox-partitions-range', fields: ['range']},
  {anchor: 'outbox-partitions-day', fields: ['day']},
  {anchor: 'outbox-partitions-automation', fields: ['automation']},
  {anchor: 'outbox-partitions-cleanup', fields: ['cleanup']},
  {anchor: 'outbox-partitions-hold', fields: []},
  {anchor: 'outbox-partitions-retention', fields: ['cleanup']},
  {anchor: 'outbox-partitions-indexes', fields: ['indexes']},
  {anchor: 'outbox-partitions-clear', fields: ['cleanup']},
  {anchor: 'outbox-partitions-queries', fields: ['parent']},
  {anchor: 'outbox-partitions-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly PartitionField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));

export const getPartitionState = (timeMs: number) => {
  const toDaily = getTableTransition(timeMs, anchors['outbox-partitions-switch'] - scene.startMs);
  const toParent = getTableTransition(timeMs, anchors['outbox-partitions-return'] - scene.startMs);
  return {
    parentOpacity: toDaily.outgoingOpacity + toParent.incomingOpacity,
    dailyOpacity: toDaily.incomingOpacity * toParent.outgoingOpacity,
    fieldStrength: getFieldFocus(cues, timeMs),
  };
};
