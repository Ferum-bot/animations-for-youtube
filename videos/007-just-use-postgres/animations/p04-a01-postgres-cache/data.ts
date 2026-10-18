/** Exact example from the supplied script; SQL is reflowed only for readability. */
export const cache = {key: 'user:42:feed', value: '{"items": [1, 2, 3]}', ttlSeconds: 300} as const;
export const sql = {
  create: 'CREATE UNLOGGED TABLE cache (\n  key        text PRIMARY KEY,\n  value      jsonb NOT NULL,\n  expires_at timestamptz NOT NULL\n);',
  write: "INSERT INTO cache (key, value, expires_at)\nVALUES (\n  'user:42:feed', '{\"items\": [1, 2, 3]}',\n  now() + interval '5 minutes'\n)\nON CONFLICT (key) DO UPDATE\nSET value = EXCLUDED.value,\n    expires_at = EXCLUDED.expires_at;",
  read: "SELECT value FROM cache\nWHERE key = 'user:42:feed'\n  AND expires_at > now();",
  cleanup: 'DELETE FROM cache\nWHERE expires_at < now();',
  redisSet: "SET user:42:feed '{\"items\": [1, 2, 3]}' EX 300",
  redisGet: 'GET user:42:feed',
} as const;

export const benchmarks = {
  write: {loggedMs: '5,949', unloggedMs: '2,059', source: 'Crunchy Data · Greg Sabino Mullane · pgbench', url: 'https://www.crunchydata.com/blog/postgresl-unlogged-tables'},
  read: {redisP50Ms: '0,095', postgresMeanMs: '0,679', source: 'Raphael De Lio · автор работает в Redis', url: 'https://medium.com/redis-with-raphael-de-lio/can-postgres-replace-redis-as-a-cache-f6cba13386dc'},
} as const;
