import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {PreferenceField} from './schema';

export const scene = {
  startMs: anchors['preferences-start'],
  audioFile: 'generated/008-notification-system/p01-a05-preferences.wav',
};

const cueData = [
  {anchor: 'preferences-start', fields: []},
  {anchor: 'preferences-name', fields: ['table']},
  {anchor: 'preferences-definition', fields: []},
  {anchor: 'preferences-user', fields: ['user_id']},
  {anchor: 'preferences-options', fields: ['options']},
  {anchor: 'preferences-quiet', fields: ['quiet_opt']},
  {anchor: 'preferences-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly PreferenceField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getPreferenceFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
