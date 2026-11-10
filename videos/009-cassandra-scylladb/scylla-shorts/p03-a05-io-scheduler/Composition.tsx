import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {easing, mix, progress, SourceImage, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {DiskWork} from './DiskWork';
import {cue} from './score';

function Figure({time}: {readonly time: number}) {
  const zoom = progress(time,cue.zoomFigure,cue.zoomFigure+1500,easing.transform);
  // Figure 5 sits near the bottom of page 11. Zoom the actual diagram to the viewport width.
  const scale = mix(1.75,2.35,zoom);
  return <g>
    <rect width={1080} height={1920} fill="white"/>
    <g transform={`translate(${mix(0,-207,zoom)} ${mix(446,-557,zoom)}) scale(${scale})`}>
      <SourceImage src="assets/009-cassandra-scylladb/p03-origins-engine/scheduler.webp"
        x={0} y={0} width={618} height={618*2750/2125}/>
    </g>
    <rect width={1080} height={446} fill={ink.background}/>
    <g fontSize={67} fontWeight={740}>
      <text x={72} y={161}>Как ScyllaDB делит диск</text>
      <text x={72} y={252}>между запросами</text>
      <text x={72} y={343}>и compaction?</text>
    </g>
    <rect y={1478} width={1080} height={442} fill={ink.background}/>
    <text x={74} y={1562} fontSize={38}>ScyllaDB · 7 Design Principles, рис. 5</text>
  </g>;
}

export default function Composition({withAudio=true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  return <AbsoluteFill data-scylla-io="" style={{background:ink.background, fontFamily:ink.fontSans}}>
    <div style={{width:1080,height:1920,transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs >= cue.endCard ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Планировщик дисковых операций ScyllaDB">
          {timeMs < cue.example ? <Figure time={timeMs}/> : <DiskWork time={timeMs}/>}
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/scylla-shorts/05/voice.m4a')}/>}
  </AbsoluteFill>;
}
