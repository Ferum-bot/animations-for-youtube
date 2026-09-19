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
        <rect x={layout.highlightX} y={y - 37} width={layout.highlightWidth} height={layout.lineHeight}
          fill={theme.accent} opacity={focus * 0.12} />
        <rect x={layout.highlightX} y={y - 37} width={4} height={layout.lineHeight}
          fill={theme.accent} opacity={focus} />
        <text x={152} y={y} textAnchor="end" fontSize={23} fill={theme.comment}>{String(line).padStart(2, '0')}</text>
        <text x={layout.x} y={y} xmlSpace="preserve" fill={theme.text}>
          {tokens.map((token, tokenIndex) => <tspan key={tokenIndex} fill={tokenColor(token, theme)}>{token.text}</tspan>)}
        </text>
      </g>;
    })}
  </g>;
};
