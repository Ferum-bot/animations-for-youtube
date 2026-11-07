import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence, staticFile, useVideoConfig} from 'remotion';
import {arrive, easing, mix, productionCanvas, progress, SceneStage, SourceImage, SourcePage, useSceneTime} from '@channel/motion-v2';
import {SourceCaption} from '../../shared/source-reading/SourceCaption';
import metadata from './animation.json';
import documents from './documents.json';
import {score, type Shot} from './score';

const {width, height} = productionCanvas;
const asset = (id: string) => 'assets/009-cassandra-scylladb/p03-benchmarks/' + id + '.webp';

const ReadArticle: React.FC<{shot: Extract<Shot, {kind: 'page'}>; ms: number}> = ({shot, ms}) => {
  const source = documents[shot.id];
  const viewport = source.width * height / width;
  // Keep both the column headers and the selected bottom row on screen.
  const focusHeight = shot.id === 'bench-table' ? 0.60 : 0.40;
  let scroll = 0;
  let active: (typeof shot.beats)[number] | undefined;
  for (const beat of shot.beats) {
    if (ms < beat.at) break;
    const firstLine = beat.highlights[0];
    if (!firstLine) continue;
    const target = Math.max(0, Math.min(source.height - viewport, firstLine.y - viewport * focusHeight));
    // Get the reader to the passage first; allow subsequent selections on the same
    // line (e.g. columns of one table) to change without moving the page.
    scroll = mix(scroll, target, progress(ms - beat.at, 0, 660, easing.transform));
    active = beat;
  }
  const age = active ? ms - active.at : 0;
  return <>
    <SourcePage src={asset(shot.id)} sourceWidth={source.width} sourceHeight={source.height}
      scrollY={scroll} highlights={active?.highlights} selection={arrive(age, 410, 320)}
      highlightOpacity={0.43} blur={active?.caption ? arrive(age, 650, 280) * 0.45 : 0}/>
    {active?.caption && <SourceCaption caption={active.caption} amount={arrive(age, 540, 310)}/>}
  </>;
};

const OriginalFigure: React.FC<{shot: Extract<Shot, {kind: 'figure'}>; ms: number}> = ({shot, ms}) => {
  if (shot.id === 'discord-figure') return <>
    <rect width={width} height={height} fill="white"/>
    <SourceImage src={asset(shot.id)} x={0} y={44} width={width} height={1040}/>
    <SourceCaption caption={shot.caption} amount={arrive(ms, 290, 330)}/>
  </>;
  // First read the published headings and all three results. Then move the
  // ranking up just enough to put the editorial footnote below the last value.
  const lift = progress(ms, 2250, 2970, easing.transform);
  return <>
    <SourceImage src={asset(shot.id)} x={0} y={-234 * lift} width={width} height={width * 818 / 1316}/>
    <SourceCaption caption={shot.caption} amount={arrive(ms, 2530, 440)}/>
  </>;
};

const SourceShot: React.FC<{shot: Shot}> = ({shot}) => {
  const {timeMs} = useSceneTime();
  return <SceneStage label="Проверяем результаты по первоисточнику" transparent={false}>
    {shot.kind === 'page' ? <ReadArticle shot={shot} ms={timeMs}/> : <OriginalFigure shot={shot} ms={timeMs}/>}
  </SceneStage>;
};

const Composition: React.FC<{readonly withAudio?: boolean}> = ({withAudio = false}) => {
  const {fps} = useVideoConfig();
  const frame = (ms: number) => Math.round(ms * fps / 1000);
  return <>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/scylla-benchmarks-excerpt.m4a')}/>}
    {score.map((shot, i) => <Sequence key={shot.at} name={shot.id} from={frame(shot.at)}
      durationInFrames={frame(score[i + 1]?.at ?? metadata.durationMs) - frame(shot.at)} premountFor={Math.round(fps / 2)}>
      <SourceShot shot={shot}/>
    </Sequence>)}
  </>;
};

export default Composition;
