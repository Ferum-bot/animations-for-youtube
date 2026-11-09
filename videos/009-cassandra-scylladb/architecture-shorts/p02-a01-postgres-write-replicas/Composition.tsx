import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {Diagram} from './Diagram';
import {cue} from './score';

const headlines = [
  {at: 0, lines: ['Почему реплика Postgres', 'не ускоряет запись?']},
  {at: cue.split, lines: ['Разделим чаты', 'между узлами']},
  {at: cue.name, lines: ['Два шарда пишут', 'параллельно']},
  {at: cue.compare, lines: ['Шард делит данные.', 'Реплика их копирует.']},
  {at: cue.cassandra, lines: ['В Cassandra это', 'уже встроено']},
] as const;

const Composition: React.FC<{readonly withAudio?: boolean}> = ({withAudio = true}) => {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  const title = headlines.reduce((last, next) => timeMs >= next.at ? next : last, headlines[0]);
  return <AbsoluteFill style={{backgroundColor:ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/postgres-write-replicas.m4a')}/>}
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" role="img" aria-label="Почему реплика Postgres не ускоряет запись"
      style={{fill:ink.text,fontFamily:ink.fontSans}}>
      <g fontSize={timeMs < cue.split ? 72 : 78} fontWeight={760} letterSpacing={-3}>
        {title.lines.map((line,i) => <text key={i} x={71} y={190+i*88}>{line}</text>)}
      </g>
      {timeMs < cue.cassandra ? <Diagram time={timeMs}/> : <g>
        <CassandraCopies y={590} chat={42} nodes={['A','B','C']}/>
        <CassandraCopies y={1110} chat={17} nodes={['B','C','D']}/>
      </g>}
    </svg>
  </AbsoluteFill>;
};

function CassandraCopies({chat,nodes,y}: {readonly chat:number; readonly nodes:readonly string[]; readonly y:number}) {
  return <g transform={`translate(80 ${y})`}>
    <text fontSize={46} fontWeight={650}>Чат {chat}</text>
    {nodes.map((node,i) => <g key={node} transform={`translate(${i*278} 53)`}>
      <path d="M4 8 L230 2 L234 118 L2 124 Z" stroke={ink.text} strokeWidth={4} fill={ink.surface}/>
      <text x={116} y={75} textAnchor="middle" fontSize={43}>узел {node}</text>
    </g>)}
  </g>;
}
export default Composition;
