import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {OzonTheme} from '../../shared/theme';
import {cues, cueTime, type LineRange} from './cues';
import {sqlLines, type SqlToken} from './sql';

const layout = {x: 208, y: 292, lineHeight: 51, fontSize: 36, highlightX: 184, highlightWidth: 1556};
const contains = (ranges: readonly LineRange[], line: number): boolean =>
  ranges.some(([first, last]) => line >= first && line <= last);

const tokenColor = (token: SqlToken, theme: OzonTheme): string => {
  if (token.kind === 'plain') return theme.text;
  if (token.kind === 'comment') return theme.comment;
  return theme.syntax[token.kind];
};

export const SqlListing: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = ({timeMs, theme}) => {
  const activeIndex = cues.reduce((active, cue, index) => timeMs >= cueTime(cue) ? index : active, 0);
  const active = cues[activeIndex] ?? cues[0];
  const previous = cues[Math.max(0, activeIndex - 1)] ?? active;
  const transition = smoothProgress(timeMs, cueTime(active), cueTime(active) + 280);
  return <g fontFamily={theme.fontMono} fontSize={layout.fontSize}>
    {sqlLines.map((tokens, index) => {
      const line = index + 1;
      const y = layout.y + index * layout.lineHeight;
      const before = contains(previous.ranges, line) ? 1 : 0;
      const after = contains(active.ranges, line) ? 1 : 0;
      const focus = before + (after - before) * transition;
      return <g key={line}>
        <path d={`M ${layout.highlightX} ${y - 35} Q 920 ${y - 38} ${layout.highlightX + layout.highlightWidth} ${y - 35}
          L ${layout.highlightX + layout.highlightWidth - 3} ${y + 14} Q 850 ${y + 12} ${layout.highlightX + 2} ${y + 14} Z`}
          fill={theme.marker} opacity={focus * 0.19} />
        <path d={`M 177 ${y - 36} Q 174 ${y - 10} 177 ${y + 15}`} strokeWidth={2}
          stroke={theme.secondary} opacity={focus} fill="none" strokeLinecap="round" />
        <text x={152} y={y} textAnchor="end" fontSize={21} fill={theme.comment} opacity={0.7}>{String(line).padStart(2, '0')}</text>
        <text x={layout.x} y={y} xmlSpace="preserve" fill={theme.text}>
          {tokens.map((token, tokenIndex) => <tspan key={tokenIndex} fill={tokenColor(token, theme)}
            fontStyle={token.kind === 'function' || token.kind === 'parameter' ? 'italic' : undefined}>{token.text}</tspan>)}
        </text>
      </g>;
    })}
  </g>;
};
