import React from 'react';
import {palette as p} from './theme';
import {reveal} from '../timing';

export const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  mono?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  weight?: number;
}> = ({
  x,
  y,
  children,
  size = 32,
  color = p.text,
  mono = false,
  anchor = 'start',
  opacity = 1,
  weight = 400,
}) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontSize={size}
    fontFamily={mono ? p.fontMono : p.fontSans}
    textAnchor={anchor}
    opacity={opacity}
    fontWeight={weight}
  >
    {children}
  </text>
);

export const Line: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: number;
  dashed?: boolean;
  color?: string;
  width?: number;
}> = ({x1, y1, x2, y2, active = 0, dashed = false, color = p.line, width = 2}) => (
  <>
    <path
      d={`M${x1} ${y1} L${x2} ${y2}`}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? '8 12' : undefined}
      fill="none"
    />
    {active > 0 ? (
      <path
        d={`M${x1} ${y1} L${x1 + (x2 - x1) * active} ${y1 + (y2 - y1) * active}`}
        stroke={p.primary}
        strokeWidth={4}
        fill="none"
      />
    ) : null}
  </>
);

export const Plate: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  depth?: number;
  accent?: string;
  children?: React.ReactNode;
  opacity?: number;
  fill?: string;
}> = ({x, y, w, h, depth = 18, accent = p.edge, children, opacity = 1, fill = p.surface}) => (
  <g opacity={opacity}>
    <path
      d={`M${x} ${y} l${depth} ${-depth} h${w} l${-depth} ${depth} Z`}
      fill={p.edge}
      opacity={0.65}
    />
    <path
      d={`M${x + w} ${y} l${depth} ${-depth} v${h} l${-depth} ${depth} Z`}
      fill={p.deep}
      stroke={p.edge}
      strokeWidth={1.5}
    />
    <rect x={x} y={y} width={w} height={h} fill={fill} stroke={accent} strokeWidth={1.8} />
    <path d={`M${x + 1} ${y + 1} H${x + w - 1}`} stroke={accent} strokeWidth={3} />
    {children}
  </g>
);

export const Bracket: React.FC<{x: number; y: number; w: number; h: number; color?: string}> = ({
  x,
  y,
  w,
  h,
  color = p.primary,
}) => (
  <path
    d={`M${x + 25} ${y} H${x} V${y + h} H${x + 25} M${x + w - 25} ${y} H${x + w} V${y + h} H${x + w - 25}`}
    stroke={color}
    strokeWidth={3}
    fill="none"
  />
);

export const FooterNote: React.FC<{title: string; detail?: string}> = ({title, detail}) => (
  <g>
    <path d="M170 1168 H234" stroke={p.primary} strokeWidth={4} />
    <Label x={170} y={1220} size={36} weight={500}>
      {title}
    </Label>
    {detail ? (
      <Label x={170} y={1265} size={25} color={p.muted}>
        {detail}
      </Label>
    ) : null}
  </g>
);

export const Reveal: React.FC<{
  time: number;
  at: number;
  children: React.ReactNode;
  duration?: number;
}> = ({time, at, children, duration = 650}) => {
  const a = reveal(time, at, duration);
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 16})`}>
      {children}
    </g>
  );
};

export const ByteCells: React.FC<{
  x: number;
  y: number;
  count: number;
  width?: number;
  h?: number;
  gapIndex?: number;
  highlight?: number;
  labels?: readonly string[];
  color?: string;
}> = ({
  x,
  y,
  count,
  width = 90,
  h = 84,
  gapIndex = -1,
  highlight = -1,
  labels,
  color = p.primary,
}) => (
  <g>
    {Array.from({length: count}, (_, i) => (
      <g key={i}>
        <rect
          x={x + i * width}
          y={y}
          width={width - 5}
          height={h}
          fill={i === gapIndex ? p.deep : p.surface}
          stroke={i === highlight ? color : p.edge}
          strokeDasharray={i === gapIndex ? '5 7' : undefined}
          strokeWidth={i === highlight ? 3 : 1.5}
        />
        <Label
          x={x + i * width + (width - 5) / 2}
          y={y + h / 2 + 10}
          size={Math.min(30, width * 0.28)}
          mono
          color={i === gapIndex ? p.muted : color}
          anchor="middle"
        >
          {i === gapIndex ? '?' : (labels?.[i] ?? String(i + 1))}
        </Label>
      </g>
    ))}
  </g>
);

export const DeliveryGate: React.FC<{x: number; y: number; h: number; waiting?: boolean}> = ({
  x,
  y,
  h,
  waiting = false,
}) => (
  <g>
    <line
      x1={x}
      x2={x}
      y1={y - 15}
      y2={y + h + 15}
      stroke={waiting ? p.muted : p.primary}
      strokeWidth={4}
    />
    <path
      d={`M${x - 9} ${y - 5} L${x} ${y - 15} L${x + 9} ${y - 5}`}
      stroke={waiting ? p.muted : p.primary}
      strokeWidth={3}
      fill="none"
    />
  </g>
);
