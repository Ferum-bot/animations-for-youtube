import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 17, PostgreSQL-as-queue alternative. This variant adds the nullable
// claimed_at TIMESTAMPTZ column. Text priority needs explicit business ordering:
// lexical ORDER BY priority would put bulk ahead of p0 and p1.
export const claimQuery = [
  {text: 'UPDATE notifications', field: 'table'},
  {text: "SET status = 'sending',", field: 'claim'},
  {text: '    claimed_at = now()', field: 'claim'},
  {text: 'WHERE id IN (', field: null},
  {text: '    SELECT id FROM notifications', field: 'table'},
  {text: "    WHERE status = 'accepted'", field: null},
  {text: '      AND send_at <= now()', field: null},
  {text: '    ORDER BY CASE priority', field: null},
  {text: "        WHEN 'p0' THEN 0", field: null},
  {text: "        WHEN 'p1' THEN 1 ELSE 2 END, send_at", field: null},
  {text: '    LIMIT 100', field: null},
  {text: '    FOR UPDATE SKIP LOCKED', field: 'lock'},
  {text: ')', field: null},
  {text: 'RETURNING *;', field: 'return'},
] as const satisfies readonly CodeLine[];

export type ClaimField = Exclude<typeof claimQuery[number]['field'], null>;
