import {queueMeasurements as measurements} from '../../benchmark-measurements';
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
export {measurements};

// The separate post-cleanup measurement is not another workload-size sample.
export const recovery = {
  beforeMs: measurements[5].blockedMs, afterMs: 0.060,
  beforeBuffers: measurements[5].buffers, afterBuffers: 23,
  indexKb: measurements[5].blockedKb,
} as const;
