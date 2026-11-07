import React from 'react';
import {Audio} from '@remotion/media';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {staticFile} from 'remotion';
import {Queue, RelatedEpisode} from './Queue';
import {Groups} from './Groups';
import {Routing} from './Routing';
import {Cassandra} from './Cassandra';
import {t, type SceneProps} from './scene';

const Story: React.FC<SceneProps> = ({timeMs}) => {
  if (timeMs >= t.cassandra) return <Cassandra timeMs={timeMs} />;
  if (timeMs >= t.routing) return <Routing timeMs={timeMs} />;
  if (timeMs >= t.split) return <Groups timeMs={timeMs} />;
  if (timeMs >= t.cover && timeMs < t.extraReplica) return <RelatedEpisode />;
  return <Queue timeMs={timeMs} />;
};

const Composition: React.FC<{readonly withAudio?: boolean}> = ({withAudio = false}) => {
  const {timeMs} = useSceneTime();
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/write-sharding-excerpt.m4a')} />}
    <SceneStage label="Архитектура — от очереди записи к шардингу и равноправным репликам" transparent={false}>
      <Story timeMs={timeMs} />
    </SceneStage>
  </>;
};
export default Composition;
