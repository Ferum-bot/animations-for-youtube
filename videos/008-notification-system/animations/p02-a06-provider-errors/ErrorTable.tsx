import React from 'react';
import {codeTheme as theme} from '../../shared/code-theme';
import {errorColumns, type ErrorFocus} from './examples';

const layout = {
  x: 340, y: 380, width: 1880, height: 820, columnWidth: 940,
  padding: 64, headerBaseline: 60, headerBottom: 100,
  rowBaseline: 132, rowHeight: 126, codeOffset: 48, codeLineHeight: 42,
  codeFontSize: 34, focusScale: 1.18, footerTop: 644,
} as const;

/** A comparison table in the same light editor palette, without a caption above it. */
export function ErrorTable({focus}: {readonly focus: (field: ErrorFocus) => number}) {
  const l = layout;
  return <g transform={`translate(${l.x} ${l.y})`} fontFamily={theme.fontMono}>
    <rect width={l.width} height={l.height} fill={theme.surface} />
    <path d={`M 0 ${l.headerBottom} H ${l.width} M 0 ${l.footerTop} H ${l.width} M ${l.columnWidth} 0 V ${l.height}`}
      stroke={theme.divider} strokeWidth={2} />
    {errorColumns.map((column, index) => {
      const strength = focus(column.id);
      const backoff = column.id === 'retryable' ? focus('backoff') : 0;
      const codeSize = l.codeFontSize * (1 + (l.focusScale - 1) * strength);
      return <g key={column.id} transform={`translate(${index * l.columnWidth} 0)`}>
        <rect x={2} y={l.headerBottom + 2} width={l.columnWidth - 4}
          height={l.footerTop - l.headerBottom - 4} fill={theme.selection} opacity={strength} />
        <text x={l.padding} y={l.headerBaseline} fontSize={38} fill={theme.keyword}>{column.title}</text>
        {column.rows.map((row, rowIndex) => {
          const baseline = l.rowBaseline + rowIndex * l.rowHeight;
          return <g key={row.provider}>
            <text x={l.padding} y={baseline} fontSize={25} fill={theme.lineNumber}>{row.provider}</text>
            {row.codes.map((code, line) => <text key={code} x={l.padding}
              y={baseline + l.codeOffset + line * l.codeLineHeight}
              fontSize={codeSize} fill={theme.text}>{code}</text>)}
          </g>;
        })}
        <rect x={2} y={l.footerTop + 2} width={l.columnWidth - 4} height={l.height - l.footerTop - 4}
          fill={theme.selection} opacity={backoff} />
        <text x={l.padding} y={692} fontSize={32} fill={theme.text}>{column.action}</text>
        <text x={l.padding} y={736} fontSize={column.id === 'retryable' ? 34 * (1 + (l.focusScale - 1) * backoff) : 28}
          fill={theme.keyword}>{column.detail}</text>
        <text x={l.padding} y={784} fontSize={25} fill={theme.comment}>{column.note}</text>
      </g>;
    })}
    <rect width={l.width} height={l.height} fill="none" stroke={theme.line} strokeWidth={4} />
  </g>;
}
