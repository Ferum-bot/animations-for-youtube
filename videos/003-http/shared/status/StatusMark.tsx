import React from 'react';
import {statusTheme as theme} from './theme';

export const StatusMark: React.FC<{
  readonly code: string;
  readonly label: string;
  readonly x?: number;
  readonly y?: number;
  readonly error?: boolean;
}> = ({code, label, x = 570, y = 760, error = false}) => (
  <g>
    <text x={x} y={y} fontFamily={theme.fontMono} fontSize={160} letterSpacing={-8} fill={error ? theme.danger : theme.primary}>{code}</text>
    <text x={x} y={y + 76} fontFamily={theme.fontMono} fontSize={32} fill={theme.text}>{label}</text>
  </g>
);
