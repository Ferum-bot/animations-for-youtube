import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {SourceImage, easing, mix, progress, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {PresenterPane} from '../../history-shorts/PresenterPane';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {OwnedShards, SharedCounter} from './Board';
import {cue} from './score';

const media = 'generated/009-cassandra-scylladb/scylla-shorts/02/';
const presenter = [{from: 0, to: cue.sharedCounter, file: media+'presenter.mp4', trim: 0}];
const clusterMap = 'assets/009-cassandra-scylladb/p03-origins-engine/cluster-map.webp';

function ClusterMap({time}: {time: number}) {
  const zoom = progress(time, cue.zoom, cue.zoom+1500, easing.transform);
  // Center the source's first node and its CPU cores as the narrator moves inside the server.
  const width = mix(1500, 2650, zoom);
  return <g>
    <text x={74} y={194} fontSize={75} fontWeight={750}>ScyllaDB</text>
    <text x={74} y={290} fontSize={61}>{time < cue.zoom ? 'Между серверами' : 'Внутри сервера'}</text>
    <svg x={0} y={570} width={1080} height={670} viewBox="0 0 1080 670" overflow="hidden">
      <rect width={1080} height={670} fill="white"/>
      <SourceImage src={clusterMap} x={mix(-18,-1550,zoom)} y={mix(65,120,zoom)}
        width={width} height={width*848/2572}/>
    </svg>
    <text x={74} y={1340} fontSize={39}>ScyllaDB · Shard-per-Core Architecture</text>
  </g>;
}

function Explanation({time}: {time: number}) {
  if (time < cue.sharedCounter) return <g fontWeight={750} fontSize={76}>
    <text x={74} y={284}>Вдвое больше ядер.</text>
    <text x={74} y={403}>Вдвое быстрее?</text>
  </g>;
  if (time < cue.cluster) return <SharedCounter time={time}/>;
  if (time < cue.shards) return <ClusterMap time={time}/>;
  return <OwnedShards time={time}/>;
}

export default function Composition({withAudio=true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  const opening = timeMs < cue.sharedCounter;
  return <AbsoluteFill data-scylla-cores="" style={{background: ink.background, fontFamily: ink.fontSans}}>
    <PresenterPane cuts={presenter}/>
    <div style={{position:'absolute', width:1080, height:opening ? 1056 : 1920, overflow:'hidden',
      background:ink.background, transformOrigin:'top left', transform:`scale(${width/1080})`}}>
      {timeMs >= cue.endCard
        ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/>
        : <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Два ядра и владельцы данных">
          <Explanation time={timeMs}/>
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile(media+'voice.m4a')}/>}
  </AbsoluteFill>;
}
