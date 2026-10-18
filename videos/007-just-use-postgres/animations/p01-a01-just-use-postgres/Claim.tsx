import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {ChannelTheme} from '@channel/theme';
import {replacements, scene, visibility} from './scene';
import {lettering} from '../../shared/intro/typography';

type Props = {readonly timeMs: number; readonly theme: ChannelTheme};

export const Claim: React.FC<Props> = ({timeMs, theme}) => {
  const opacity = visibility(timeMs, scene.titleStartMs, scene.titleExitMs);
  const just = smoothProgress(timeMs, 2800, 3100);
  const use = smoothProgress(timeMs, 3450, 3750);
  const postgres = smoothProgress(timeMs, 3740, 4140);
  const active = replacements.find((item) => timeMs >= item.startMs && timeMs < item.endMs);
  const titleOpacity = 1 - smoothProgress(timeMs, replacements[0].startMs - 320,
    replacements[0].startMs) + smoothProgress(timeMs, replacements[3].endMs,
    replacements[3].endMs + 300);
  const final = smoothProgress(timeMs, 15100, 15400);
  return <div style={{position: 'absolute', left: 98, top: 160, width: 1360,
    height: 790,
    opacity, fontFamily: theme.fontSans}}>
    <svg width="1360" height="790" viewBox="0 0 1360 790" fill={lettering.fill}
      stroke={lettering.outline} strokeWidth={14} strokeLinejoin="round" paintOrder="stroke fill"
      role="img" aria-label={active ? `вместо ${active.label}` : 'Just Use Postgres'}>
      <g opacity={titleOpacity}>
        <text x={62} y={210} fontSize={164} fontWeight={600} letterSpacing={-4}>
          <tspan opacity={just}>Just</tspan><tspan dx={28} opacity={use}>Use</tspan>
        </text>
        <text x={56} y={450} fontSize={248} fontWeight={700} letterSpacing={-7}
          opacity={postgres} transform={`translate(0 ${(1 - postgres) * 18})`}>Postgres</text>
        <text x={62} y={650} fontSize={104} fontWeight={600} strokeWidth={10} opacity={final}>для всего.</text>
      </g>
      {active ? <g opacity={smoothProgress(timeMs, active.startMs, active.startMs + 180)
        * (1 - smoothProgress(timeMs, active.endMs - 80, active.endMs))}>
        <text x={62} y={210} strokeWidth={8} fontSize={76} fontWeight={600}>вместо</text>
        <text x={56} y={450} fontWeight={700} fontSize={active.fontSize}
          letterSpacing={-3}>{active.label}</text>
      </g> : null}
    </svg>
  </div>;
};
