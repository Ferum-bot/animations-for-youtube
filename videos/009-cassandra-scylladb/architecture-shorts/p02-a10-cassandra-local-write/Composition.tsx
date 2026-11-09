import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {Storage, SyncModes} from './Storage';
import {cue} from './score';

const headings = [
  {at: 0, lines: ['Как Cassandra пишет', 'на одном узле?']},
  {at: cue.edit, lines: ['Правка сообщения № 109']},
  {at: cue.sync, lines: ['Когда узел', 'ответит OK?']},
] as const;

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const heading = headings.reduce((last, entry) => timeMs >= entry.at ? entry : last, headings[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-local-write.m4a')}/>}
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" role="img" aria-label="Путь записи на одном узле Cassandra"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      {heading.lines.map((line,i) => <text key={line} x={72} y={183 + i*87}
        fontSize={73} fontWeight={760} letterSpacing={-3}>{line}</text>)}
      {timeMs < cue.sync ? <Storage time={timeMs}/> : <SyncModes time={timeMs}/>}
    </svg>
  </AbsoluteFill>;
}
