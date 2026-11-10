import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {easing, mix, progress, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {Archive, interviews} from './Archive';
import {cue} from './score';

function Opening() {
  return <g x={74} fontSize={87} fontWeight={750}>
    <text x={74} y={682}>Зачем ScyllaDB</text>
    <text x={74} y={798}>сохранила CQL?</text>
  </g>;
}

function Query({time}: {readonly time: number}) {
  const swap = progress(time, cue.switchEngine, cue.switchEngine+730, easing.transform);
  return <g>
    <text x={74} y={239} fontSize={72} fontWeight={740}>Запрос приложения</text>
    <g fontFamily="Menlo, monospace" fontSize={57}>
      <text x={74} y={638}>SELECT body</text>
      <text x={74} y={724}>FROM messages</text>
      <text x={74} y={810}>WHERE chat_id = 42;</text>
    </g>
    <path d="M88 902 V1128 M70 1108 L88 1130 L106 1108" fill="none" stroke={ink.primary} strokeWidth={7}/>
    <text x={74} y={1240} fontSize={45}>Движок базы данных</text>
    <svg x={74} y={1280} width={830} height={135} overflow="hidden">
      <g transform={`translate(0 ${mix(0,-139,swap)})`} fontSize={89} fontWeight={745}>
        <text y={96}>Cassandra</text><text y={235}>ScyllaDB</text>
      </g>
    </svg>
  </g>;
}

function Story({time}: {readonly time: number}) {
  if (time < cue.interview) return <Opening/>;
  if (time < cue.codeStory) return <Archive reading={interviews.business} elapsed={time-cue.interview}/>;
  if (time < cue.example) return <Archive reading={interviews.interface} elapsed={time-cue.codeStory}/>;
  if (time < cue.pivot) return <Query time={time}/>;
  return <Archive reading={interviews.pivot} elapsed={time-cue.pivot}/>;
}

export default function Composition({withAudio=true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  return <AbsoluteFill data-scylla-cql="" style={{background:ink.background, fontFamily:ink.fontSans}}>
    <div style={{width:1080, height:1920, transformOrigin:'top left', transform:`scale(${width/1080})`}}>
      {timeMs >= cue.endCard ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Почему ScyllaDB сохранила CQL">
          <Story time={timeMs}/>
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/scylla-shorts/04/voice.m4a')}/>}
  </AbsoluteFill>;
}
