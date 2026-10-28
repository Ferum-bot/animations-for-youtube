import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {DeviceTokenField} from './schema';

export const scene = {
  startMs: anchors['device-tokens-start'],
  audioFile: 'generated/008-notification-system/p01-a02-device-tokens.wav',
};

const cueData = [
  {anchor: 'device-tokens-start', fields: []},
  {anchor: 'device-tokens-name', fields: ['table']},
  {anchor: 'device-tokens-user', fields: ['user_id']},
  {anchor: 'device-tokens-platform', fields: ['platform']},
  {anchor: 'device-tokens-token', fields: ['token']},
  {anchor: 'device-tokens-active', fields: ['active']},
  {anchor: 'device-tokens-last-seen', fields: ['last_seen']},
  {anchor: 'device-tokens-deactivate', fields: ['active']},
  {anchor: 'device-tokens-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly DeviceTokenField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));

export const getDeviceTokenFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
