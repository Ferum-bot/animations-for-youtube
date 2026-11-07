import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {SceneStage, useSceneTime} from '@channel/motion-v2';
import {Inside,Storage,SyncModes,Wal} from './Storage';
import {QueryTables,Transaction} from './Queries';
import {Distribution,Maintenance} from './Distribution';
import {Workload} from './Workload';
import {t,type ShotProps} from './scene';

const Story:React.FC<ShotProps>=({timeMs})=>{
  if(timeMs>=t.choice) return <Workload timeMs={timeMs}/>;
  if(timeMs>=t.transaction) return <Transaction timeMs={timeMs}/>;
  if(timeMs>=t.developer) return <QueryTables timeMs={timeMs}/>;
  if(timeMs>=t.space) return <Maintenance timeMs={timeMs}/>;
  if(timeMs>=t.compare) return <Distribution timeMs={timeMs}/>;
  if(timeMs>=t.history) return <QueryTables timeMs={timeMs}/>;
  if(timeMs>=t.pg) return <Wal timeMs={timeMs}/>;
  if(timeMs>=t.sync) return <SyncModes timeMs={timeMs}/>;
  if(timeMs>=t.desk) return <Storage timeMs={timeMs}/>;
  return <Inside timeMs={timeMs}/>;
};
const Composition:React.FC<{readonly withAudio?:boolean}>=({withAudio=false})=>{
  const {timeMs}=useSceneTime();
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/storage-and-workload-excerpt.m4a')}/>}
    <SceneStage transparent={false} label="Cassandra — от записи на диск до выбора базы"><Story timeMs={timeMs}/></SceneStage>
  </>;
};
export default Composition;
