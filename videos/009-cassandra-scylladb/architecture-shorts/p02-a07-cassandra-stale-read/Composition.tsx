import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {Reading} from './Reading';
import {cue} from './score';

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const heading = timeMs < cue.quorum ? ['Почему Cassandra', 'вернула старый текст?'] :
    timeMs < cue.formula ? ['А если прочитать', 'с двух реплик?'] : ['Когда кворумы', 'пересекаются?'];
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-stale-read.m4a')}/>}
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" role="img" aria-label="Старая версия сообщения при чтении Cassandra"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      <g fontSize={75} fontWeight={760} letterSpacing={-3}>
        {heading.map((line, i) => <text key={line} x={72} y={183 + 87*i}>{line}</text>)}
      </g>
      <Reading time={timeMs}/>
    </svg>
  </AbsoluteFill>;
}
