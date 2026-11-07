import {DivergentRead} from '../../shared/architecture/DivergentRead';
import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import {Note} from './Drawings';
import {accepted, cue, replicas, newBody, oldBody, type Replica, type ShotProps} from './scene';

const writes = replicas.filter(accepted);
const readPair = (ms:number):readonly Replica[] => {
  if (ms >= cue.bc) return ['B','C'];
  if (ms >= cue.ac) return ['A','C'];
  return ['A','B'];
};
const Mark: React.FC<{x:number; y:number; present:boolean}> = ({x,y,present}) =>
  <g transform={`translate(${x} ${y})`}>
    {present ? <path d="M-39 0 l25 27 58 -66" fill="none" stroke={ink.text} strokeWidth={13}
      strokeLinejoin="round" strokeLinecap="round" /> : <path d="M-23 0 h46" stroke={ink.muted} strokeWidth={5} />}
  </g>;

const Pairs: React.FC<ShotProps> = ({timeMs}) => {
  const showWrites=timeMs>=cue.wrote, selected=timeMs>=cue.ab;
  const read=readPair(timeMs);
  const overlap=read.filter(accepted);
  return <g>
    <Title>{timeMs>=cue.intersection ? 'Пересечение кворумов' : 'Чтение с QUORUM'}</Title>
    {replicas.map((host,i) => {
      const xpos=820+i*505;
      const common=selected && accepted(host) && read.includes(host);
      return <g key={host}>
        <Note x={xpos} y={315} host={host} scale={0.78} detail="№107" value={accepted(host) ? newBody : oldBody}/>
        {common && <path d={`M${xpos+210} 663 l-3 305`} stroke={ink.primary} strokeWidth={20}/>}
        {showWrites && <Mark x={xpos+210} y={680} present={accepted(host)}/>}
        {selected && <Mark x={xpos+210} y={949} present={read.includes(host)}/>}
      </g>;
    })}
    {showWrites && <text x={206} y={702} fontSize={65}>Записали</text>}
    {timeMs>=cue.two && <text x={206} y={970} fontSize={65}>Читаем две</text>}
    {selected && <text x={205} y={1208} fontSize={64} fontWeight={650}>
      {overlap.length===2 ? 'Общие реплики' : 'Общая реплика'} — {overlap.join(' и ')}
    </text>}
  </g>;
};

const Formula: React.FC<ShotProps> = ({timeMs}) => {
  const terms=[
    {symbol:'W',value:writes.length,label:'подтвердили запись',at:cue.w,x:485},
    {symbol:'R',value:readPair(timeMs).length,label:'ответили на чтение',at:cue.r,x:1210},
    {symbol:'RF',value:replicas.length,label:'копии',at:cue.rfMeaning,x:1940},
  ];
  return <g>
    <Title>Пересечение кворумов</Title>
    {terms.map(t=><g key={t.symbol} textAnchor="middle">
      <text x={t.x} y={489} fontSize={129} fontWeight={650}>{t.symbol}</text>
      <text x={t.x} y={790} fontSize={146} fontWeight={650}>{t.value}</text>
      {timeMs>=t.at && <text x={t.x} y={915} fontSize={49} fill={ink.muted}>{t.label}</text>}
    </g>)}
    {[489,790].map(y=><g key={y} textAnchor="middle" fontSize={104}>
      <text x={843} y={y}>+</text><text x={1575} y={y}>&gt;</text>
    </g>)}
    {timeMs>=cue.assumptions && <text x={232} y={1165} fontSize={52}>Те же три реплики · одна правка сообщения</text>}
  </g>;
};

export const Intersection: React.FC<ShotProps> = ({timeMs}) => {
  if (timeMs < cue.condition) return <Pairs timeMs={timeMs}/>;
  if (timeMs < cue.final) return <Formula timeMs={timeMs}/>;
  return <DivergentRead />;
};
