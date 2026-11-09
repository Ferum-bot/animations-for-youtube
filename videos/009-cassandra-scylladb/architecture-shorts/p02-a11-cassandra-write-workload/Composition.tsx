import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {Rates, QueryModel, PartitionLoad, Maintenance, Lookup} from './Workload';
import {cue} from './score';

const scenes = [
  {at: 0, title: ['Много записей.', 'Пора брать Cassandra?'], draw: Rates},
  {at: cue.tables, title: ['Одно сообщение,', 'два запроса'], draw: QueryModel},
  {at: cue.distribution, title: ['Куда идут записи?'], draw: PartitionLoad},
  {at: cue.hot, title: ['Горячая партиция'], draw: PartitionLoad},
  {at: cue.maintenance, title: ['Что остаётся команде?'], draw: Maintenance},
  {at: cue.lookup, title: ['Читаем историю', 'чата 42'], draw: Lookup},
] as const;

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const {title, draw: Scene} = scenes.reduce((last,next) => timeMs >= next.at ? next : last,scenes[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-write-workload.m4a')}/>}
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" role="img" aria-label="Выбор Cassandra для записей"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      {title.map((line,i) => <text key={line} x={72} y={183+87*i} fontSize={73} fontWeight={760} letterSpacing={-3}>{line}</text>)}
      <Scene time={timeMs}/>
    </svg>
  </AbsoluteFill>;
}
