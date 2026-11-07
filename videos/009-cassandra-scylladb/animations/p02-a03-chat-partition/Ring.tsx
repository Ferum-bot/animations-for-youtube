import React from 'react';
import {progress, v2Theme as ink} from '@channel/motion-v2';
import {cue, type ShotProps} from './scene';

const center = {x: 1765, y: 765};
const radius = 398;
const point = (degrees: number, r = radius) => {
  const angle = (degrees-90)*Math.PI/180;
  return {x:center.x + r*Math.cos(angle), y:center.y + r*Math.sin(angle)};
};
const arc = (from: number, to: number) => {
  const start = point(from), end = point(to);
  return `M${start.x} ${start.y} A${radius} ${radius} 0 ${to-from>180 ? 1 : 0} 1 ${end.x} ${end.y}`;
};
const nodes = [
  {end: 0, owner: 'C', startMs: cue.boundaries},
  {end: 80, owner: 'A', startMs: cue.boundaries},
  {end: 205, owner: 'B', startMs: cue.boundaries},
  {end: 150, owner: 'D', startMs: cue.add},
  {end: 280, owner: 'D', startMs: cue.vnodes},
] as const;
const partitionAngle = 40.26535543676591; // Murmur3 token of CQL int 42 on the signed 64-bit ring.
const Range: React.FC<{from:number; to:number; amount:number}> = ({from,to,amount}) =>
  <path d={arc(from,to)} fill="none" stroke={ink.primary} strokeWidth={18} pathLength={1}
    strokeDasharray="1" strokeDashoffset={1-amount} />;

export const Ring: React.FC<ShotProps> = ({timeMs}) => {
  const indicating = timeMs >= cue.locate && timeMs < cue.add;
  const marker = point(partitionAngle);
  return <g>
    <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke={ink.muted} strokeWidth={7} />
    {indicating && <Range from={0} to={80} amount={progress(timeMs,cue.locate,cue.locate+720)} />}
    {nodes.filter(n => n.owner === 'D' && timeMs>=n.startMs).map(n =>
      <Range key={n.end} from={n.end === 150 ? 80 : 205} to={n.end}
        amount={progress(timeMs,n.startMs,n.startMs+690)} />)}
    {nodes.filter(n => timeMs>=n.startMs).map(n => {
      const endpoint = point(n.end), label = point(n.end,radius+80);
      return <g key={n.end}>
        <circle cx={endpoint.x} cy={endpoint.y} r={16} fill={n.owner === 'D' ? ink.primary : ink.text} />
        <text x={label.x} y={label.y+20} textAnchor="middle" fontSize={59} fontWeight={650}>{n.owner}</text>
      </g>;
    })}
    <circle cx={marker.x} cy={marker.y} r={13} fill={ink.text} stroke={ink.background} strokeWidth={4}/>
    {timeMs < cue.add && <text x={marker.x+32} y={marker.y-16} fontSize={44}>чат 42</text>}
    {timeMs >= cue.vnodes && <text x={center.x} y={center.y+18} textAnchor="middle" fontSize={54}>Узел D</text>}
  </g>;
};
