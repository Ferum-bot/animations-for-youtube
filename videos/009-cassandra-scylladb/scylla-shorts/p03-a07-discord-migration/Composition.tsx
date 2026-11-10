import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {easing, mix, progress, SourceImage, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {Results, SourceNote} from './Report';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {cue, folder} from './score';

function Cover() {
  return <g>
    <rect width={1080} height={1920} fill="black"/>
    <text x={72} y={242} fontSize={80} fontWeight={740}>Как Discord перешёл</text>
    <text x={72} y={345} fontSize={80} fontWeight={740}>со 177 узлов на 72?</text>
    <SourceImage src={folder+'discord-cover.webp'} x={0} y={568} width={1080} height={608}/>
    <text x={74} y={1390} fontSize={56}>Cassandra → ScyllaDB</text>
  </g>;
}

function Requests({time}: {readonly time:number}) {
  const move = progress(time,cue.requests+2800,cue.requests+4300,easing.transform);
  const width = mix(1080,1720,move);
  return <g>
    <text x={74} y={223} fontWeight={745} fontSize={72}>Четыре запроса</text>
    <text x={74} y={316} fontWeight={745} fontSize={72}>одного сообщения</text>
    <svg y={480} width={1080} height={792} overflow="hidden">
      <rect width={1080} height={792} fill="white"/>
      <SourceImage src={folder+'discord-figure.webp'} x={(1080-width)/2} y={mix(46,-309,move)}
        width={width} height={width*1154/1806}/>
    </svg>
    <text x={74} y={1426} fontSize={61} fontWeight={710}>Одно чтение из базы</text>
    <text x={74} y={1510} fontSize={39}>Схема Discord Engineering</text>
  </g>;
}

function Story({time}: {readonly time:number}) {
  if (time<cue.trouble) return <Cover/>;
  if (time<cue.report) return <SourceNote time={time}/>;
  if (time<cue.requests) return <Results time={time}/>;
  if (time<cue.reverse) return <Requests time={time}/>;
  if (time<cue.conclusion) return <SourceNote time={time} ending/>;
  return <Results time={time} final/>;
}

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  return <AbsoluteFill data-scylla-discord="" style={{background:ink.background,fontFamily:ink.fontSans}}>
    <div style={{width:1080,height:1920,transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=cue.endCard ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Как Discord перенёс хранилище сообщений в ScyllaDB">
          <Story time={timeMs}/>
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/scylla-shorts/07/voice.m4a')}/>}
  </AbsoluteFill>;
}
