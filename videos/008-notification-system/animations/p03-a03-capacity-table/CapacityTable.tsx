import React from 'react';
import {codeTheme as theme} from '../../shared/code-theme';
import {capacityColumns, capacityRows, type CapacityField} from './capacity';

const layout = {
  y: 380, headerHeight: 120, rowHeight: 110, footerHeight: 140,
  padding: 36, fontSize: 34, focusScale: 1.18,
} as const;
const width = capacityColumns.reduce((sum, column) => sum + column.width, 0);
const bodyBottom = layout.headerHeight + capacityRows.length * layout.rowHeight;
const height = bodyBottom + layout.footerHeight;
const columns = capacityColumns.map((column, index) => ({
  ...column, x: capacityColumns.slice(0, index).reduce((sum, item) => sum + item.width, 0),
}));

export function CapacityTable({focus}: {readonly focus: (field: CapacityField) => number}) {
  const l = layout;
  return <g transform={`translate(${(2560 - width) / 2} ${l.y})`} fontFamily={theme.fontMono}>
    <rect width={width} height={height} fill={theme.surface} />
    {columns.map((column) => {
      const strength = column.id === 'topic' ? 0 : focus(column.id);
      return <g key={column.id} transform={`translate(${column.x} 0)`}>
        <rect x={1} y={l.headerHeight + 1} width={column.width - 2}
          height={bodyBottom - l.headerHeight - 2} fill={theme.selection} opacity={strength} />
        {column.heading.map((line, index) => <text key={line} x={l.padding}
          y={51 + index * 40} fontSize={30} fill={theme.text}>{line}</text>)}
        {capacityRows.map((row, index) => <text key={row.topic} x={l.padding}
          y={l.headerHeight + index * l.rowHeight + 67}
          fontSize={l.fontSize * (1 + (l.focusScale - 1) * strength)}
          fill={column.id === 'topic' ? theme.keyword : theme.text}>{row[column.id]}</text>)}
      </g>;
    })}
    <g stroke={theme.divider} strokeWidth={2}>
      {columns.slice(1).map((column) => <path key={column.id} d={`M ${column.x} 0 V ${bodyBottom}`} />)}
      {Array.from({length: capacityRows.length + 1}, (_, row) => <path key={row}
        d={`M 0 ${l.headerHeight + row * l.rowHeight} H ${width}`} />)}
    </g>
    <text x={48} y={bodyBottom + 53} fontSize={32} fill={theme.keyword}>
      Оценка: in-flight ≈ поток × время вызова
    </text>
    <text x={48} y={bodyBottom + 105} fontSize={26} fill={theme.comment}>
      * push.p0: если весь пик приходится на P0
    </text>
    <rect width={width} height={height} fill="none" stroke={theme.line} strokeWidth={4} />
  </g>;
}
