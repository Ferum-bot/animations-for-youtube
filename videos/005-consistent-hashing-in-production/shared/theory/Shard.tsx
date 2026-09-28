import React from 'react';
import {hashingTheme as theme} from '../theme';
import {Mono} from './Typography';
export const Shard: React.FC<{
  readonly x: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly label: string;
  readonly selected?: boolean;
  readonly opacity?: number;
  readonly children?: React.ReactNode;
}> = ({x, y = 800, width = 280, height = 250, label, selected = false, opacity = 1, children}) => (
  <g opacity={opacity}>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={theme.surface}
      stroke={selected ? theme.primary : theme.line}
      strokeWidth={2}
    />
    <Mono x={x + 22} y={y + 47} anchor="start" size={31}>
      {label}
    </Mono>
    <path d={`M${x} ${y + 70} H${x + width}`} stroke={theme.line} strokeWidth={2} />
    {children}
  </g>
);
