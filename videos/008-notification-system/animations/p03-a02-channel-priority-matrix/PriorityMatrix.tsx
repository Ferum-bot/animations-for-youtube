import React from 'react';
import {codeTheme as theme} from '../../shared/code-theme';
import {channels, priorities} from './matrix';
import {getCellEmphasis, type FocusStrength} from './focus';

const layout = {
  x: 340, y: 380, width: 1880, height: 780,
  rowHeader: 200, columnWidth: 560, headerHeight: 120, rowHeight: 170,
  padding: 48, focusScale: 1.18,
} as const;
const grow = (size: number, strength: number) => size * (1 + (layout.focusScale - 1) * strength);

export function PriorityMatrix({focus}: {readonly focus: FocusStrength}) {
  const l = layout;
  const bodyBottom = l.headerHeight + channels.length * l.rowHeight;
  return <g transform={`translate(${l.x} ${l.y})`} fontFamily={theme.fontMono}>
    <rect width={l.width} height={l.height} fill={theme.surface} />
    <rect width={l.rowHeader} height={bodyBottom} fill={theme.gutter} />
    <text x={36} y={69} fontSize={30} fill={theme.text}>Канал</text>
    {priorities.map((priority, column) => <g key={priority.id}
      transform={`translate(${l.rowHeader + column * l.columnWidth + l.padding} 0)`}>
      <text y={53} fontSize={38} fill={theme.keyword}>{priority.title}</text>
      <text y={94} fontSize={26} fill={theme.lineNumber}>{priority.description}</text>
    </g>)}
    {channels.map((channel, row) => {
      const y = l.headerHeight + row * l.rowHeight;
      const status = channel.id === 'push'
        ? {text: 'работает', strength: focus('pushRow'), color: theme.success}
        : channel.id === 'email'
          ? {text: 'задержка', strength: focus('emailSlow'), color: theme.signal}
          : {text: 'OTP отдельно', strength: focus('smsOtp'), color: theme.keyword};
      return <g key={channel.id} transform={`translate(0 ${y})`}>
        <text x={36} y={62} fontSize={34} fill={theme.text}>{channel.id}</text>
        <text x={24} y={113} fontSize={21} fill={status.color} opacity={status.strength}>{status.text}</text>
        {channel.cells.map((cell, column) => {
          const priority = priorities[column];
          if (!priority) throw new Error('Every matrix cell must have a priority column');
          const state = getCellEmphasis(channel.id, priority.id, focus);
          const caption = channel.id === 'sms' && priority.id === 'p0'
            ? {text: 'OTP', strength: focus('smsOtp')}
            : channel.id === 'sms' && priority.id === 'bulk'
              ? {text: 'кампания', strength: focus('smsBulk')}
              : {text: '', strength: 0};
          return <g key={cell.topic} transform={`translate(${l.rowHeader + column * l.columnWidth} 0)`}>
            <rect x={1} y={1} width={l.columnWidth - 2} height={l.rowHeight - 2}
              fill={theme.selection} opacity={state.selected} />
            <rect x={1} y={1} width={l.columnWidth - 2} height={l.rowHeight - 2}
              fill={theme.signal} opacity={0.13 * state.delayed} />
            <text x={l.padding} y={54} fontSize={grow(34, state.topic)} fill={theme.keyword}>{cell.topic}</text>
            <text x={l.padding} y={104} fontSize={grow(28, state.pool)} fill={theme.text}>{cell.pool}</text>
            <text x={l.padding} y={145} fontSize={24} fill={theme.lineNumber} opacity={caption.strength}>{caption.text}</text>
          </g>;
        })}
      </g>;
    })}
    <g stroke={theme.divider} strokeWidth={2}>
      {priorities.map((priority, column) => <path key={priority.id}
        d={`M ${l.rowHeader + column * l.columnWidth} 0 V ${bodyBottom}`} />)}
      {Array.from({length: channels.length + 1}, (_, row) => <path key={row}
        d={`M 0 ${l.headerHeight + row * l.rowHeight} H ${l.width}`} />)}
    </g>
    <rect x={2} y={bodyBottom + 2} width={l.width - 4} height={l.height - bodyBottom - 4}
      fill={theme.selection} opacity={focus('total')} />
    <text x={60} y={682} fontSize={grow(34, focus('total'))} fill={theme.keyword}>
      3 канала × 3 приоритета = 9 топиков
    </text>
    <text x={60} y={727} fontSize={28} fill={theme.text}>У каждой ячейки — свой пул воркеров</text>
    <text x={60} y={761} fontSize={23} fill={theme.comment}>Размеры пулов и sender — пример конфигурации</text>
    <rect width={l.width} height={l.height} fill="none" stroke={theme.line} strokeWidth={4} />
  </g>;
}
