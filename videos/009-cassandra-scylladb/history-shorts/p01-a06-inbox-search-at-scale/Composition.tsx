import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {easing, mix, progress, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {inboxSource} from '../../shared/history-sources';
import {FocusPage} from '../p01-a01-facebook-inbox-search/FocusPage';
import {PresenterPane} from '../PresenterPane';
import {Announcement} from './Announcement';
import {Results} from './Results';

const media='generated/009-cassandra-scylladb/history-shorts/06/';
const fullScreenAt=15733.333;
const voiceEnd=26200;
const camera=[{from:0,to:fullScreenAt,file:media+'presenter.mp4',trim:0}];
const searchTerm=[{text:'stanford',x:175,y:81,width:49,height:11,at:430,finalWidth:398}];

function Inbox({time}: {readonly time:number}) {
  return <g>
    <text x={73} y={160} fontSize={55}>Facebook · июнь 2008</text>
    <g fontSize={75} fontWeight={740} letterSpacing={-2}>
      <text x={69} y={288}>Как быстро Cassandra</text>
      <text x={69} y={377}>находила сообщения?</text>
    </g>
    <foreignObject x={69} y={476} width={940} height={370}>
      <FocusPage file={inboxSource.image} alt="Поиск по переписке Facebook в 2008 году"
        width={643} height={242} paper="white" color="#222" passages={searchTerm} time={time+520} enter={0}/>
    </foreignObject>
    <text x={72} y={928} fontSize={47}>Запуск Inbox Search</text>
  </g>;
}

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs}=useSceneTime();
  const {width}=useVideoConfig();
  const expand=progress(timeMs,14800,fullScreenAt,easing.transform);
  return <AbsoluteFill data-history-launch-short="" style={{backgroundColor:ink.background,fontFamily:ink.fontSans}}>
    <PresenterPane cuts={camera}/>
    <div style={{position:'absolute',width:1080,height:mix(1056,1920,expand),overflow:'hidden',
      backgroundColor:ink.background,transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=voiceEnd ? <FullEpisodeCard elapsedMs={timeMs-voiceEnd}/> :
        <svg width="1080" height="1920" style={{fill:ink.text}} role="img" aria-label="Запуск и скорость поиска Facebook Inbox">
          {timeMs<3370 ? <Inbox time={timeMs}/> : timeMs<17300 ? <Results time={timeMs}/> : <Announcement time={timeMs}/>}
        </svg>}
    </div>
    {withAudio && timeMs<voiceEnd && <Audio src={staticFile(media+'voice.m4a')}/>}
  </AbsoluteFill>;
}
