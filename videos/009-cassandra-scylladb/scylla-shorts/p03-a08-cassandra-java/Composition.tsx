import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {arrive, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {PresenterPane} from '../../history-shorts/PresenterPane';
import {Benchmark} from './Benchmark';
import {cue} from './score';

const media = 'generated/009-cassandra-scylladb/scylla-shorts/08/';
const camera = [{from:cue.conclusion,to:cue.endCard,file:media+'presenter.mp4',trim:0}];

function Verdict({time}: {readonly time:number}) {
  if (time<cue.workloadQuestion) return <g fontSize={76} fontWeight={740}>
    <text x={74} y={335}>Выбирать базу</text>
    <text x={74} y={435}>по языку?</text>
  </g>;
  if (time<cue.backToCamera) return <g>
    <text x={74} y={268} fontSize={65} fontWeight={730}>Работающий кластер</text>
    <text x={74} y={730} fontSize={64}>Выдерживает нагрузку?</text>
    <g opacity={arrive(time,cue.teamQuestion,360)} fontSize={61}>
      <text x={74} y={1050}>Команда умеет</text>
      <text x={74} y={1133}>его обслуживать?</text>
    </g>
  </g>;
  if (time<cue.newProject) return <g fontSize={64} fontWeight={740}>
    <text x={74} y={300}>Одной Java мало,</text>
    <text x={74} y={395}>чтобы затевать переезд</text>
  </g>;
  return <g>
    <text x={74} y={248} fontSize={58}>Для нового проекта</text>
    <text x={74} y={422} fontSize={73} fontWeight={745}>Мой выбор — ScyllaDB</text>
  </g>;
}

function Story({time}: {readonly time:number}) {
  if (time<cue.article) return <g fontSize={77} fontWeight={745}>
    <text x={74} y={680}>Уходить с Cassandra</text>
    <text x={74} y={787}>только из-за Java?</text>
  </g>;
  if (time<cue.conclusion) return <Benchmark time={time}/>;
  return <Verdict time={time}/>;
}

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  const presenter = (timeMs>=cue.conclusion && timeMs<cue.workloadQuestion) || (timeMs>=cue.backToCamera && timeMs<cue.endCard);
  return <AbsoluteFill data-scylla-java="" style={{background:ink.background,fontFamily:ink.fontSans}}>
    <PresenterPane cuts={camera}/>
    <div style={{position:'absolute',width:1080,height:presenter?1056:1920,overflow:'hidden',background:ink.background,
      transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=cue.endCard ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Стоит ли уходить с Cassandra только из-за Java?">
          <Story time={timeMs}/>
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile(media+'voice.m4a')}/>}
  </AbsoluteFill>;
}
