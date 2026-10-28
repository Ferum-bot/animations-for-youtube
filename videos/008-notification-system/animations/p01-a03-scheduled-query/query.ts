import type {SqlLine} from '../../shared/SqlEditor';

// Materials p. 10: the initial, single-worker scheduled-send query.
export const scheduledQuery = [
  {text: 'SELECT id', field: 'select'},
  {text: 'FROM notifications', field: 'select'},
  {text: "WHERE status = 'scheduled'", field: 'status'},
  {text: '  AND send_at <= now()', field: 'send_at'},
  {text: 'LIMIT 1000;', field: 'limit'},
] as const satisfies readonly SqlLine[];

export type QueryField = typeof scheduledQuery[number]['field'];
