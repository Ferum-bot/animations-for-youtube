import {arrive, mix, presence, MessageIcon, Magnifier, v2Theme, Pocket, Slip} from '@channel/motion-v2';
import React from 'react';
import {timing as t, type SceneProps} from './scene';

// Finite qualitative example. Each arrival adds a record; no decorative loop.
const deliveries = [0, 1100, 2200, 3400, 4700, 6100, 7600] as const;

export const LoadScene: React.FC<SceneProps> = ({timeMs}) => <g opacity={presence(timeMs, t.load, t.quote)}>
  <Pocket x={1500} y={530} scale={1.6} label="Индекс">
    {deliveries.map((offset, i) => <g key={offset} opacity={arrive(timeMs, t.writes + offset + 700, 200)}>
      <path d={`M${62 + i * 6} ${110 - i * 18} L${400 + i * 4} ${104 - i * 18} L430 220 L64 224 Z`}
        fill={v2Theme.surface} stroke={v2Theme.text} strokeWidth={3} />
    </g>)}
  </Pocket>
  <MessageIcon x={250} y={660} scale={1.6} />
  {deliveries.map(offset => {
    const start = t.writes + offset;
    const move = arrive(timeMs, start, 800);
    return <g key={offset} opacity={presence(timeMs, start, start + 1000, 150)}
      transform={`translate(${mix(800, 1560, move)} ${mix(740, 700, move)}) scale(0.6)`}>
      <Slip x={0} y={0} width={550} word="слово" messageId="#…" />
    </g>;
  })}
  <g opacity={arrive(timeMs, t.search)} transform={`translate(${mix(1020, 1510, arrive(timeMs, t.search, 900))} 985)`}>
    <Magnifier x={0} y={0} scale={1.1} />
  </g>
  <g opacity={arrive(timeMs, t.writeIntensive)}>
    <text x={1880} y={400} textAnchor="middle" fontSize={68} fill={v2Theme.text}>Много записей</text>
  </g>
</g>;
