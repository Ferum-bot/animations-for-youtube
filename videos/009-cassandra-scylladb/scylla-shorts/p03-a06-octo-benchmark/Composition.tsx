import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {arrive, easing, mix, progress, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {PresenterPane} from '../../history-shorts/PresenterPane';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {Article} from './Article';
import {cue} from './score';

const media = 'generated/009-cassandra-scylladb/scylla-shorts/06/';
const camera = [{from:0, to:cue.article, file:media+'presenter.mp4', trim:0}];

function Opening({time}: {readonly time:number}) {
  const reveal = progress(time,cue.presenter-420,cue.presenter,easing.transform);
  return <g transform={`translate(0 ${mix(345,0,reveal)})`}>
    <text x={74} y={240} fontSize={71} fontWeight={735}>ScyllaDB быстрее</text>
    <text x={74} y={336} fontSize={71} fontWeight={735}>Cassandra</text>
    <text x={74} y={603} fontSize={121} fontWeight={745}>в 10 раз?</text>
    <path d={`M77 655 h${528*arrive(time,2660,630)}`} stroke={ink.primary} strokeWidth={8}/>
  </g>;
}

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  const opening = timeMs < cue.article;
  return <AbsoluteFill data-scylla-octo="" style={{background:ink.background, fontFamily:ink.fontSans}}>
    <PresenterPane cuts={camera}/>
    <div style={{position:'absolute', width:1080, height:opening && timeMs>=cue.presenter?1056:1920, overflow:'hidden', background:ink.background,
      transformOrigin:'top left', transform:`scale(${width/1080})`}}>
      {timeMs >= cue.endCard ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Два теста ScyllaDB и Cassandra инженерами OCTO в 2015 году">
          {opening ? <Opening time={timeMs}/> : <Article time={timeMs}/>}
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile(media+'voice.m4a')}/>}
  </AbsoluteFill>;
}
