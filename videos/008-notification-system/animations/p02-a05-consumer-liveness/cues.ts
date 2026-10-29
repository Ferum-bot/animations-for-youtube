import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {LivenessField} from './settings';

export const scene = {
  startMs: anchors['consumer-liveness-start'],
  audioFile: 'generated/008-notification-system/p02-a05-consumer-liveness.wav',
};

// The voice introduces a list, then its descriptions; it does not enumerate
// individual settings. Keep the full list visible and focus those two groups.
const cueData = [
  {anchor: 'consumer-liveness-start', fields: []},
  {anchor: 'consumer-liveness-values', fields: ['setting']},
  {anchor: 'consumer-liveness-explanations', fields: ['explanation']},
  {anchor: 'consumer-liveness-resolved', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly LivenessField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getLivenessFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
