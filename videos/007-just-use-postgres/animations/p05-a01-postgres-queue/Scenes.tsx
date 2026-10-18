import React from 'react';
import {Table, Locks, Lease, Transaction} from './QueueScenes';
import {Libraries, Retry, Journal, Versions, Outbox} from './LimitScenes';
import type {ShotProps} from './ui';
import type {ShotId} from './timing';

const scenes = {
  table: Table, locks: Locks, lease: Lease, transaction: Transaction,
  libraries: Libraries, retry: Retry, journal: Journal, versions: Versions, outbox: Outbox,
} satisfies Record<ShotId, React.ComponentType<ShotProps>>;

export const ShotContent: React.FC<ShotProps & {readonly id: ShotId}> = ({id, ...props}) => {
  const Scene = scenes[id];
  return <Scene {...props} />;
};
