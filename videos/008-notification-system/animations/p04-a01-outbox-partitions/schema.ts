import type {CodeLine} from '../../shared/CodeEditor';

// Extend the outbox from materials p. 17 for the narrated daily partitioning.
// PostgreSQL requires the partition key in a partitioned PRIMARY KEY.
export const parentTable = [
  {text: 'CREATE TABLE outbox (', field: 'parent'},
  {text: '    id              BIGSERIAL,', field: null},
  {text: '    notification_id UUID NOT NULL', field: null},
  {text: '        REFERENCES notifications(id),', field: null},
  {text: '    topic           TEXT NOT NULL,', field: null},
  {text: '    payload         JSONB NOT NULL,', field: null},
  {text: '    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),', field: 'range'},
  {text: '    published_at    TIMESTAMPTZ,', field: null},
  {text: '    PRIMARY KEY (id, created_at)', field: 'range'},
  {text: ') PARTITION BY RANGE (created_at);', field: 'range'},
] as const satisfies readonly CodeLine[];

// UTC bounds are inclusive/exclusive. TRUNCATE is a later maintenance operation,
// after the retention cutoff and publication of every record in this partition.
export const partitionLifecycle = [
  {text: 'CREATE TABLE outbox_20261029', field: 'day'},
  {text: '    PARTITION OF outbox', field: 'day'},
  {text: "    FOR VALUES FROM ('2026-10-29 00:00:00+00')", field: 'day'},
  {text: "                 TO ('2026-10-30 00:00:00+00');", field: 'day'},
  {text: '', field: null},
  {text: '-- Планировщик создаёт следующие дни заранее.', field: 'automation'},
  {text: '', field: null},
  {text: 'CREATE INDEX outbox_unpublished ON outbox (id)', field: 'indexes'},
  {text: '    WHERE published_at IS NULL;', field: 'indexes'},
  {text: '-- В каждой партиции — свой физический индекс.', field: 'indexes'},
  {text: '', field: null},
  {text: '-- Позже: срок хранения истёк, всё опубликовано.', field: 'cleanup'},
  {text: 'TRUNCATE TABLE outbox_20261029;', field: 'cleanup'},
  {text: '-- Таблица остаётся; данные и индексы очищены.', field: 'cleanup'},
] as const satisfies readonly CodeLine[];

export type PartitionField = Exclude<
  typeof parentTable[number]['field'] | typeof partitionLifecycle[number]['field'], null>;
