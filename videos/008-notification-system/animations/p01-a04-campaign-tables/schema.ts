import type {SqlLine} from '../../shared/SqlEditor';

// Materials p. 9, adapted to narration: segment_id replaces segment_sql.
// UUID identifiers stay consistent with the previously shown schema.
export const campaigns = [
  {text: 'CREATE TABLE campaigns (', field: null},
  {text: '    id         UUID PRIMARY KEY,', field: 'campaign-id'},
  {text: '    segment_id UUID NOT NULL,', field: 'campaign-segment'},
  {text: '    channel    TEXT NOT NULL,', field: 'channel'},
  {text: '    template   TEXT NOT NULL,', field: 'template'},
  {text: "    params     JSONB NOT NULL DEFAULT '{}',", field: 'params'},
  {text: '    send_at    TIMESTAMPTZ NOT NULL DEFAULT now(),', field: 'send_at'},
  {text: "    status     TEXT NOT NULL DEFAULT 'scheduled'", field: 'status'},
  {text: ');', field: null},
] as const satisfies readonly SqlLine[];

// Narrated membership table. A segment has multiple users, so its ID is not
// independently unique and campaigns.segment_id cannot reference it as a FK.
export const segments = [
  {text: 'CREATE TABLE segments (', field: null},
  {text: '    segment_id UUID NOT NULL,', field: 'segment-id'},
  {text: '    user_id    UUID NOT NULL REFERENCES users(id),', field: 'segment-user'},
  {text: '    PRIMARY KEY (segment_id, user_id)', field: null},
  {text: ');', field: null},
] as const satisfies readonly SqlLine[];

export type CampaignField = Exclude<typeof campaigns[number]['field'] | typeof segments[number]['field'], null>;
