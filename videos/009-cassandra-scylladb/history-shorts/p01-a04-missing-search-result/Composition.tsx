import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {PresenterPane} from '../PresenterPane';
import {IndexScene} from './IndexScene';
import {Transcript} from './Transcript';

const media='generated/009-cassandra-scylladb/history-shorts/04/';
const fullScreenAt=25433;
const camera=[{from:0,to:fullScreenAt,file:media+'presenter.mp4',trim:0}];
const quoteAt=44000;
const voiceEnd=49400;

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs}=useSceneTime(), {width}=useVideoConfig();
  return <AbsoluteFill data-history-missing="" style={{backgroundColor:ink.background,fontFamily:ink.fontSans}}>
    <PresenterPane cuts={camera}/>
    <div style={{position:'absolute',width:1080,height:timeMs<fullScreenAt?1056:1920,overflow:'hidden',
      transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=voiceEnd ? <FullEpisodeCard elapsedMs={timeMs-voiceEnd}/> :
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{fill:ink.text}} aria-label="Сообщение и его поисковый индекс">
          {timeMs>=quoteAt ? <Transcript elapsed={timeMs-quoteAt}/> : <IndexScene time={timeMs}/>}
        </svg>}
    </div>
    {withAudio && timeMs<voiceEnd && <Audio src={staticFile(media+'voice.m4a')}/>}
  </AbsoluteFill>;
}
