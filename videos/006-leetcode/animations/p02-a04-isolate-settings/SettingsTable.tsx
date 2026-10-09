import React from 'react';
import type {LeetcodeTheme} from '../../shared/theme';
import {settings} from './settings';

const layout = {x: 330, y: 414, width: 1900, height: 880, rowsY: 174, rowHeight: 98} as const;

const Cell: React.FC<{
  readonly lines: readonly string[];
  readonly x: number;
  readonly color: string;
  readonly fontFamily: string;
  readonly bold?: boolean;
}> = ({lines, x, color, fontFamily, bold = false}) =>
  <text x={x} y={lines.length === 1 ? 60 : 42} fill={color}
    fontFamily={fontFamily} fontSize={29} fontWeight={bold ? 600 : 400}>
    {lines.map((line, index) => <tspan key={line} x={x} dy={index === 0 ? 0 : 35}>{line}</tspan>)}
  </text>;

export const SettingsTable: React.FC<{
  readonly theme: LeetcodeTheme;
  readonly pauseOpacity: number;
}> = ({theme, pauseOpacity}) => {
  const l = layout;
  return <g transform={`translate(${l.x} ${l.y})`}>
    <rect y={12} width={l.width} height={l.height} rx={8} fill={theme.shadow} opacity={0.08} />
    <rect width={l.width} height={l.height} rx={8} fill={theme.surface} stroke={theme.line} strokeWidth={2} />
    <g fontFamily={theme.fontSans}>
      <text x={38} y={57} fontSize={39} fontWeight={600} fill={theme.text}>Стабильное время выполнения</text>
      <text x={38} y={98} fontSize={27} fill={theme.muted}>Настройки машины-воркера</text>
      <g opacity={pauseOpacity} fill={theme.primary}>
        <path d="M 1426 52 V 72 M 1437 52 V 72" stroke={theme.primary} strokeWidth={4} />
        <text x={1460} y={72} fontSize={27}>Пауза — чтобы прочитать</text>
      </g>
      <rect x={1} y={124} width={l.width - 2} height={50} fill={theme.chrome} />
      <g fontSize={25} fill={theme.muted}>
        <text x={38} y={158}>Что настраиваем</text>
        <text x={430} y={158}>Причина разброса времени</text>
        <text x={1000} y={158}>Настройка</text>
      </g>
    </g>
    {settings.map((row, index) => <g key={row.name[0]} transform={`translate(0 ${l.rowsY + index * l.rowHeight})`}>
      <path d={`M 32 ${l.rowHeight} H ${l.width - 32}`} stroke={theme.line} />
      <Cell lines={row.name} x={38} color={theme.text} fontFamily={theme.fontSans} bold />
      <Cell lines={row.effect} x={430} color={theme.text} fontFamily={theme.fontSans} />
      <Cell lines={row.setting} x={1000} color={theme.syntax.command} fontFamily={theme.fontMono} />
    </g>)}
    <text x={38} y={807} fontSize={26} fontFamily={theme.fontMono} fill={theme.muted}>
      THP: /sys/kernel/mm/transparent_hugepage/
    </text>
    <text x={38} y={852} fontSize={26} fontFamily={theme.fontSans} fill={theme.muted}>
      * Отключение ASLR снижает защиту; решение зависит от модели угроз воркера.
    </text>
  </g>;
};
