import React from 'react';
import {easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';

type Point = {readonly x: number; readonly y: number};
export type Route = {readonly from: Point; readonly via: Point; readonly to: Point};
const pose = (x: number, y: number, scale = 1) => `translate(${x} ${y}) scale(${scale})`;

export const RouteLine: React.FC<{readonly route: Route}> = ({route: {from, via, to}}) =>
  <path d={`M${from.x} ${from.y} Q${via.x} ${via.y} ${to.x} ${to.y}`}
    fill="none" stroke={ink.muted} strokeWidth={4} strokeLinecap="round" />;

/** Each slip travels once along the actual connection, then the destination changes. */
export const Delivery: React.FC<{
  readonly route: Route; readonly timeMs: number; readonly start: number;
  readonly duration?: number; readonly kind?: 'wal' | 'ack' | 'read';
}> = ({route: {from, via, to}, timeMs, start, duration = 1050, kind = 'wal'}) => {
  if (timeMs < start || timeMs >= start + duration) return null;
  const t = progress(timeMs, start, start + duration, easing.transform);
  const axis = (a: number, b: number, c: number) => mix(mix(a, b, t), mix(b, c, t), t);
  return <g transform={pose(axis(from.x, via.x, to.x), axis(from.y, via.y, to.y))}>
    {kind === 'read' ? <path d="M-13 -27 L17 -27 L16 25 L2 15 L-13 25 Z" fill={ink.primary} /> :
      <g>
        <path d="M-38 -29 L40 -31 L38 27 L-39 29 Z" fill={kind === 'ack' ? ink.primary : ink.text} />
        <path d={kind === 'ack' ? 'M-15 0 L-3 12 L19 -12' : 'M-23 -9 L22 -9 M-23 8 L10 8'}
          fill="none" stroke={kind === 'ack' ? ink.text : ink.background} strokeWidth={5} strokeLinecap="round" />
      </g>}
  </g>;
};
