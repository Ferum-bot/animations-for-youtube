import React from 'react';
import {Audio} from '@remotion/media';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {Sequence,staticFile,useVideoConfig} from 'remotion';
import {SourceDesk} from './SourceDesk';
import {durationMs,score,type Shot} from './score';

const Cut:React.FC<{shot:Shot}>=({shot})=>{
  const {timeMs}=useSceneTime();
  return <SceneStage transparent={false} label="ScyllaDB — архив, интервью и устройство">
    <SourceDesk shot={shot} ms={timeMs}/>
  </SceneStage>;
};
const Composition:React.FC<{readonly withAudio?:boolean}>=({withAudio=false})=>{
  const {fps}=useVideoConfig();
  const frame=(ms:number)=>Math.round(ms*fps/1000);
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/scylla-origins-engine-excerpt.m4a')}/>}
    {score.map((shot,i)=><Sequence key={shot.at} from={frame(shot.at)} durationInFrames={frame(score[i+1]?.at??durationMs)-frame(shot.at)}
      name={shot.kind==='portrait'?'Дор Лаор и Ави Кивити':shot.id} premountFor={Math.round(fps/2)}>
      <Cut shot={shot}/>
    </Sequence>)}
  </>;
};
export default Composition;
