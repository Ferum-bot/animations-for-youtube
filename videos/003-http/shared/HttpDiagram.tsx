import React from 'react';
import {MessageBrackets} from './MessageBrackets';
import {httpTheme as theme} from './theme';
import {reveal} from './timing';
export const DiagramFrame: React.FC<{
  timeMs: number;
}> = ({timeMs}) => <MessageBrackets x={136} y={400} width={1120} height={900} markerY={34} arm={80} opacity={reveal(timeMs, 200, 400)} />;
export const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  opacity?: number;
}> = ({x, y, children, opacity = 1}) => <text x={x} y={y} opacity={opacity} fontFamily={theme.fontMono} fontSize={26} letterSpacing={1} fill={theme.muted}>{children}</text>;
export const Route: React.FC<{
  from?: number;
  to?: number;
  y: number;
}> = ({from = 350, to = 1020, y}) => {
  const direction = to > from ? 1 : -1;
  return <path
    d={`M ${from} ${y} H ${to} M ${to - direction * 12} ${y - 9} L ${to} ${y} L ${to - direction * 12} ${y + 9}`}
    fill="none"
    stroke={theme.line}
    strokeWidth={2} />;
};
export const Message: React.FC<{
  from?: number;
  to?: number;
  y: number;
  progress: number;
  label: string;
  opacity?: number;
  width?: number;
}> = ({from = 350, to = 1020, y, progress, label, opacity = 1, width = 170}) => <g transform={`translate(${from + (to - from) * progress} ${y})`} opacity={opacity}>
  <rect x={-width / 2} y={-30} width={width} height={60} fill={theme.surface} />
  <path d={`M ${-width / 2} 30 H ${width / 2}`} stroke={theme.primary} strokeWidth={3} />
  <text y={10} textAnchor="middle" fontFamily={theme.fontMono} fontSize={30} fill={theme.text}>{label}</text>
</g>;
type CopyState = {
  readonly startMs: number;
  readonly text: string;
};
/** Consecutive labels never coexist in the same text zone. */
export const TimedCopy: React.FC<{
  timeMs: number;
  states: readonly CopyState[];
  x: number;
  y: number;
  fontSize?: number;
}> = ({timeMs, states, x, y, fontSize = 34}) => {
  const index = states.reduce((active, state, i) => timeMs >= state.startMs ? i : active, -1);
  const state = states[index];
  if(!state)
    return null;
  const next = states[index + 1];
  const opacity = reveal(timeMs, state.startMs, 220) * (next ? 1 - reveal(timeMs, next.startMs - 250, 220) : 1);
  return <text x={x} y={y} fontSize={fontSize} fill={theme.text} opacity={opacity}>{state.text}</text>;
};
