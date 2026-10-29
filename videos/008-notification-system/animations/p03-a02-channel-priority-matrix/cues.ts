import anchors from '../../anchors.json';
import {getFieldFocus} from '../../shared/cue-transition';
import type {MatrixFocus} from './matrix';

export const scene = {
  startMs: anchors['channel-priority-matrix-start'],
  audioFile: 'generated/008-notification-system/p03-a02-channel-priority-matrix.wav',
};

const cueData = [
  {anchor: 'channel-priority-matrix-start', fields: []},
  {anchor: 'channel-priority-matrix-push-topic', fields: ['pushTopic']},
  {anchor: 'channel-priority-matrix-push-workers', fields: ['pushWorkers']},
  {anchor: 'channel-priority-matrix-overview', fields: []},
  {anchor: 'channel-priority-matrix-email', fields: ['emailSlow']},
  {anchor: 'channel-priority-matrix-push-isolated', fields: ['emailSlow', 'pushRow']},
  {anchor: 'channel-priority-matrix-sms-otp', fields: ['smsOtp']},
  {anchor: 'channel-priority-matrix-sms-bulk', fields: ['smsOtp', 'smsBulk']},
  {anchor: 'channel-priority-matrix-senders', fields: ['senders']},
  {anchor: 'channel-priority-matrix-total', fields: ['total']},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly MatrixFocus[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
export const getMatrixFocus = (timeMs: number) => getFieldFocus(cues, timeMs);
