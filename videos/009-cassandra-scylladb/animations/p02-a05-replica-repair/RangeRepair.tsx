import React from 'react';
import {progress, v2Theme as ink} from '@channel/motion-v2';
import {Note} from '../../shared/architecture/ReplicaNote';
import {Title} from '../../shared/architecture/Title';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {replicas} from '../../shared/architecture/chat107';
import {cue, type ShotProps} from './scene';

// Both trees cover the same token range; leaf 2 is the only differing subrange.
const leaves=[-300,-100,100,300] as const;
const sections=['I','II','III','IV'] as const;
const divergent=2;
const parents=[{x:-200,children:[0,1]},{x:200,children:[2,3]}] as const;
const parentY=162, leafY=330, stripY=418;
const Leaf:React.FC<{x:number; index:number; highlighted:boolean; stale:boolean}> = ({x,index,highlighted,stale}) =>
  <g transform={`translate(${x} ${stripY})`}>
    <path d="M-96 -55 l192 -2 -1 117 -192 2 Z" stroke={highlighted ? ink.primary : ink.muted}
      strokeWidth={highlighted ? 10 : 4} fill={ink.surface}/>
    <text y={22} textAnchor="middle" fontWeight={600} fontSize={53}>{sections[index]}</text>
    {stale && <path d="M52 -51 l38 0 0 38 Z" fill={ink.text}/>}
  </g>;

const Tree:React.FC<{x:number; host:'B'|'C'; timeMs:number}> = ({x,host,timeMs}) => {
  const showTree=timeMs>=cue.tree;
  const traced=timeMs>=cue.compareRoot && timeMs<cue.synced;
  const branch=traced && timeMs>=cue.branch, leaf=traced && timeMs>=cue.leaf;
  const circle=(cx:number,cy:number,active:boolean) => <circle cx={cx} cy={cy} r={20}
    stroke={active ? ink.primary : ink.muted} strokeWidth={6} fill={active ? ink.primary : ink.surface}/>;
  return <g transform={`translate(${x} 475)`}>
    <text y={-146} fontWeight={650} textAnchor="middle" fontSize={70}>Реплика {host}</text>
    {showTree && <g strokeLinecap="round">
      {parents.map(({x:px,children},i)=><g key={px}>
        <path d={`M0 0 L${px} ${parentY}`} stroke={branch && i===1 ? ink.primary : ink.muted} strokeWidth={6}/>
        {children.map(j=><g key={j}>
          <path d={`M${px} ${parentY} L${leaves[j]} ${leafY}`} stroke={leaf && j===divergent ? ink.primary : ink.muted} strokeWidth={6}/>
          {circle(leaves[j],leafY,leaf && j===divergent)}
        </g>)}
        {circle(px,parentY,branch && i===1)}
      </g>)}
      {circle(0,0,traced)}
      {timeMs>=cue.compareRoot && timeMs<cue.synced && <text x={42} y={13} fontSize={45}>
        {host==='B' ? 'h₁' : 'h₂'}</text>}
    </g>}
    {timeMs>=cue.ranges ? leaves.map((lx,i)=><Leaf key={lx} x={lx} index={i}
      highlighted={leaf && i===divergent} stale={host==='C' && i===divergent && leaf}/>) :
      <g>
        <path d="M-397 365 l795 -4 -2 119 -794 3 Z" fill={ink.surface} stroke={ink.muted} strokeWidth={4}/>
        <text y={442} textAnchor="middle" fontSize={53}>(−80, 80]</text>
      </g>}
  </g>;
};
const streamRoute:Route = {from:{x:715,y:960},via:{x:1350,y:1248},to:{x:1995,y:960}};
export const RangeRepair:React.FC<ShotProps> = ({timeMs}) => {
  const sending=timeMs>=cue.stream && timeMs<cue.synced;
  let caption='Один диапазон токенов';
  if(timeMs>=cue.tree) caption='Дерево Меркла';
  if(timeMs>=cue.compareRoot) caption='Корневые хэши различаются';
  if(timeMs>=cue.leaf) caption='Расхождение на участке III';
  if(timeMs>=cue.synced) caption='Участок III синхронизирован';
  if(timeMs>=cue.schedule) caption='Сверка по расписанию';
  if(timeMs>=cue.caughtUp) caption='Данные диапазона на B и C совпадают';
  return <g>
    <Title>Anti-entropy repair</Title>
    <Tree x={615} host="B" timeMs={timeMs}/><Tree x={1895} host="C" timeMs={timeMs}/>
    {sending && <g><RouteLine route={streamRoute}/>
      <Delivery route={streamRoute} timeMs={timeMs} start={cue.stream} duration={cue.synced-cue.stream}/>
    </g>}
    <text x={1280} y={1250} textAnchor="middle" fontSize={65} fontWeight={600}>{caption}</text>
  </g>;
};

export const Availability:React.FC<ShotProps> = ({timeMs}) => {
  const down=timeMs<cue.oneDown ? 0 : timeMs<cue.twoDown ? 1 : 2;
  return <g>
    <Title>Сколько реплик осталось?</Title>
    <text x={270} y={378} fontSize={64}>RF = 3 · QUORUM = 2</text>
    {replicas.map((host,i)=><Note key={host} host={host} x={272+i*745} y={552} scale={0.96}
      detail="чат 42" offline={i>=replicas.length-down}/>)}
    <g transform="translate(277 1075)">
      <text fontSize={91} fontWeight={650}>На связи {replicas.length-down} из 3</text>
      {down>0 && <text x={1110} fontSize={65}>{down===1 ? 'Кворум есть' : 'Кворум недоступен'}</text>}
      {down===2 && <path d="M1110 30 h658" stroke={ink.primary} strokeWidth={10} pathLength={1}
        strokeDasharray="1" strokeDashoffset={1-progress(timeMs,cue.twoDown,cue.twoDown+520)}/>}
    </g>
  </g>;
};
