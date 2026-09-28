import React from 'react';
import {hashingTheme as theme} from '../theme';

/** The statement belongs to the scene; no chapter chrome or recurring footer. */
export const Heading: React.FC<{readonly lines: readonly [string, string]}> = ({lines}) => (
  <>
    {lines.map((line, index) => (
      <text
        key={line}
        x={104}
        y={180 + index * 78}
        fontSize={64}
        letterSpacing={-1.5}
        fontWeight={650}
        fill={index ? theme.primary : theme.text}
      >
        {line}
      </text>
    ))}
  </>
);

/** Browser text layout keeps Russian prose inside a real, bounded annotation area. */
export const Annotation: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly text: string;
  readonly detail?: string;
  readonly accent?: boolean;
}> = ({x, y, width, text, detail, accent = false}) => (
  <foreignObject x={x} y={y} width={width} height={600}>
    <div style={{fontFamily: theme.fontSans, color: theme.text}}>
      <p style={{margin: 0, fontSize: 32, lineHeight: 1.35, color: accent ? theme.signal : theme.text}}>
        {text}
      </p>
      {detail ? (
        <p style={{margin: '24px 0 0', fontSize: 26, lineHeight: 1.4, color: theme.muted}}>{detail}</p>
      ) : null}
    </div>
  </foreignObject>
);
export const Mono: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly color?: string;
  readonly anchor?: 'start' | 'middle' | 'end';
  readonly children: React.ReactNode;
}> = ({x, y, size = 38, color = theme.text, anchor = 'middle', children}) => (
  <text x={x} y={y} fontSize={size} fontFamily={theme.fontMono} fill={color} textAnchor={anchor}>
    {children}
  </text>
);
