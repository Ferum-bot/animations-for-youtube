import React from 'react';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {Confirmation} from './Confirmation';
import {Messenger} from './Messenger';
import {Topology} from './Topology';
import {timing as t} from './scene';

const Composition: React.FC<{readonly withAudio?: boolean}> = ({withAudio = false}) => {
  const {timeMs} = useSceneTime();
  return <>
    {withAudio ? <Audio src={staticFile('generated/009-cassandra-scylladb/postgres-replication-excerpt.m4a')} /> : null}
    <SceneStage transparent={false} label="Архитектура PostgreSQL — чтение, запись и репликация">
      {timeMs >= t.async ? <Confirmation timeMs={timeMs} /> :
        timeMs >= t.messenger && timeMs < t.replicas ? <Messenger timeMs={timeMs} /> :
          <Topology timeMs={timeMs} />}
    </SceneStage>
  </>;
};
export default Composition;
