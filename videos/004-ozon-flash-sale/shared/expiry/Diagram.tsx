import React from 'react';
import type {OzonTheme} from '../theme';

export const DiagramNode: React.FC<{
  readonly x: number; readonly y: number; readonly width: number;
  readonly title: string; readonly subtitle: string; readonly theme: OzonTheme;
  readonly accent?: string; readonly opacity?: number;
}> = ({x, y, width, title, subtitle, theme, accent = theme.line, opacity = 1}) =>
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <rect width={width} height={112} fill={theme.background} stroke={accent} strokeWidth={2} />
    <text x={24} y={45} fontSize={32} fontFamily={theme.fontMono} fill={theme.text}>{title}</text>
    <text x={24} y={85} fontSize={25} fill={theme.comment}>{subtitle}</text>
  </g>;

export const DiagramArrow: React.FC<{
  readonly x1: number; readonly x2: number; readonly y: number;
  readonly progress: number; readonly theme: OzonTheme;
}> = ({x1, x2, y, progress, theme}) => <path
  d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y - 3} ${x2} ${y} M ${x2 - 13} ${y - 9} L ${x2} ${y} L ${x2 - 13} ${y + 9}`}
  stroke={theme.secondary} strokeWidth={2.5} fill="none" strokeLinecap="round"
  opacity={progress} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />;
