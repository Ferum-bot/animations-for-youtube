import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {CapacityField} from './capacity';

export const scene = {
  startMs: anchors['capacity-table-start'],
  audioFile: 'generated/008-notification-system/p03-a03-capacity-table.wav',
};

const cueData = [
  {anchor: 'capacity-table-start', fields: []},
  {anchor: 'capacity-table-peak', fields: ['peak']},
  {anchor: 'capacity-table-call-time', fields: ['callTime']},
  {anchor: 'capacity-table-in-flight', fields: ['inFlight']},
  {anchor: 'capacity-table-parallelism', fields: ['parallelism']},
  {anchor: 'capacity-table-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly CapacityField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getCapacityFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
