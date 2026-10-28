import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {QueryField} from './query';

export const scene = {
  startMs: anchors['scheduled-query-start'],
  audioFile: 'generated/008-notification-system/p01-a03-scheduled-query.wav',
};

const cueData = [
  {anchor: 'scheduled-query-start', fields: []},
  {anchor: 'scheduled-query-select', fields: ['select']},
  {anchor: 'scheduled-query-status', fields: ['status']},
  {anchor: 'scheduled-query-due', fields: ['send_at']},
  {anchor: 'scheduled-query-limit', fields: ['limit']},
  {anchor: 'scheduled-query-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly QueryField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getScheduledQueryFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
