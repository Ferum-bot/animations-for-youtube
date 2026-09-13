import React from 'react';
import {httpTheme as theme} from './theme';

export const MessageBrackets: React.FC<{
  x: number; y: number; width: number; height: number;
  markerY: number; opacity?: number; arm?: number;
}> = ({x, y, width, height, markerY, opacity = 1, arm = 66}) => {
  const left = `M ${arm} 0 L ${arm - 14} 8 H 8 V ${height - 8}
    H ${arm - 14} L ${arm} ${height} H 0 V 0 Z`;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <path d={left} fill={theme.text} />
      <path d={left} transform={`translate(${width} 0) scale(-1 1)`} fill={theme.text} />
      <rect x={-1} y={Math.max(12, Math.min(height - 56, markerY))}
        width={11} height={44} fill={theme.primary} />
    </g>
  );
};
