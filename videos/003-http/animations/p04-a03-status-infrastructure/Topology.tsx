import React from 'react';
import {Label, TimedCopy} from '../../shared/HttpDiagram';
import {cue, flightOpacity, shotOpacity} from '../../shared/status/timing';
import {statusTheme as theme} from '../../shared/status/theme';
import {reveal} from '../../shared/timing';

type Point = {readonly x: number; readonly y: number};

/** Parallel projection keeps every face aligned during depth expansion. */
const ProtocolModule: React.FC<Point & {
  readonly title: string;
  readonly depth: number;
  readonly kind: 'client' | 'proxy' | 'server';
  readonly opacity?: number;
}> = ({x, y, title, depth, kind, opacity = 1}) => {
  const dx = depth * 60;
  const dy = depth * -40;
  const width = 180;
  const height = 112;
  return <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d={`M ${width} 0 L ${width + dx} ${dy} V ${height + dy} L ${width} ${height} Z`} fill={theme.background} stroke={theme.line} strokeWidth={2} />
    <path d={`M 0 0 L ${dx} ${dy} H ${width + dx} L ${width} 0 Z`} fill={theme.line} stroke={theme.muted} strokeWidth={2} />
    <path d={`M 0 0 H ${width} V ${height} H 0 Z`} fill={theme.surface} stroke={theme.muted} strokeWidth={2} />
    <path d={`M 0 0 H ${width}`} stroke={theme.primary} strokeWidth={3} />
    {kind === 'client' ? <path d="M 30 31 H 150 V 78 H 30 Z M 74 78 V 92 H 110" stroke={theme.text} strokeWidth={2} fill="none" />
      : kind === 'proxy' ? <path d="M 28 35 H 145 M 130 23 L 145 35 L 130 47 M 150 78 H 35 M 50 66 L 35 78 L 50 90" stroke={theme.primary} strokeWidth={3} fill="none" />
        : <path d="M 30 25 H 150 V 49 H 30 Z M 30 65 H 150 V 89 H 30 Z M 46 37 H 55 M 46 77 H 55" stroke={theme.text} strokeWidth={2} fill="none" />}
    <text x={0} y={height + 64} fontSize={32} fill={theme.text}>{title}</text>
  </g>;
};

const RoutedStatus: React.FC<{
  readonly timeMs: number;
  readonly startMs: number;
  readonly reverse?: boolean;
  readonly label: string;
}> = ({timeMs, startMs, reverse = false, label}) => {
  const progress = reveal(timeMs, startMs, 1600);
  const amount = reverse ? 1 - progress : progress;
  const x = 300 + amount * 720;
  const y = 670 - amount * 145;
  return <g transform={`translate(${x} ${y})`} opacity={flightOpacity(timeMs, startMs, 1850)}>
    <path d="M -62 -30 H 62 V 30 H -62 Z" fill={theme.surface} stroke={label === '500' ? theme.danger : theme.primary} strokeWidth={2} />
    <text y={11} textAnchor="middle" fontFamily={theme.fontMono} fontSize={32} fill={theme.text}>{label}</text>
  </g>;
};

const intermediary = cue('infrastructure', 'p04-intermediaries');
const monitor = cue('infrastructure', 'p04-standard-code');

export const Topology: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const depth = reveal(timeMs, intermediary - 1200, 1100);
  return <g opacity={shotOpacity(timeMs, 0, monitor)}>
    <Label x={212} y={480}>ОТВЕТ ЧИТАЕТ НЕ ТОЛЬКО КЛИЕНТ</Label>
    <path d="M 300 670 L 1020 525 M 1000 521 L 1020 525 L 1003 538 M 317 657 L 300 670 L 320 674" fill="none" stroke={theme.line} strokeWidth={3} />
    <ProtocolModule x={212} y={750} title="Браузер" depth={depth} kind="client" />
    <ProtocolModule x={930} y={600} title="Бэкенд" depth={depth} kind="server" />
    <ProtocolModule x={555} y={680} title="HTTP-посредник" depth={depth} kind="proxy" opacity={reveal(timeMs, intermediary, 500)} />
    <g opacity={reveal(timeMs, intermediary + 300, 400)}>
      <path d="M 645 602 V 645" stroke={theme.primary} strokeWidth={2} />
      <text x={570} y={960} fontFamily={theme.fontMono} fontSize={29} fill={theme.primary} opacity={reveal(timeMs, intermediary + 1700, 250)}>status: 500</text>
      <path d="M 645 869 V 909" stroke={theme.line} strokeWidth={2} />
    </g>
    <RoutedStatus timeMs={timeMs} startMs={1800} label="GET" />
    <RoutedStatus timeMs={timeMs} startMs={4800} label="200" reverse />
    <RoutedStatus timeMs={timeMs} startMs={intermediary - 1000} label="GET" />
    <RoutedStatus timeMs={timeMs} startMs={intermediary + 900} label="500" reverse />
    <TimedCopy
      timeMs={timeMs}
      states={[
        {startMs: 500, text: 'Браузер ↔ бэкенд'},
        {startMs: intermediary, text: 'Статус доступен HTTP-посредникам'},
        {startMs: cue('infrastructure', 'p04-load-balancer'), text: 'Балансировщик'},
        {startMs: cue('infrastructure', 'p04-proxy'), text: 'Reverse proxy / Nginx'},
        {startMs: cue('infrastructure', 'p04-cdn'), text: 'CDN / Cloudflare'},
      ]}
      x={212}
      y={1130}
      fontSize={39} />
    <text x={212} y={1220} fontSize={29} fill={theme.muted} opacity={reveal(timeMs, intermediary, 400)}>Общая семантика для обработки ответа</text>
  </g>;
};
