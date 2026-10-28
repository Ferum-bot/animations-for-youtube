import type {SqlLine} from '../../shared/SqlEditor';

// Complete DDL from materials p. 9. Narration overrides BIGSERIAL/BIGINT
// with UUIDv7 and adds optional provider metadata. Indexes stay as documented.
export const users = [
  {text: 'CREATE TABLE users (', field: null},
  {text: '    id       UUID PRIMARY KEY, -- UUIDv7', field: 'id'},
  {text: '    email    TEXT,', field: 'email'},
  {text: '    phone    TEXT, -- E.164: +79991234567', field: 'phone'},
  {text: '    -- IANA: Europe/Moscow', field: 'timezone'},
  {text: "    timezone TEXT NOT NULL DEFAULT 'UTC'", field: 'timezone'},
  {text: ');', field: null},
] as const satisfies readonly SqlLine[];

export const notifications = [
  {text: 'CREATE TABLE notifications (', field: null},
  {text: '    id              UUID PRIMARY KEY, -- UUIDv7', field: 'id'},
  {text: '    idempotency_key TEXT NOT NULL,', field: 'idempotency_key'},
  {text: '    user_id         UUID NOT NULL REFERENCES users(id),', field: 'user_id'},
  {text: '    channel         TEXT NOT NULL, -- push, email, sms', field: 'channel'},
  {text: '    category        TEXT NOT NULL, -- transactional, security, marketing', field: 'category'},
  {text: "    priority        TEXT NOT NULL DEFAULT 'p1', -- p0, p1, bulk", field: 'priority'},
  {text: '    template        TEXT NOT NULL,', field: 'template'},
  {text: "    params          JSONB NOT NULL DEFAULT '{}',", field: 'params'},
  {text: '    send_at         TIMESTAMPTZ NOT NULL DEFAULT now(),', field: 'send_at'},
  {text: "    status          TEXT NOT NULL DEFAULT 'accepted',", field: 'status'},
  {text: '    provider_msg_id TEXT,', field: 'provider_msg_id'},
  {text: '    provider_meta   JSONB, -- опционально', field: 'provider_meta'},
  {text: '    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),', field: 'created_at'},
  {text: '    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()', field: 'updated_at'},
  {text: ');', field: null},
  {text: '', field: null},
  {text: 'CREATE INDEX notifications_due ON notifications (send_at)', field: null},
  {text: "    WHERE status = 'scheduled';", field: null},
  {text: '', field: null},
  {text: 'CREATE INDEX notifications_user', field: null},
  {text: '    ON notifications (user_id, created_at DESC);', field: null},
] as const satisfies readonly SqlLine[];

export type UserField = Exclude<typeof users[number]['field'], null>;
export type NotificationField = Exclude<typeof notifications[number]['field'], null>;
export type FieldName = UserField | NotificationField;
