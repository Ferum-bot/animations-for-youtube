import React from 'react';
import {cues, reveal, type SceneProps} from './timing';
import {accent, Heading, Note, theme} from './ui';

export const Spiral: React.FC<SceneProps> = ({timeMs}) => {
  const phase = reveal(timeMs, cues.spiral + 1000, 10000);
  return <>
    <Heading title="Замедление усиливает само себя." kicker="ОЧЕРЕДЬ / ГОРИЗОНТ ВСЁ ЕЩЁ УДЕРЖИВАЕТСЯ" />
    <svg width={1400} height={500} viewBox="0 0 1400 500" style={{fontFamily: theme.fontSans}}>
      <path d="M420 130 H910 M1160 220 V365 H780 M550 365 H190 V230" stroke={theme.line} strokeWidth={3} fill="none" />
      <path d="M420 130 H910 M1160 220 V365 H780 M550 365 H190 V230" stroke={accent} strokeWidth={4} fill="none"
        pathLength={1} strokeDasharray="1" strokeDashoffset={1 - phase} />
      {[
        {x: 30, y: 50, title: 'Захват дольше', sub: 'Больше проверок версий', at: 0},
        {x: 930, y: 50, title: 'Воркеры отстают', sub: 'Задачи накапливаются', at: 2500},
        {x: 490, y: 290, title: 'Очередь растёт', sub: 'Работы при захвате больше', at: 5700},
      ].map(item => <g key={item.title} opacity={reveal(timeMs, cues.spiral + item.at)}>
        <rect x={item.x} y={item.y} width={440} height={155} fill={theme.background} />
        <text x={item.x + 20} y={item.y + 50} fill={theme.text} fontSize={37} fontWeight={600}>{item.title}</text>
        <text x={item.x + 20} y={item.y + 95} fill={theme.muted} fontSize={26}>{item.sub}</text>
        {item.at === 5700 ? Array.from({length: 12}, (_, i) => <rect key={i} x={item.x + 20 + i * 31} y={item.y + 119}
          width={22} height={18} fill={theme.signal} opacity={reveal(timeMs, cues.spiral + 5700 + i * 250)} />) : null}
      </g>)}
      <path d="M900 121 l12 9 -12 9 M793 356 l-12 9 12 9 M181 241 l9 -12 9 12" stroke={accent} strokeWidth={3} fill="none" opacity={phase} />
    </svg>
    <div style={{opacity: reveal(timeMs, cues.spiral + 10200)}}><Note color={theme.signal}>«Death spiral» — очередь не успевает разгрузиться.</Note></div>
  </>;
};
