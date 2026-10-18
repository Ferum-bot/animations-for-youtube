import React from 'react';
import {Cleanup, Read, Table, Unlogged, Write} from './CacheScenes';
import {Benchmark, Crash, RequestPath, Storage, Ttl, Vacuum} from './LimitScenes';
import type {ShotId} from './timing';
import type {ShotProps} from './ui';

const scenes = {
  unlogged: Unlogged, table: Table, write: Write, read: Read, cleanup: Cleanup,
  storage: Storage, benchmark: Benchmark, request: RequestPath, crash: Crash,
  ttl: Ttl, vacuum: Vacuum,
} satisfies Record<ShotId, React.ComponentType<ShotProps>>;

export const ShotContent: React.FC<ShotProps & {readonly id: ShotId}> = ({id, ...props}) => {
  const Scene = scenes[id];
  return <Scene {...props} />;
};
