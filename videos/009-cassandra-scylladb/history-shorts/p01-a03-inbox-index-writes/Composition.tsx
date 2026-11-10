import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {OneMessage, TenWords, Traffic} from './IndexStory';

const scenes = [
  {at:0, title:['Почему поиску нужно','столько записей?'], draw:OneMessage},
  {at:20500, title:['А если в сообщении','десять разных слов?'], draw:TenWords},
  {at:29500, title:['Пишут постоянно,','ищут редко'], draw:Traffic},
] as const;

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs}=useSceneTime(), {width}=useVideoConfig();
  const {title,draw:Scene}=scenes.reduce((last,next)=>timeMs>=next.at?next:last,scenes[0]);
  return <AbsoluteFill style={{backgroundColor:ink.background,fontFamily:ink.fontSans}}>
    <div data-history-index-writes="" style={{position:'absolute',width:1080,height:1920,overflow:'hidden',
      transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=44400 ? <FullEpisodeCard elapsedMs={timeMs-44400}/> :
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" role="img" aria-label="Поисковый индекс Facebook Inbox" style={{fill:ink.text}}>
          {title.map((line,i)=><text key={line} x={72} y={183+i*87} fontSize={76} fontWeight={760} letterSpacing={-3}>{line}</text>)}
          <Scene time={timeMs}/>
        </svg>}
    </div>
    {withAudio && timeMs<44400 && <Audio src={staticFile('generated/009-cassandra-scylladb/history-shorts/03/voice.m4a')}/>}
  </AbsoluteFill>;
}
