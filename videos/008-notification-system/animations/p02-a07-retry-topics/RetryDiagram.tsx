import React from 'react';
import {interpolateColors} from 'remotion';
import {codeTheme as theme} from '../../shared/code-theme';
import {topics, type RetryFocus} from './topics';

const layout = {
  x: 340, y: 380, width: 1880, height: 680,
  padding: 90, nodeY: 120, nodeWidth: 300, nodeHeight: 150, gap: 50,
  focusScale: 1.18,
} as const;

/** Failure-only route. Delays belong to retry consumers, not to Kafka itself. */
export function RetryDiagram({focus}: {readonly focus: (field: RetryFocus) => number}) {
  const l = layout;
  const manual = focus('manual');
  const emphasis = (strength: number) => 1 + (l.focusScale - 1) * strength;
  return <g transform={`translate(${l.x} ${l.y})`} fontFamily={theme.fontMono}>
    <rect width={l.width} height={l.height} fill={theme.surface} />
    <text x={l.padding} y={64} fontSize={32} fill={theme.text}>
      Неуспешная попытка → следующая ступень
    </text>
    {topics.map((topic, index) => {
      const x = l.padding + index * (l.nodeWidth + l.gap);
      const strength = topic.focus === null ? 0 : focus(topic.focus);
      const size = 34 * emphasis(strength);
      return <g key={topic.name + topic.suffix} transform={`translate(${x} ${l.nodeY})`}>
        <rect width={l.nodeWidth} height={l.nodeHeight} stroke={theme.line} strokeWidth={2}
          fill={interpolateColors(strength, [0, 1], [theme.gutter, theme.selection])} />
        {topic.suffix ? <>
          <text x={l.nodeWidth / 2} y={59} textAnchor="middle" fontSize={30} fill={theme.text}>{topic.name}</text>
          <text x={l.nodeWidth / 2} y={108} textAnchor="middle" fontSize={size} fill={theme.keyword}>{topic.suffix}</text>
        </> : <text x={l.nodeWidth / 2} y={87} textAnchor="middle" fontSize={size}
          fill={topic.focus === 'dlq' ? theme.keyword : theme.text}>{topic.name}</text>}
        <text x={l.nodeWidth / 2} y={195} textAnchor="middle" fontSize={27} fill={theme.lineNumber}>{topic.delay}</text>
        {index < topics.length - 1 ? <g stroke={theme.line} strokeWidth={3} fill="none">
          <path d={`M ${l.nodeWidth + 6} 75 H ${l.nodeWidth + l.gap - 8}`} />
          <path d={`M ${l.nodeWidth + l.gap - 18} 67 L ${l.nodeWidth + l.gap - 8} 75 L ${l.nodeWidth + l.gap - 18} 83`} />
        </g> : null}
      </g>;
    })}
    <text x={l.padding} y={358} fontSize={27} fill={theme.comment}>
      Задержку выдерживают consumers retry-топиков
    </text>
    <path d={`M 0 390 H ${l.width} M 0 515 H ${l.width}`} stroke={theme.divider} strokeWidth={2} />
    <text x={l.padding} y={438} fontSize={30} fill={theme.keyword}>
      Подтверждена запись в retry → commit offset
    </text>
    <text x={l.padding} y={482} fontSize={28} fill={theme.text}>
      Основная партиция продолжает обработку
    </text>
    <rect x={2} y={517} width={l.width - 4} height={l.height - 519} fill={theme.selection} opacity={manual} />
    <text x={l.padding} y={590} fontSize={34 * emphasis(manual)} fill={theme.keyword}>
      DLQ: посмотреть → исправить → повторить
    </text>
    <text x={l.padding} y={639} fontSize={27} fill={theme.comment}>
      После исправления причины — контролируемый повтор
    </text>
    <rect width={l.width} height={l.height} stroke={theme.line} strokeWidth={4} fill="none" />
  </g>;
}
