import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {Presenter, media} from './Presenter';
import {Archive} from './Archive';

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs}=useSceneTime();
  const {width}=useVideoConfig();
  const end=timeMs>=41400;
  return <AbsoluteFill style={{backgroundColor:ink.background}}>
    {!end && <Presenter/>}
    <div style={{position:'absolute',top:0,left:0,width:1080,height:end?1920:1056,
      transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {end ? <FullEpisodeCard elapsedMs={timeMs-41400}/> : <Archive time={timeMs}/>}
    </div>
    {!end && withAudio && <Audio src={media('voice.m4a')}/>}
  </AbsoluteFill>;
}
