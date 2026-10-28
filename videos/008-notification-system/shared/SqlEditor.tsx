import React from 'react';
import {sqlTheme as theme} from './sql-theme';

export type SqlLine<Field extends string = string> = {
  readonly text: string;
  readonly field: Field | null;
};

const keywords = new Set(['CREATE', 'TABLE', 'INDEX', 'PRIMARY', 'KEY', 'NOT', 'NULL',
  'DEFAULT', 'REFERENCES', 'ON', 'WHERE', 'DESC', 'UUID', 'TEXT', 'JSONB', 'TIMESTAMPTZ',
  'BOOLEAN', 'TRUE', 'FALSE', 'SELECT', 'FROM', 'AND', 'LIMIT']);

const tokenColor = (token: string) => {
  if (token.startsWith('--')) return theme.comment;
  if (token.startsWith("'")) return theme.string;
  if (keywords.has(token.toUpperCase())) return theme.keyword;
  if (token === 'now') return theme.function;
  return theme.text;
};

export const editorLayout = {
  // Wide SQL stays below the webcam; short SQL is centered in the frame.
  widths: {snippet: 1040, compact: 1280, standard: 1480, wide: 1880}, wideY: 380, gutter: 76, borderWidth: 4,
  codeX: 106, firstBaseline: 56, lineHeight: 40, fontSize: 34, bottomPadding: 24,
  focusScale: 1.18, focusRowSpace: 8, focusReserve: 40,
} as const;

/** Only code and the editor gutter: no title, table cards, legend or footer. */
export function SqlEditor<Field extends string>({layout, lines, fieldStrength}: {
  readonly layout: keyof typeof editorLayout.widths;
  readonly lines: readonly SqlLine<Field>[];
  readonly fieldStrength: (field: Field) => number;
}) {
  const l = editorLayout;
  // Reserve the maximum expansion (five users rows) so the panel stays still.
  const height = l.firstBaseline + (lines.length - 1) * l.lineHeight + l.bottomPadding + l.focusReserve;
  const width = l.widths[layout];
  const x = (2560 - width) / 2;
  const y = layout === 'wide' ? l.wideY : (1440 - height) / 2;
  let rowOffset = 0;
  const rows = lines.map((line) => {
    const strength = line.field === null ? 0 : fieldStrength(line.field);
    const extraSpace = l.focusRowSpace * strength;
    const top = l.firstBaseline - 33 + rowOffset;
    rowOffset += l.lineHeight + extraSpace;
    return {line, strength, top, height: l.lineHeight + extraSpace,
      baseline: top + 33 + extraSpace / 2, scale: 1 + (l.focusScale - 1) * strength};
  });
  return <g transform={`translate(${x} ${y})`}>
    <rect width={width} height={height} fill={theme.surface} />
    <rect width={l.gutter} height={height} fill={theme.gutter} />
    <path d={`M ${l.gutter} 0 V ${height}`} stroke={theme.divider} />
    {rows.map(({line, strength, top, height: rowHeight, baseline, scale}, index) => {
      const tokens = line.text.match(/--.*$|'(?:''|[^'])*'|\b[A-Za-z_][A-Za-z_0-9]*\b|\s+|./g) ?? [];
      return <g key={index} fontFamily={theme.fontMono}>
        <rect x={l.gutter + 1} y={top} width={width - l.gutter - 2}
          height={rowHeight} fill={theme.selection} opacity={strength} />
        <text x={l.gutter - 18} y={baseline} textAnchor="end" fontSize={25} fill={theme.lineNumber}>{index + 1}</text>
        <text transform={`translate(${l.codeX} ${baseline}) scale(${scale})`}
          fontSize={l.fontSize} xmlSpace="preserve" style={{whiteSpace: 'pre'}}>
          {tokens.map((token, tokenIndex) => <tspan key={tokenIndex} fill={tokenColor(token)}>{token}</tspan>)}
        </text>
      </g>;
    })}
    <rect width={width} height={height} fill="none" stroke={theme.line} strokeWidth={l.borderWidth} />
  </g>;
}
