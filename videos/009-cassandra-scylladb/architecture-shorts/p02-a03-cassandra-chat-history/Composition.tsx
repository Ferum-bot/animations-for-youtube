import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {HistoryRows} from './HistoryRows';
import {cue, headings} from './score';

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const title = headings.reduce((current, next) => timeMs >= next.at ? next : current, headings[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-chat-history.m4a')}/>}
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" role="img" aria-label="История чата в Cassandra"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      <g fontSize={75} fontWeight={760} letterSpacing={-3}>
        {title.lines.map((line,i) => <text key={i} x={72} y={183 + i*86}>{line}</text>)}
      </g>
      <HistoryRows time={timeMs}/>
    </svg>
  </AbsoluteFill>;
}
