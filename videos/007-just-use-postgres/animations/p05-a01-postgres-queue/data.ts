/** Supplied script examples, reflowed for the frame. The lock demo takes two rows. */
export const sql = {
  create: `CREATE TABLE jobs (
  id           bigserial PRIMARY KEY,
  queue        text NOT NULL,
  payload      jsonb NOT NULL,
  state        text NOT NULL DEFAULT 'ready',
  run_at       timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz
);`,
  index: `CREATE INDEX ON jobs (queue, run_at)
WHERE state = 'ready';`,
  lock: `BEGIN;
SELECT id FROM jobs
WHERE state = 'ready'
ORDER BY run_at, id
LIMIT 2
FOR UPDATE SKIP LOCKED;`,
  lease: `UPDATE jobs
SET state = 'running',
    locked_until = now() + interval '5 minutes'
WHERE id IN (
  SELECT id FROM jobs
  WHERE queue = 'emails' AND (
    (state = 'ready' AND run_at <= now())
    OR (state = 'running' AND locked_until < now())
  )
  ORDER BY run_at LIMIT 10
  FOR UPDATE SKIP LOCKED
)
RETURNING id, payload;`,
  commit: `BEGIN;
INSERT INTO orders (user_id, total) VALUES (7, 1990);
INSERT INTO jobs (queue, payload)
VALUES ('emails', '{"order_id": 1}');
COMMIT;`,
  rollback: `BEGIN;
INSERT INTO orders (user_id, total) VALUES (8, 590);
INSERT INTO jobs (queue, payload)
VALUES ('emails', '{"order_id": 2}');
ROLLBACK;`,
  done: 'DELETE FROM jobs WHERE id = ANY($1);',
} as const;

export const fields = [
  ['id', 'Номер задачи'], ['queue', 'Очередь: emails'],
  ['payload', 'Данные: {"order_id": 1}'], ['state', 'ready → running'],
  ['run_at', 'Когда можно начать'], ['locked_until', 'До какого времени арендована'],
] as const;

export const libraries = [
  ['Go', 'River'], ['Ruby', 'Solid Queue · GoodJob'], ['Elixir', 'Oban'],
  ['Node.js', 'pg-boss · Graphile Worker'], ['Python', 'Procrastinate'],
  ['Java', 'db-scheduler · JobRunr'], ['.NET', 'Hangfire.PostgreSql'],
  ['PHP', 'Laravel: драйвер database'], ['SQL / любой язык', 'pgmq'],
] as const;
