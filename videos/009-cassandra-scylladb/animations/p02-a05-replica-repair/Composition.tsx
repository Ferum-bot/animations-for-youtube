import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {DivergentRead} from '../../shared/architecture/DivergentRead';
import {Digest, Version, Clocks} from './ReadVersions';
import {Behind, Handoff, ReadRepair} from './Recovery';
import {RangeRepair, Availability} from './RangeRepair';
import {cue, type ShotProps} from './scene';

const Story: React.FC<ShotProps> = ({timeMs}) => {
  if (timeMs >= cue.availability) return <Availability timeMs={timeMs}/>;
  if (timeMs >= cue.repair) return <RangeRepair timeMs={timeMs}/>;
  if (timeMs >= cue.readRepair) return <ReadRepair timeMs={timeMs}/>;
  if (timeMs >= cue.hint) return <Handoff timeMs={timeMs}/>;
  if (timeMs >= cue.behind) return <Behind/>;
  if (timeMs >= cue.clocks) return <Clocks timeMs={timeMs}/>;
  if (timeMs >= cue.reconcile) return <Version timeMs={timeMs}/>;
  if (timeMs >= cue.digest) return <Digest timeMs={timeMs}/>;
  return <DivergentRead/>;
};
const Composition: React.FC<{readonly withAudio?:boolean}> = ({withAudio=false}) => {
  const {timeMs}=useSceneTime();
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/replica-repair-excerpt.m4a')}/>}
    <SceneStage label="Cassandra — согласование версий и восстановление реплик" transparent={false}>
      <Story timeMs={timeMs}/>
    </SceneStage>
  </>;
};
export default Composition;
