// Verbatim examples and measured samples from the user's episode materials.
export const schema = `CREATE TABLE events (
  id bigserial PRIMARY KEY,
  payload text NOT NULL
);`;
export const plainTransaction = `BEGIN;
INSERT INTO events (payload)
VALUES ('order:42');
COMMIT;`;
export const notifyTransaction = `BEGIN;
INSERT INTO events (payload)
VALUES ('order:42');
SELECT pg_notify('events', 'order:42');
COMMIT;`;
export const sourceComment = `/*
 * Serialize writers by acquiring a special lock that we hold till
 * after commit.  This ensures that queue entries appear in commit
 * order, and in particular that there are never uncommitted queue
 * entries ahead of committed ones, so an uncommitted transaction
 * can't block delivery of deliverable notifications.
 */
LockSharedObject(DatabaseRelationId, InvalidOid, 0,
                 AccessExclusiveLock);`;
export const retainedLock = `LockSharedObject(
  DatabaseRelationId, InvalidOid, 0,
  AccessExclusiveLock
);`;
export const activityQuery = `SELECT wait_event_type, wait_event, count(*)
FROM pg_stat_activity
WHERE application_name = 'pgbench'
GROUP BY 1, 2 ORDER BY 3 DESC;`;
export const recallLog = `process 61596 still waiting for AccessExclusiveLock
on object 0 of class 1262 of database 0
after 1000.192 ms`;
export const demoLog = `process 41681 still waiting for AccessExclusiveLock
on object 0 of class 1262 of database 0
after 20.358 ms`;
export const measurements = [
  {clients: 1, plainTps: 248, notifyTps: 238, plainMs: 4.0, notifyMs: 4.2},
  {clients: 16, plainTps: 2253, notifyTps: 273, plainMs: 7.1, notifyMs: 58.5},
  {clients: 64, plainTps: 8936, notifyTps: 278, plainMs: 7.2, notifyMs: 229.9},
] as const;
export const links = {
  recall: 'https://www.recall.ai/blog/postgres-listen-notify-does-not-scale',
  docs: 'https://www.postgresql.org/docs/17/sql-notify.html',
  pg17: 'https://github.com/postgres/postgres/blob/REL_17_STABLE/src/backend/commands/async.c',
  pg19: 'https://github.com/postgres/postgres/blob/REL_19_STABLE/src/backend/commands/async.c',
  release: 'https://www.postgresql.org/docs/19/release-19.html',
} as const;
