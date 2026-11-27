import React from 'react';
import {v2Theme} from '@channel/motion-v2';

export const TranslatedQuote: React.FC<{
  readonly y: number;
  readonly opacity: number;
  readonly original: string;
  readonly translation: string;
}> = ({y, opacity, original, translation}) => (
  <g transform={`translate(0 ${y})`} opacity={opacity}>
    <rect y={-12} width={1000} height={130} fill={v2Theme.surface} />
    <g fill={v2Theme.text}>
      <text x={28} y={38} fontSize={37} fontWeight={550}>{original}</text>
      <text x={28} y={90} fontSize={43} fontWeight={730}>{translation}</text>
    </g>
  </g>
);
