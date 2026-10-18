import React from 'react';
import {Channel, Listener, Producer, Trigger} from './SourceScenes';
import {Commit, Rollback, Dedup} from './DeliveryScenes';
import {Offline, Payload, Pool} from './LimitScenes';
import type {ShotId} from './timing';
import type {ShotProps} from './ui';
const scenes = {
  channel: Channel, listener: Listener, producer: Producer, commit: Commit,
  rollback: Rollback, dedup: Dedup, trigger: Trigger, offline: Offline, payload: Payload, pool: Pool,
} satisfies Record<ShotId, React.ComponentType<ShotProps>>;
export const ShotContent: React.FC<ShotProps & {readonly id: ShotId}> = ({id, ...props}) => {
  const Scene = scenes[id];
  return <Scene {...props} />;
};
