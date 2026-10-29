import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 17. The foreign key follows the previously narrated UUID schema;
// the outbox's own sequence ID remains BIGSERIAL as in the materials.
export const outboxSchema = [
  {text: 'CREATE TABLE outbox (', field: null},
  {text: '    id              BIGSERIAL PRIMARY KEY,', field: 'id'},
  {text: '    notification_id UUID NOT NULL', field: 'notification-id'},
  {text: '        REFERENCES notifications(id),', field: 'notification-id'},
  {text: '    topic           TEXT NOT NULL,', field: 'topic'},
  {text: '    payload         JSONB NOT NULL,', field: 'payload'},
  {text: '    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),', field: 'created'},
  {text: '    published_at    TIMESTAMPTZ', field: 'published'},
  {text: ');', field: null},
  {text: '', field: null},
  {text: 'CREATE INDEX outbox_unpublished ON outbox (id)', field: null},
  {text: '    WHERE published_at IS NULL;', field: null},
] as const satisfies readonly CodeLine[];

// Named parameters are bound by the application. Both statements use the same
// UUIDv7, generated before the transaction; all required notification fields
// without database defaults are supplied. HTTP acceptance follows COMMIT.
export const ingestionTransaction = [
  {text: '-- :id — UUIDv7, созданный в Ingestion API', field: null},
  {text: 'BEGIN;', field: 'tx-begin'},
  {text: 'INSERT INTO notifications (', field: 'insert-notification'},
  {text: '    id, idempotency_key, user_id,', field: null},
  {text: '    channel, category, priority, template, params', field: null},
  {text: ') VALUES (', field: null},
  {text: '    :id, :idempotency_key, :user_id,', field: null},
  {text: '    :channel, :category, :priority, :template, :params', field: null},
  {text: ') RETURNING id;', field: 'insert-notification'},
  {text: '', field: null},
  {text: 'INSERT INTO outbox (notification_id, topic, payload)', field: 'insert-outbox'},
  {text: 'VALUES (:id, :topic, :payload);', field: 'insert-outbox'},
  {text: '', field: null},
  {text: 'COMMIT;', field: 'tx-commit'},
  {text: '-- Только после COMMIT → 202 Accepted', field: 'accepted'},
] as const satisfies readonly CodeLine[];

// Keep row locks until the relay commits. Kafka publication is an application
// operation, so it is explicitly a comment, not fabricated SQL. Bind an array
// of acknowledged IDs; a crash after publish and before commit can cause replay.
export const outboxRelay = [
  {text: '-- Outbox Worker: повторять в цикле', field: 'cycle'},
  {text: 'BEGIN;', field: null},
  {text: 'SELECT id, topic, payload FROM outbox', field: 'select'},
  {text: 'WHERE published_at IS NULL', field: 'unpublished'},
  {text: 'ORDER BY id LIMIT 500', field: null},
  {text: 'FOR UPDATE SKIP LOCKED;', field: 'lock'},
  {text: '-- produce в Kafka с acks=all; дождаться ACK', field: 'produce'},
  {text: 'UPDATE outbox SET published_at = now()', field: 'mark-published'},
  {text: 'WHERE id = ANY(:published_ids);', field: 'mark-published'},
  {text: 'COMMIT;', field: 'relay-commit'},
  {text: '-- :published_ids — только подтверждённые записи', field: null},
] as const satisfies readonly CodeLine[];

export type OutboxField = Exclude<
  typeof outboxSchema[number]['field'] |
  typeof ingestionTransaction[number]['field'] |
  typeof outboxRelay[number]['field'], null>;
