import React from 'react';
import {getTheme} from '@channel/theme';
import {httpTheme} from './theme';
import {reveal} from './timing';

export const httpDetailTheme = {...httpTheme, caution: getTheme('signal').primary};
const theme = httpDetailTheme;
export type TimeProps = {readonly timeMs: number};

/** The same name/value geometry follows a field through the explanations. */
export const HeaderField: React.FC<{
  readonly name: string; readonly value: string; readonly x?: number; readonly y: number;
  readonly opacity?: number; readonly accent?: boolean; readonly fontSize?: number;
}> = ({name, value, x = 212, y, opacity = 1, accent = false, fontSize = 32}) => <g opacity={opacity}>
  <text x={x} y={y} fontFamily={theme.fontMono} fontSize={fontSize}>
    <tspan fill={accent ? theme.primary : theme.text}>{name}:</tspan>
    <tspan fill={theme.muted}> {value}</tspan>
  </text>
</g>;

export const Caption: React.FC<{
  readonly children: React.ReactNode; readonly detail?: string; readonly opacity?: number;
}> = ({children, detail, opacity = 1}) => <g opacity={opacity}>
  <path d="M 212 1142 H 280" stroke={theme.primary} strokeWidth={3} />
  <text x={212} y={1200} fontSize={39} fill={theme.text}>{children}</text>
  {detail ? <text x={212} y={1252} fontSize={27} fill={theme.muted}>{detail}</text> : null}
</g>;

/** Solid, aligned faces: restrained parallel projection, no blur or filters. */
export const DepthPlate: React.FC<{
  readonly x: number; readonly y: number; readonly width: number; readonly height: number;
  readonly depth: number; readonly selected?: boolean; readonly children?: React.ReactNode;
}> = ({x, y, width, height, depth, selected = false, children}) => {
  const dx = depth * 52;
  const dy = depth * -34;
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M 0 0 L ${dx} ${dy} H ${width + dx} L ${width} 0 Z`} fill={theme.line} stroke={theme.muted} strokeWidth={1.5} />
    <path d={`M ${width} 0 L ${width + dx} ${dy} V ${height + dy} L ${width} ${height} Z`} fill={theme.background} stroke={theme.line} strokeWidth={1.5} />
    <path d={`M 0 0 H ${width} V ${height} H 0 Z`} fill={theme.surface} stroke={selected ? theme.primary : theme.line} strokeWidth={2} />
    <path d={`M 0 0 H ${width}`} stroke={selected ? theme.primary : theme.muted} strokeWidth={3} />
    {children}
  </g>;
};

export const DrawPath: React.FC<{
  readonly d: string; readonly timeMs: number; readonly startMs: number;
  readonly durationMs?: number; readonly color?: string; readonly width?: number;
}> = ({d, timeMs, startMs, durationMs = 650, color = theme.primary, width = 3}) => <path
  d={d} fill="none" stroke={color} strokeWidth={width} pathLength={1}
  strokeDasharray={1} strokeDashoffset={1 - reveal(timeMs, startMs, durationMs)} />;
