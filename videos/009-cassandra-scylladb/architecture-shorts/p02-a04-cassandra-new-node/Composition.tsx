import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {progress, Sheet, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {history} from '../../animations/p02-a03-chat-partition/scene';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {cue, titles} from './score';
import {TokenRing} from './TokenRing';

function ChatKey({time}: {readonly time: number}) {
  const group = progress(time, cue.group, cue.group + 750);
  return <g>
    <text x={88} y={480} fontSize={66} fontWeight={700}>chat_id = 42</text>
    {time < cue.hash ? <>
      {history.slice(0,2).map((row,i) => <Sheet key={row.id} x={114} y={610+i*185} width={766} height={151}>
        <text x={39} y={96} fontSize={64} fontWeight={650}>{row.body}</text>
      </Sheet>)}
      <path d="M96 615 H73 V939 H96" fill="none" stroke={ink.primary} strokeWidth={10}
        pathLength={1} strokeDasharray="1" strokeDashoffset={1-group}/>
      <text x={114} y={1090} fontSize={54} opacity={group}>Одна партиция</text>
    </> : <>
      <text x={89} y={680} fontSize={57}>↓ Murmur3</text>
      <g opacity={progress(time,cue.token,cue.token+440)}>
        <text x={88} y={887} fontSize={61} fontWeight={680}>−7160136740246525330</text>
        <text x={91} y={968} fontSize={47} fill={ink.muted}>токен чата 42</text>
      </g>
    </>}
  </g>;
}

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const title = titles.reduce((current, next) => timeMs >= next.at ? next : current, titles[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-new-node.m4a')}/>}
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" role="img" aria-label="Новый узел в кольце Cassandra"
      style={{fill: ink.text, fontFamily: ink.fontSans}}>
      <g fontSize={75} fontWeight={760} letterSpacing={-3}>
        {title.lines.map((line,i) => <text key={i} x={72} y={183+i*87}>{line}</text>)}
      </g>
      {timeMs < cue.ring ? <ChatKey time={timeMs}/> : <TokenRing time={timeMs}/>}
    </svg>
  </AbsoluteFill>;
}
