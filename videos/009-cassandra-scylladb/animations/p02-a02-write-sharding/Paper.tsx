import React from 'react';
import {Sheet, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {NotebookCover} from '../../shared/architecture/NotebookCover';
import type {Entry} from './scene';

export const Book: React.FC<{
  readonly x: number; readonly y: number; readonly label: string;
  readonly scale?: number; readonly entries: readonly Entry[];
}> = ({x, y, label, scale = 1, entries}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <text x={12} y={-34} fontSize={49} fontWeight={600}>{label}</text>
  <NotebookCover />
  {entries.map(({chat, body}, index) => <g key={chat} transform={`translate(84 ${34 + index * 114})`}>
    <text y={23} fontSize={34} fill={ink.muted}>чат {chat}</text>
    <text y={76} fontSize={46} fontWeight={600}>{body}</text>
  </g>)}
</g>;

export const Ticket: React.FC<{readonly x: number; readonly y: number; readonly entry: Entry; readonly scale?: number}> =
  ({x, y, entry, scale = 1}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <Sheet x={0} y={0} width={510} height={95}>
      <text x={23} y={62} fontSize={36} fill={ink.muted}>{entry.chat}</text>
      <text x={94} y={63} fontSize={46} fontWeight={600}>{entry.body}</text>
    </Sheet>
  </g>;

export const Posting: React.FC<{
  readonly entry: Entry; readonly timeMs: number; readonly start: number; readonly end: number;
  readonly x: number; readonly y: number; readonly toX: number; readonly toY: number;
}> = ({entry, timeMs, start, end, x, y, toX, toY}) => {
  if (timeMs < start || timeMs >= end) return null;
  const p = progress(timeMs, start, end, easing.transform);
  return <Ticket x={mix(x, toX, p)} y={mix(y, toY, p)} scale={mix(1, 0.18, p)} entry={entry} />;
};
