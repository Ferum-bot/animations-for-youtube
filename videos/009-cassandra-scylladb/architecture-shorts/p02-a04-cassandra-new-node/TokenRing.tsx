import React from 'react';
import {easing, progress, v2Theme as ink} from '@channel/motion-v2';
import {cue} from './score';

const radius = 303;
// Clockwise on the signed 64-bit ring, starting at its minimum at twelve o'clock.
const chatToken = -7160136740246525330n;
const tokenAngle = Number(chatToken + 2n ** 63n) / 2 ** 64 * 360;
const boundaries = [
  {end: 0, owner: 'C'}, {end: 80, owner: 'A'}, {end: 205, owner: 'B'},
] as const;

function point(angle: number, distance = radius) {
  const radians = (angle - 90) * Math.PI / 180;
  return {x: 506 + distance * Math.cos(radians), y: 855 + distance * Math.sin(radians)};
}

function Band({from, to, amount}: {readonly from: number; readonly to: number; readonly amount: number}) {
  const a = point(from), b = point(to);
  return <path d={`M${a.x} ${a.y} A${radius} ${radius} 0 0 1 ${b.x} ${b.y}`}
    fill="none" stroke={ink.primary} strokeWidth={20} pathLength={1}
    strokeDasharray="1" strokeDashoffset={1-amount}/>;
}

function Boundary({angle, name}: {readonly angle: number; readonly name: string}) {
  const node = point(angle), label = point(angle, radius+65);
  return <g>
    <circle cx={node.x} cy={node.y} r={15} fill={name === 'D' ? ink.primary : ink.text}
      stroke={ink.background} strokeWidth={4}/>
    <text x={label.x} y={label.y+18} fontSize={56} textAnchor="middle" fontWeight={700}>{name}</text>
  </g>;
}

export function TokenRing({time}: {readonly time: number}) {
  const marker = point(tokenAngle);
  const adding = time >= cue.add;
  const multiple = time >= cue.secondRange;
  const reveal = (at: number) => progress(time, at, at + 900, easing.transform);
  return <g opacity={reveal(cue.ring)}>
    <circle cx={506} cy={855} r={radius} fill="none" stroke={ink.muted} strokeWidth={8}/>
    {time >= cue.locate && !adding && <Band from={0} to={80} amount={reveal(cue.locate)}/>}
    {adding && <Band from={80} to={150} amount={reveal(cue.add)}/>}
    {multiple && <Band from={205} to={280} amount={reveal(cue.secondRange)}/>}
    <g opacity={reveal(cue.ranges)}>
      {boundaries.map(b => <Boundary key={b.owner} angle={b.end} name={b.owner}/>)}
    </g>
    {adding && <Boundary angle={150} name="D"/>}
    {multiple && <Boundary angle={280} name="D"/>}
    <circle cx={marker.x} cy={marker.y} r={12} fill={ink.text} stroke={ink.background} strokeWidth={4}/>
    <text x={marker.x+17} y={marker.y-28} fontSize={43} fontWeight={650}>чат 42</text>
    {time >= cue.locate && <text x={506} y={880} fontSize={63} fontWeight={740} textAnchor="middle">
      {adding ? multiple ? 'B, C → D' : 'B → D' : 'Чат 42 → A'}
    </text>}
    <text x={84} y={1360} fontSize={52} fontWeight={650}>
      {adding ? 'Чат 42 остаётся на A' : 'Токен чата 42'}
    </text>
    <text x={84} y={1438} fontSize={43} fill={ink.text}>
      {adding ? time >= cue.vnodes ? 'Две метки D — один сервер' :
        multiple ? 'D получает ещё и часть диапазона C' : 'D получает часть диапазона B' : '−7160136740246525330'}
    </text>
    <text x={84} y={1533} fontSize={35} fill={ink.muted}>На схеме одна копия каждой партиции</text>
  </g>;
}
