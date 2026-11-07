import React from 'react';
import {MessageIcon, v2Theme as ink} from '@channel/motion-v2';
import {NotebookCover} from '../../shared/architecture/NotebookCover';
export {RouteLine, Delivery, type Route} from '../../shared/architecture/Routes';
import {placeText, type Place, type Row} from './scene';

type Point = {readonly x: number; readonly y: number};
const pose = (x: number, y: number, scale = 1) => `translate(${x} ${y}) scale(${scale})`;

/** The same bound notebook is a node's local copy throughout the explanation. */
export const Ledger: React.FC<Point & {
  readonly role: string; readonly value?: Row; readonly scale?: number;
  readonly wal?: boolean; readonly failed?: boolean;
}> = ({x, y, role, value, scale = 1, wal = false, failed = false}) =>
  <g transform={pose(x, y, scale)}>
    <text x={22} y={-38} fontSize={52} fontWeight={600}>{role}</text>
    <g opacity={failed ? 0.34 : 1} strokeLinejoin="round" strokeLinecap="round">
      <NotebookCover />
      <text x={79} y={59} fontSize={32} fill={ink.muted}>чат 42</text>
      {value && <text x={79} y={109} fontSize={39}
        fill={value === 'question' ? ink.text : ink.muted}>Когда встречаемся?</text>}
      {value && value !== 'question' ? <g fontSize={53} fontWeight={600}>
        <text x={79} y={171}>Завтра</text>
        <text x={79} y={227}>{placeText[value]}</text>
      </g> : <path d="M83 166 L303 164 M82 218 L252 216" fill="none" stroke={ink.line} strokeWidth={5} />}
      {wal ? <path d="M459 3 L503 2 L502 81 L481 66 L459 81 Z" fill={ink.primary} /> : null}
    </g>
    {failed ? <path d="M347 15 L306 89 L340 108 L285 178 L308 201 L265 263"
      stroke={ink.text} strokeWidth={8} fill="none" /> : null}
  </g>;

export const Bubble: React.FC<Point & {readonly value: Place; readonly scale?: number}> =
  ({x, y, value, scale = 1}) => <MessageIcon x={x} y={y} scale={scale}>
    <g fontSize={36} fontWeight={600}>
      <text x={36} y={74}>Завтра</text><text x={36} y={127}>{placeText[value]}</text>
    </g>
  </MessageIcon>;

export const Reader: React.FC<Point & {readonly name?: string; readonly scale?: number}> =
  ({x, y, name, scale = 1}) => <g transform={pose(x, y, scale)}>
    <g fill="none" stroke={ink.text} strokeLinecap="round" strokeLinejoin="round" strokeWidth={5}>
      <path d="M-35 -21 C-37 -49 -19 -64 4 -65 C34 -66 48 -43 42 -18 C38 5 25 18 7 19 C-13 21 -30 4 -35 -21 Z" fill={ink.surface} />
      <path d="M-68 68 C-63 38 -37 27 -17 24 M26 23 C54 27 72 40 78 67" />
    </g>
    {name ? <text textAnchor="middle" y={127} fontSize={39}>{name}</text> : null}
  </g>;

export const Note: React.FC<Point & {readonly children: React.ReactNode}> = ({x, y, children}) =>
  <text x={x} y={y} textAnchor="middle" fontSize={42}>{children}</text>;
