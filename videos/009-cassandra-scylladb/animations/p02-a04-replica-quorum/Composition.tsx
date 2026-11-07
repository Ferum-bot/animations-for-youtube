import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {Cluster} from './Cluster';
import {Read, Write} from './Operation';
import {Intersection} from './Intersection';
import {cue, type ShotProps} from './scene';

const Story: React.FC<ShotProps> = ({timeMs}) => {
  if (timeMs >= cue.readQuorum) return <Intersection timeMs={timeMs}/>;
  if (timeMs >= cue.read) return <Read timeMs={timeMs}/>;
  if (timeMs >= cue.write) return <Write timeMs={timeMs}/>;
  return <Cluster timeMs={timeMs}/>;
};
const Composition: React.FC<{readonly withAudio?:boolean}> = ({withAudio=false}) => {
  const {timeMs}=useSceneTime();
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/quorum-excerpt.m4a')} />}
    <SceneStage label="Cassandra — запись и чтение с кворумом" transparent={false}>
      <Story timeMs={timeMs}/>
    </SceneStage>
  </>;
};
export default Composition;
