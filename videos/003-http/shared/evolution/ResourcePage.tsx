import React from 'react';
import {httpDetailTheme as theme} from '../HttpElements';

/** A stable page silhouette ties connection models to the same visible result. */
export const ResourcePage: React.FC<{
  x: number; y: number; scale?: number; spread?: number; html?: number; image?: number; icon?: number; css?: number;
}> = ({x, y, scale = 1, spread = 0, html = 1, image = 1, icon = 1, css = 1}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <g opacity={html}>
    <path d="M 0 0 H 360 V 286 H 0 Z" fill={theme.surface} stroke={theme.line} strokeWidth={2} />
    <path d="M 0 42 H 360" stroke={theme.line} strokeWidth={2} />
    <text x={21} y={28} fontFamily={theme.fontMono} fontSize={18} fill={theme.muted}>example.com</text>
  </g>
  <g transform={`translate(${spread * 26} ${-spread * 32})`} opacity={css}>
    <path d="M 27 76 H 220 M 27 96 H 165 M 27 241 H 215 M 27 260 H 275" stroke={theme.text} strokeWidth={8} />
  </g>
  <g transform={`translate(${spread * 58} ${-spread * 78})`} opacity={image}>
    <path d="M 27 119 H 331 V 216 H 27 Z" fill={theme.background} stroke={theme.muted} strokeWidth={2} />
    <path d="M 28 215 L 116 148 L 178 194 L 230 157 L 329 215" fill={theme.line} />
    <circle cx={285} cy={145} r={10} fill={theme.primary} />
  </g>
  <g transform={`translate(${spread * 90} ${-spread * 120})`} opacity={icon}>
    <path d="M 292 66 H 330 V 104 H 292 Z" fill={theme.primary} />
    <path d="M 301 85 L 308 92 L 322 77" fill="none" stroke={theme.background} strokeWidth={3} />
  </g>
</g>;
