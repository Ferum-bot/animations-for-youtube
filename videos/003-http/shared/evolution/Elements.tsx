import React from 'react';
import {Label} from '../HttpDiagram';
import {DepthPlate, httpDetailTheme as theme} from '../HttpElements';
import {flightOpacity, reveal} from '../timing';

export const resources = [
  {id: 'html', name: 'index.html', short: 'HTML', stream: 1},
  {id: 'image', name: 'hero.jpg', short: 'IMG', stream: 3},
  {id: 'icon', name: 'icon.svg', short: 'SVG', stream: 5},
] as const;
export type ResourceId = typeof resources[number]['id'];

/** Flat front, two restrained facets; packet identity is readable without color. */
export const DataBlock: React.FC<{
  x: number; y: number; label: string; width?: number; height?: number;
  depth?: number; active?: boolean; opacity?: number; fontSize?: number;
}> = ({x, y, label, width = 156, height = 62, depth = 0.22, active = false, opacity = 1, fontSize = 28}) =>
  <g opacity={opacity}><DepthPlate x={x} y={y} width={width} height={height} depth={depth} selected={active}>
    <text x={width / 2} y={height / 2 + fontSize * 0.34} textAnchor="middle" fontFamily={theme.fontMono}
      fontSize={fontSize} fill={active ? theme.primary : theme.text}>{label}</text>
  </DepthPlate></g>;

export const Channel: React.FC<{
  y: number; from?: number; to?: number; open?: number; label?: string;
}> = ({y, from = 300, to = 1080, open = 1, label}) => <g>
  <path d={`M ${from} ${y - 36} V ${y + 36} M ${to} ${y - 36} V ${y + 36}`}
    stroke={theme.primary} strokeWidth={3} fill="none" />
  <path d={`M ${from} ${y - 22} H ${from + (to - from) * open} M ${from} ${y + 22} H ${from + (to - from) * open}`}
    opacity={open} stroke={theme.line} strokeWidth={2} fill="none" />
  {label ? <text x={(from + to) / 2} y={y - 55} textAnchor="middle" fontFamily={theme.fontMono} fontSize={25} fill={theme.muted}>{label}</text> : null}
</g>;

export const Flight: React.FC<{
  timeMs: number; startMs: number; durationMs?: number; from?: number; to?: number;
  y: number; label: string; width?: number;
}> = ({timeMs, startMs, durationMs = 1100, from = 302, to = 922, y, label, width = 156}) =>
  <DataBlock x={from + (to - from) * reveal(timeMs, startMs, durationMs)} y={y - 31} label={label} width={width}
    opacity={flightOpacity(timeMs, startMs, durationMs)} active />;

export const EndpointLabels: React.FC<{y?: number; left?: string; right?: string}> =
  ({y = 570, left = 'КЛИЕНТ', right = 'СЕРВЕР'}) => <>
    <Label x={260} y={y}>{left}</Label><text x={1140} y={y} textAnchor="end" fontFamily={theme.fontMono} fontSize={26} letterSpacing={1} fill={theme.muted}>{right}</text>
  </>;

export const Completion: React.FC<{x: number; y: number; progress: number; label: string; width?: number}> =
  ({x, y, progress, label, width = 235}) => <g transform={`translate(${x} ${y})`}>
    <text fontFamily={theme.fontMono} fontSize={27} fill={theme.text}>{label}</text>
    <path d={`M 0 27 H ${width}`} stroke={theme.line} strokeWidth={3} />
    <path d={`M 0 27 H ${width * progress}`} stroke={theme.primary} strokeWidth={5} />
    <text y={67} fontSize={25} fill={progress === 1 ? theme.primary : theme.muted}>{progress === 1 ? 'Готово' : 'Получение данных'}</text>
  </g>;
