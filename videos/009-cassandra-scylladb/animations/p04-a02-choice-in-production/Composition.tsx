import React from 'react';
import {Audio} from '@remotion/media';
import {arrive, productionCanvas, SceneStage, SourceImage, useSceneTime, v2Theme} from '@channel/motion-v2';
import {Sequence, staticFile, useVideoConfig} from 'remotion';
import {ReadArticle} from '../../shared/source-reading/ReadArticle';
import metadata from './animation.json';
import documents from './documents.json';
import {score, type Shot} from './score';

const {width, height} = productionCanvas;
const asset = (id: string) => 'assets/009-cassandra-scylladb/p04-choice/' + id + '.webp';

const Exhibit: React.FC<{id: Extract<Shot, {kind: 'exhibit'}>['id']; ms: number}> = ({id, ms}) => {
  switch (id) {
    case 'author':
      return <>
        <SourceImage src={asset('bo')} x={326} y={165} width={880} height={880}/>
        <text x={326} y={1182} fontSize={104} fontWeight={670}>Бо Ингрэм</text>
        <text x={331} y={1260} fontSize={48} opacity={0.79}>Инженер Discord</text>
        <g opacity={arrive(ms, 1640, 420)}>
          <SourceImage src={asset('book')} x={1440} y={137} width={880} height={1103}/>
          <text x={1880} y={1325} textAnchor="middle" fontSize={39} opacity={0.79}>Manning Publications</text>
        </g>
      </>;
    case 'docstore-architecture':
      return <>
        <rect width={width} height={height} fill="white"/>
        <SourceImage src={asset(id)} x={115} y={184} width={1450} height={1000}/>
        <g fill={v2Theme.background}>
          <text x={1700} y={581} fontSize={54}>Uber Engineering</text>
          <text x={1695} y={713} fontSize={112} fontWeight={680}>Docstore</text>
          <text x={1700} y={807} fontSize={50}>Архитектура базы</text>
          <text x={1700} y={890} fontSize={41} opacity={0.75}>Рис. 2 · 2021</text>
        </g>
      </>;
    case 'netflix-abstraction':
    case 'netflix-namespace':
      return <SourceImage src={asset(id)} x={0} y={0} width={width} height={height}/>;
  }
};

const SourceShot: React.FC<{shot: Shot}> = ({shot}) => {
  const {timeMs} = useSceneTime();
  return <SceneStage label="Выбор базы в production" transparent={false}>
    {shot.kind === 'page'
      ? <ReadArticle src={asset(shot.id)} source={documents[shot.id]} beats={shot.beats} ms={timeMs}/>
      : <Exhibit id={shot.id} ms={timeMs}/>}
  </SceneStage>;
};

const Composition: React.FC<{readonly withAudio?: boolean}> = ({withAudio = false}) => {
  const {fps} = useVideoConfig();
  const frame = (ms: number) => Math.round(ms * fps / 1000);
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/choice-in-production-excerpt.m4a')}/>}
    {score.map((shot, i) => <Sequence key={shot.at} name={shot.id} from={frame(shot.at)}
      durationInFrames={frame(score[i + 1]?.at ?? metadata.durationMs) - frame(shot.at)} premountFor={Math.round(fps / 2)}>
      <SourceShot shot={shot}/>
    </Sequence>)}
  </>;
};

export default Composition;
