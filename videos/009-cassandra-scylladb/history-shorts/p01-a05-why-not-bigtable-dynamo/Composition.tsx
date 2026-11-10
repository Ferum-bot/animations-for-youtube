import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {Alternatives, Outcome} from './Alternatives';
import {Archive} from './Archive';

const voiceEnd=31100;

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs}=useSceneTime(), {width}=useVideoConfig();
  return <AbsoluteFill data-history-papers="" style={{backgroundColor:ink.background,fontFamily:ink.fontSans}}>
    <div style={{position:'absolute',width:1080,height:1920,overflow:'hidden',
      transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=voiceEnd ? <FullEpisodeCard elapsedMs={timeMs-voiceEnd}/> :
        <svg width="1080" height="1920" role="img" aria-label="Почему Facebook создал Cassandra" style={{fill:ink.text}}>
          {timeMs<14800 ? <Alternatives time={timeMs}/> : timeMs<23200 ? <Archive time={timeMs}/> : <Outcome time={timeMs}/>}
        </svg>}
    </div>
    {withAudio && timeMs<voiceEnd && <Audio src={staticFile('generated/009-cassandra-scylladb/history-shorts/05/voice.m4a')}/>}
  </AbsoluteFill>;
}
