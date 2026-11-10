import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,staticFile,useVideoConfig} from 'remotion';
import {arrive,useSceneTime,useV2Font,v2Theme as ink} from '@channel/motion-v2';
import {PresenterPane} from '../../history-shorts/PresenterPane';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {Queue} from './Queue';
import {Memory} from './Memory';
import {cue, leadInMs} from './score';

const media='generated/009-cassandra-scylladb/scylla-shorts/01/';
const camera=[{from:0,to:leadInMs+cue.fullScreen,file:media+'presenter-intro.mp4',trim:0}];

function Opening({time}: {time:number}) {
  return <g>
    <text x={76} y={175} fontSize={72} fontWeight={750}>Cassandra на Java</text>
    <text x={76} y={433} fontSize={63}>Что задержало запрос?</text>
    <g opacity={arrive(time,3490,500)}>
      <text x={76} y={690} fontSize={99} fontWeight={740}>Сборщик мусора</text>
      <path d="M78 748 H850" stroke={ink.primary} strokeWidth={7}/>
    </g>
  </g>;
}

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs: elapsedMs}=useSceneTime();
  const timeMs=elapsedMs-leadInMs;
  const {width}=useVideoConfig();
  const opening=timeMs<cue.fullScreen-0.01;
  return <AbsoluteFill data-scylla-gc="" style={{backgroundColor:ink.background,fontFamily:ink.fontSans}}>
    <PresenterPane cuts={camera}/>
    <div style={{position:'absolute',width:1080,height:opening?1056:1920,overflow:'hidden',background:ink.background,
      transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=cue.endCard-0.01 ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width="1080" height="1920" style={{fill:ink.text}} role="img" aria-label="Пауза сборщика мусора на одном узле Cassandra">
          {timeMs<0 ? <text x={76} y={433} fontSize={73} fontWeight={750}>Начнём с неприятного</text> : opening ? <Opening time={timeMs}/> : timeMs<cue.heap ? <Queue time={timeMs}/> : <Memory time={timeMs}/>}
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile(media+'voice-intro.m4a')}/>}
  </AbsoluteFill>;
}
