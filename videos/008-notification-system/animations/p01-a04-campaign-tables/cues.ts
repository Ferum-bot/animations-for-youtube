import anchors from '../../anchors.json';
import {getFieldFocus, getTableTransition} from '../../shared/cue-transition';
import type {CampaignField} from './schema';

export const scene = {
  startMs: anchors['campaign-tables-start'],
  segmentStartMs: anchors['campaign-tables-segments'] - anchors['campaign-tables-start'],
  audioFile: 'generated/008-notification-system/p01-a04-campaign-tables.wav',
};

const cueData = [
  {anchor: 'campaign-tables-start', fields: []},
  {anchor: 'campaign-tables-id', fields: ['campaign-id']},
  {anchor: 'campaign-tables-segment-id', fields: ['campaign-segment']},
  {anchor: 'campaign-tables-message', fields: ['channel', 'template']},
  {anchor: 'campaign-tables-params', fields: ['params']},
  {anchor: 'campaign-tables-send-at', fields: ['send_at']},
  {anchor: 'campaign-tables-status', fields: ['status']},
  {anchor: 'campaign-tables-segments', fields: []},
  {anchor: 'campaign-tables-membership-id', fields: ['segment-id']},
  {anchor: 'campaign-tables-user', fields: ['segment-user']},
  {anchor: 'campaign-tables-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly CampaignField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));

export const getCampaignTableState = (timeMs: number) => ({
  ...getTableTransition(timeMs, scene.segmentStartMs),
  fieldStrength: getFieldFocus(cues, timeMs),
});
