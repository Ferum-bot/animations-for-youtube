export const sql = {
  listen: 'LISTEN cache_invalidation;',
  notify: "NOTIFY cache_invalidation,\n  'product:1';",
  commit: "BEGIN;\nSELECT pg_notify('cache_invalidation', 'product:1');\nCOMMIT;",
  rollback: "BEGIN;\nSELECT pg_notify('cache_invalidation', 'product:rollback');\nROLLBACK;",
  dedup: "BEGIN;\nNOTIFY cache_invalidation, 'product:2';\nNOTIFY cache_invalidation, 'product:2';\nCOMMIT;",
  trigger: `CREATE FUNCTION notify_new_job()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('new_job', NEW.queue);
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_notify
  AFTER INSERT ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_job();`,
  oversize: "SELECT pg_notify('c', repeat('x', 8000));",
} as const;
export const listenerLog = {
  first: 'канал cache_invalidation: сбросить product:1',
  second: 'канал cache_invalidation: сбросить product:2',
} as const;
