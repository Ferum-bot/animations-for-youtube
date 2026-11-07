import React from 'react';
import {v2Theme} from './theme';

type Placement = {readonly x: number; readonly y: number; readonly scale?: number};

/** Fixed, authored contours: no random jitter, textures or drawing-hand effect. */
export const MessageIcon: React.FC<Placement & {readonly accent?: boolean; readonly children?: React.ReactNode}> = ({x, y, scale = 1, accent = false, children}) =>
  <g transform={`translate(${x} ${y}) scale(${scale})`} fill={v2Theme.surface}
    stroke={accent ? v2Theme.primary : v2Theme.text} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
    <path d="M35 9 C15 10 4 24 5 45 L3 141 C3 160 14 173 34 174 L62 174
      L56 209 L108 175 L286 172 C308 172 320 159 319 139 L321 39
      C321 17 309 5 286 6 Z" />
    {children ? <g stroke="none" fill={v2Theme.text}>{children}</g> :
      <path d="M61 63 Q154 60 259 63 M61 108 Q133 110 208 107" fill="none" />}
  </g>;

export const Magnifier: React.FC<Placement> = ({x, y, scale = 1}) =>
  <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={v2Theme.primary}
    strokeWidth={8} fill="none" strokeLinecap="round">
    <path d="M82 12 C39 -4 5 24 9 64 C12 105 64 115 93 89 C119 62 112 25 82 12 Z M93 91 L145 148" />
  </g>;

/** The pocket front is drawn after its contents, so letters really sit inside it. */
export const Pocket: React.FC<Placement & {readonly label: string; readonly children?: React.ReactNode}> =
  ({x, y, scale = 1, label, children}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M12 83 L468 77 L457 427 L4 435 Z" fill={v2Theme.surface} stroke={v2Theme.text} strokeWidth={5} />
    {children}
    <path d="M4 222 L180 218 L200 244 L279 243 L301 216 L465 220 L458 432 L7 438 Z"
      fill={v2Theme.background} stroke={v2Theme.text} strokeWidth={5} strokeLinejoin="round" />
    <text x={235} y={354} textAnchor="middle" fontSize={52} fontWeight={600}>{label}</text>
  </g>;

export const Slip: React.FC<{
  readonly x: number; readonly y: number; readonly width?: number;
  readonly word: string; readonly messageId?: string;
}> = ({x, y, width = 700, word, messageId = '#42'}) =>
  <g transform={`translate(${x} ${y})`}>
    <path d={`M1 6 L${width - 3} 0 L${width} 112 L4 117 Z`} fill={v2Theme.surface}
      stroke={v2Theme.text} strokeWidth={3} strokeLinejoin="round" />
    <text x={28} y={76} fontSize={50} fill={v2Theme.text} fontWeight={600}>{word}</text>
    {messageId ? <text x={width - 175} y={76} fontSize={42}>→ {messageId}</text> : null}
  </g>;

export const Sheet: React.FC<{
  readonly x: number; readonly y: number; readonly width: number; readonly height: number;
  readonly children?: React.ReactNode;
}> = ({x, y, width, height, children}) => <g transform={`translate(${x} ${y})`}>
  <path d={`M6 10 L${width - 12} 0 L${width} ${height - 7} L0 ${height} Z`}
    fill={v2Theme.surface} stroke={v2Theme.text} strokeWidth={4} strokeLinejoin="round" />
  {children}
</g>;
