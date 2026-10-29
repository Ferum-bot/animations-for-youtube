import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 9; UUID matches the narrated users.id instead of the PDF's BIGINT.
export const deviceTokens = [
  {text: 'CREATE TABLE device_tokens (', field: 'table'},
  {text: '    user_id   UUID NOT NULL REFERENCES users(id),', field: 'user_id'},
  {text: '    platform  TEXT NOT NULL,', field: 'platform'},
  {text: '    -- apns, fcm, rustore, hms, webpush', field: 'platform'},
  {text: '    token     TEXT NOT NULL,', field: 'token'},
  {text: '    active    BOOLEAN NOT NULL DEFAULT true,', field: 'active'},
  {text: '    last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),', field: 'last_seen'},
  {text: '    PRIMARY KEY (platform, token)', field: null},
  {text: ');', field: null},
  {text: '', field: null},
  {text: 'CREATE INDEX device_tokens_user', field: null},
  {text: '    ON device_tokens (user_id) WHERE active;', field: null},
] as const satisfies readonly CodeLine[];

export type DeviceTokenField = Exclude<typeof deviceTokens[number]['field'], null>;
