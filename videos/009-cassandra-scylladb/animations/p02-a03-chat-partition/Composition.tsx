import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {Partition} from './Partition';
import {History, IndexComparison} from './History';
import {Placement, RelatedEpisode} from './Placement';
import {cue, type ShotProps} from './scene';

const Story: React.FC<ShotProps> = ({timeMs}) => {
  if (timeMs >= cue.go) return <RelatedEpisode timeMs={timeMs} />;
  if (timeMs >= cue.hash) return <Placement timeMs={timeMs} />;
  if (timeMs >= cue.postgres) return <IndexComparison timeMs={timeMs} />;
  if (timeMs >= cue.history) return <History timeMs={timeMs} />;
  return <Partition timeMs={timeMs} />;
};

const Composition: React.FC<{readonly withAudio?: boolean}> = ({withAudio = false}) => {
  const {timeMs} = useSceneTime();
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/chat-partition-excerpt.m4a')} />}
    <SceneStage transparent={false} label="Cassandra — история чата и размещение партиции">
      <Story timeMs={timeMs} />
    </SceneStage>
  </>;
};
export default Composition;
