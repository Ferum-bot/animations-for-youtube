import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 9 adapted to the narration and handwritten schema in the recording:
// options and quiet_opt are JSONB; user_id matches the existing UUID users.id.
export const preferences = [
  {text: 'CREATE TABLE preferences (', field: 'table'},
  {text: '    user_id   UUID PRIMARY KEY REFERENCES users(id),', field: 'user_id'},
  {text: "    options   JSONB NOT NULL DEFAULT '{}',", field: 'options'},
  {text: "    quiet_opt JSONB NOT NULL DEFAULT '{}'", field: 'quiet_opt'},
  {text: ');', field: null},
] as const satisfies readonly CodeLine[];

export type PreferenceField = Exclude<typeof preferences[number]['field'], null>;
