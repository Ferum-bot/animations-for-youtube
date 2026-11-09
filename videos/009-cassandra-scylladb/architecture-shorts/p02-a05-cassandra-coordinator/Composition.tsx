import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {Cluster} from './Cluster';
import {cue, headings} from './score';

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const title = headings.reduce((last, shot) => timeMs >= shot.at ? shot : last, headings[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-coordinator.m4a')}/>}
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" role="img" aria-label="Координатор записи в Cassandra"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      <g fontSize={75} fontWeight={760} letterSpacing={-3}>
        {title.lines.map((line, index) => <text key={line} x={72} y={183 + index * 87}>{line}</text>)}
      </g>
      <Cluster time={timeMs}/>
    </svg>
  </AbsoluteFill>;
}
