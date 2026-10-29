import anchors from '../../anchors.json';
import {getFieldFocus, getTableTransition} from '../../shared/cue-transition';
import type {OutboxField} from './code';

export const scene = {
  startMs: anchors['outbox-start'],
  transactionMs: anchors['outbox-transaction'] - anchors['outbox-start'],
  relayMs: anchors['outbox-relay'] - anchors['outbox-start'],
  audioFile: 'generated/008-notification-system/p02-a02-outbox.wav',
};

const cueData = [
  {anchor: 'outbox-start', fields: []},
  {anchor: 'outbox-id', fields: ['id']},
  {anchor: 'outbox-notification-id', fields: ['notification-id']},
  {anchor: 'outbox-message', fields: ['topic', 'payload']},
  {anchor: 'outbox-system-fields', fields: ['created', 'published']},
  {anchor: 'outbox-transaction', fields: []},
  {anchor: 'outbox-transaction-boundary', fields: ['tx-begin', 'tx-commit']},
  {anchor: 'outbox-two-inserts', fields: ['insert-notification', 'insert-outbox']},
  {anchor: 'outbox-insert-notification', fields: ['insert-notification']},
  {anchor: 'outbox-insert-outbox', fields: ['insert-outbox']},
  {anchor: 'outbox-accepted', fields: ['tx-commit', 'accepted']},
  {anchor: 'outbox-relay', fields: []},
  {anchor: 'outbox-cycle', fields: ['cycle']},
  {anchor: 'outbox-select', fields: ['select']},
  {anchor: 'outbox-unpublished', fields: ['unpublished']},
  {anchor: 'outbox-skip-locked', fields: ['lock']},
  {anchor: 'outbox-relay-hold', fields: []},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly OutboxField[];
}[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));

export const getOutboxState = (timeMs: number) => {
  const transaction = getTableTransition(timeMs, scene.transactionMs);
  const relay = getTableTransition(timeMs, scene.relayMs);
  return {
    schemaOpacity: transaction.outgoingOpacity,
    transactionOpacity: transaction.incomingOpacity * relay.outgoingOpacity,
    relayOpacity: relay.incomingOpacity,
    fieldStrength: getFieldFocus<OutboxField>(cues, timeMs),
  };
};
