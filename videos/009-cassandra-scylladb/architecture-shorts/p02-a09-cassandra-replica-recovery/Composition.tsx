import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {Recovery} from './Recovery';
import {cue} from './score';

const headings = [
  {at: 0, lines: ['Как реплика Cassandra', 'догоняет остальные?']},
  {at: cue.hint, lines: ['Hinted handoff']},
  {at: cue.read, lines: ['Read repair']},
  {at: cue.repair, lines: ['Anti-entropy repair']},
  {at: cue.synced, lines: ['Регулярный repair']},
] as const;

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/>;
  const title = headings.reduce((last, entry) => timeMs >= entry.at ? entry : last, headings[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-replica-recovery.m4a')}/>}
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" role="img" aria-label="Как реплика Cassandra догоняет записи"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      {title.lines.map((line,i) => <text key={line} x={72} y={183 + i*87} fontSize={73} fontWeight={760} letterSpacing={-3}>{line}</text>)}
      <Recovery time={timeMs}/>
    </svg>
  </AbsoluteFill>;
}
