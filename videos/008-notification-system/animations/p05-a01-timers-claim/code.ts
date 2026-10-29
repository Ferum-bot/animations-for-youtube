import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 36; UUID matches the episode's narrated notification identifiers.
// The application derives due_minute and the stable shard before inserting.
// Minute-sized partition bounds follow the user's latest correction.
export const timersSchema = [
  {text: 'CREATE TABLE timers (', field: 'table'},
  {text: '    due_minute      TIMESTAMPTZ NOT NULL,', field: 'minute'},
  {text: "    -- date_trunc('minute', due_at)", field: 'minute'},
  {text: '    due_at          TIMESTAMPTZ NOT NULL,', field: null},
  {text: '    shard           SMALLINT NOT NULL,', field: 'shards'},
  {text: '    -- hash(notification_id) % 256', field: 'shards'},
  {text: '    notification_id UUID NOT NULL,', field: null},
  {text: '    topic           TEXT NOT NULL,', field: 'topic'},
  {text: '    claimed_at      TIMESTAMPTZ,', field: null},
  {text: '    PRIMARY KEY (due_minute, shard, notification_id)', field: null},
  {text: ') PARTITION BY RANGE (due_minute);', field: 'range'},
  {text: '', field: null},
  {text: 'CREATE TABLE timers_20261029_0900', field: 'partition'},
  {text: '    PARTITION OF timers', field: 'partition'},
  {text: "    FOR VALUES FROM ('2026-10-29 09:00:00+00')", field: 'partition'},
  {text: "                 TO ('2026-10-29 09:01:00+00');", field: 'partition'},
] as const satisfies readonly CodeLine[];

// Materials p. 37 and voice: recover expired claims after two minutes.
// No claimed_by column is invented: the schema uses claimed_at. The complete
// key and claim timestamp are returned for guarded acknowledgement downstream.
export const timerClaim = [
  {text: '-- Поллер 3: шарды 96..127', field: 'poller'},
  {text: 'BEGIN;', field: 'transaction'},
  {text: 'WITH due AS (', field: null},
  {text: '    SELECT due_minute, shard, notification_id', field: null},
  {text: '    FROM timers', field: null},
  {text: "    WHERE due_minute <= date_trunc('minute', now())", field: 'overdue'},
  {text: '      AND due_at <= now()', field: 'overdue'},
  {text: '      AND shard BETWEEN 96 AND 127', field: 'poller'},
  {text: '      AND (claimed_at IS NULL', field: 'lease'},
  {text: "           OR claimed_at < now() - interval '2 minutes')", field: 'lease'},
  {text: '    ORDER BY due_at LIMIT 1000', field: null},
  {text: '    FOR UPDATE SKIP LOCKED', field: 'lock'},
  {text: ')', field: null},
  {text: 'UPDATE timers t SET claimed_at = now()', field: 'claim'},
  {text: 'FROM due', field: 'claim'},
  {text: 'WHERE (t.due_minute, t.shard, t.notification_id)', field: null},
  {text: '    = (due.due_minute, due.shard, due.notification_id)', field: null},
  {text: 'RETURNING t.due_minute, t.shard, t.notification_id,', field: null},
  {text: '          t.topic, t.due_at, t.claimed_at;', field: null},
  {text: 'COMMIT;', field: 'transaction'},
  {text: '-- Публикация в Kafka — после COMMIT.', field: null},
] as const satisfies readonly CodeLine[];

export type TimerField = Exclude<
  typeof timersSchema[number]['field'] | typeof timerClaim[number]['field'], null>;
