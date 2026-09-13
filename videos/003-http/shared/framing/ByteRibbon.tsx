import React from 'react';
import {httpDetailTheme as theme} from '../HttpElements';

export const sampleBody = 'Hello world';
export const sampleBodyBytes = 11;

/** Each cell represents one ASCII octet, including the visible space marker. */
export const ByteRibbon: React.FC<{
  readonly value?: string; readonly x?: number; readonly y: number; readonly cellWidth?: number;
  readonly depth?: number; readonly received?: number; readonly visibleCount?: number;
}> = ({value = sampleBody, x = 212, y, cellWidth = 80, depth = 0, received = 0, visibleCount = value.length}) => <g transform={`translate(${x} ${y})`}>
  {Array.from(value).map((letter, index) => {
    const width = cellWidth - 5;
    const dx = depth * 24;
    const dy = depth * -19;
    const active = index < received;
    return <g key={index} transform={`translate(${index * cellWidth} ${-depth * index * 2.4})`} opacity={index < visibleCount ? 1 : 0}>
      <path d={`M 0 0 L ${dx} ${dy} H ${width + dx} L ${width} 0 Z`} fill={theme.line} stroke={theme.muted} strokeWidth={1} />
      <path d={`M ${width} 0 L ${width + dx} ${dy} V ${86 + dy} L ${width} 86 Z`} fill={theme.background} stroke={theme.line} strokeWidth={1} />
      <path d={`M 0 0 H ${width} V 86 H 0 Z`} fill={theme.surface} stroke={active ? theme.primary : theme.line} strokeWidth={active ? 2 : 1} />
      <text x={width / 2} y={57} textAnchor="middle" fontFamily={theme.fontMono} fontSize={cellWidth * 0.54} fill={active ? theme.primary : theme.text}>{letter === ' ' ? '·' : letter}</text>
      <text x={width / 2} y={124} textAnchor="middle" fontFamily={theme.fontMono} fontSize={20} fill={theme.muted}>{String(index + 1).padStart(2, '0')}</text>
    </g>;
  })}
</g>;

export const BoundaryBracket: React.FC<{
  readonly x: number; readonly y: number; readonly height?: number;
  readonly side?: 'left' | 'right'; readonly uncertain?: boolean; readonly opacity?: number;
}> = ({x, y, height = 120, side = 'right', uncertain = false, opacity = 1}) => <path
  d={`M ${x + (side === 'left' ? 20 : -20)} ${y} H ${x} V ${y + height} H ${x + (side === 'left' ? 20 : -20)}`}
  fill="none" stroke={uncertain ? theme.muted : theme.primary} strokeWidth={3}
  strokeDasharray={uncertain ? '7 7' : undefined} opacity={opacity} />;
