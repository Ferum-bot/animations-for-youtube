import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {cue} from './score';

const leaves = ['I', 'II', 'III', 'IV'] as const;
const x = (index: number) => 170 + 210 * index;
const differs = 2;

// One diagram overlays the two trees for the same range. Symbols compare B and C.
export function RangeComparison({time}: {readonly time: number}) {
  const synced = time >= cue.synced;
  const showTree = time >= cue.tree;
  const marked = time >= cue.leaf && !synced;
  function node(cx: number, cy: number, divergent: boolean, at: number) {
    const compared = time >= at;
    const mismatch = compared && divergent && !synced;
    return <g>
      <circle cx={cx} cy={cy} r={31} fill={mismatch ? ink.primary : ink.background} stroke={mismatch ? ink.primary : ink.muted} strokeWidth={4}/>
      {compared && <text x={cx} y={cy+15} textAnchor="middle" fontSize={45} fontWeight={700}>{mismatch ? '≠' : '='}</text>}
    </g>;
  }
  let caption = 'Один диапазон у B и C';
  if (showTree) caption = 'Сравниваем хеши B и C';
  if (marked) caption = 'Различается участок III';
  if (time >= cue.stream && !synced) caption = 'B передаёт участок III на C';
  if (synced) caption = 'Данные диапазона совпадают';
  return <g>
    <text x={80} y={879} fontSize={50} fontWeight={640}>{showTree ? 'Дерево Меркла' : 'Сверка диапазона'}</text>
    {showTree && <g>
      {[0,1].map(side => {
        const parent = x(side*2)+105;
        return <g key={side} strokeWidth={5}>
          <path d={`M485 980 L${parent} 1080`} stroke={side === 1 && time >= cue.branch && !synced ? ink.primary : ink.muted}/>
          {[0,1].map(child => {
            const index = side*2+child;
            return <path key={child} d={`M${parent} 1080 L${x(index)} 1210`} stroke={marked && index === differs ? ink.primary : ink.muted}/>;
          })}
          {node(parent, 1080, side === 1, cue.branch)}
        </g>;
      })}
      {node(485,980,true,cue.root)}
    </g>}
    {leaves.map((name, i) => <g key={name}>
      {showTree && node(x(i),1210,i === differs,cue.leaf)}
      <text x={x(i)} y={1309} fontSize={52} fontWeight={650} textAnchor="middle">{name}</text>
    </g>)}
    <text x={80} y={1470} fontSize={51} fontWeight={640}>{caption}</text>
  </g>;
}
