export const schema = `CREATE TABLE jobs (
  id bigserial PRIMARY KEY,
  state text NOT NULL DEFAULT 'ready',
  run_at timestamptz NOT NULL,
  locked_until timestamptz,
  payload jsonb NOT NULL
);`;
export const claim = `CREATE INDEX jobs_run_at_idx ON jobs (run_at);

EXPLAIN (COSTS OFF)
SELECT id FROM jobs
WHERE state = 'ready'
ORDER BY run_at
LIMIT 10
FOR UPDATE SKIP LOCKED;`;
export const plan = `Limit
  -> LockRows
       -> Index Scan using jobs_run_at_idx on jobs
            Filter: (state = 'ready'::text)`;
export const snapshot = `BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT count(*) FROM pg_class;`;
export const vacuum = `VACUUM (VERBOSE) jobs;`;
export const vacuumLog = `tuples: 0 removed, 99978 remain,
50000 are dead but not yet removable`;
export const measurements = [
  {jobs: 0, healthyMs: 0.044, blockedMs: 0.041, healthyKb: 240, blockedKb: 240, buffers: 23},
  {jobs: 20000, healthyMs: 0.046, blockedMs: 2.2, healthyKb: 424, blockedKb: 736, buffers: 22287},
  {jobs: 40000, healthyMs: 0.045, blockedMs: 3.7, healthyKb: 608, blockedKb: 1104, buffers: 26726},
  {jobs: 60000, healthyMs: 0.042, blockedMs: 5.3, healthyKb: 608, blockedKb: 1472, buffers: 31162},
  {jobs: 80000, healthyMs: 0.042, blockedMs: 6.9, healthyKb: 608, blockedKb: 1840, buffers: 35599},
  {jobs: 100000, healthyMs: 0.044, blockedMs: 8.5, healthyKb: 608, blockedKb: 2208, buffers: 40039},
] as const;

// The separate post-cleanup measurement is not another workload-size sample.
export const recovery = {
  beforeMs: measurements[5].blockedMs, afterMs: 0.060,
  beforeBuffers: measurements[5].buffers, afterBuffers: 23,
  indexKb: measurements[5].blockedKb,
} as const;
