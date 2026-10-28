import anchors from '../../anchors.json';
import {getCueTransition, getTableTransition} from '../../shared/cue-transition';
import type {FieldName, NotificationField, UserField} from './schema';

type Focus =
  | {readonly table: 'users'; readonly fields: readonly UserField[]}
  | {readonly table: 'notifications'; readonly fields: readonly NotificationField[]};

type Cue = Focus & {
  readonly anchor: keyof typeof anchors;
};

export const scene = {
  startMs: anchors['schema-start'],
  notificationStartMs: anchors['schema-notifications'] - anchors['schema-start'],
  audioFile: 'generated/008-notification-system/p01-a01-database-schema.wav',
};

const cueData = [
  {anchor: 'schema-start', table: 'users', fields: []},
  {anchor: 'schema-users', table: 'users', fields: ['id', 'email', 'phone', 'timezone']},
  {anchor: 'schema-notifications', table: 'notifications', fields: []},
  {anchor: 'schema-id', table: 'notifications', fields: ['id']},
  {anchor: 'schema-uuid', table: 'notifications', fields: ['id']},
  {anchor: 'schema-user-id', table: 'notifications', fields: ['user_id']},
  {anchor: 'schema-channel', table: 'notifications', fields: ['channel']},
  {anchor: 'schema-category', table: 'notifications', fields: ['category']},
  {anchor: 'schema-priority', table: 'notifications', fields: ['priority']},
  {anchor: 'schema-template', table: 'notifications', fields: ['template']},
  {anchor: 'schema-params', table: 'notifications', fields: ['params']},
  {anchor: 'schema-normalization', table: 'notifications', fields: ['template', 'params']},
  {anchor: 'schema-status', table: 'notifications', fields: ['status']},
  {anchor: 'schema-times', table: 'notifications', fields: ['send_at', 'created_at', 'updated_at']},
  {anchor: 'schema-provider', table: 'notifications', fields: ['provider_msg_id', 'provider_meta']},
  {anchor: 'schema-resolved', table: 'notifications', fields: []},
] as const satisfies readonly Cue[];

const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));
type TimedCue = typeof cues[number];

export const getSchemaState = (timeMs: number) => {
  const {active, previous, mix} = getCueTransition(cues, timeMs);
  const transition = getTableTransition(timeMs, scene.notificationStartMs);
  const matches = (cue: TimedCue, table: Focus['table'], field: FieldName) =>
    cue.table === table && cue.fields.some((name) => name === field) ? 1 : 0;

  return {
    fieldStrength: (table: Focus['table'], field: FieldName) =>
      matches(previous, table, field) * (1 - mix) + matches(active, table, field) * mix,
    usersOpacity: transition.outgoingOpacity,
    notificationsOpacity: transition.incomingOpacity,
  };
};
