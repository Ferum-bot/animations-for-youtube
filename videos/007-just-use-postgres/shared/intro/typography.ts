import type {CSSProperties} from 'react';
import {getTheme} from '@channel/theme';

// Keep the same two-tone contrast over both the wall and the bright monitor.
export const lettering = {
  fill: getTheme('paper').primary,
  outline: getTheme('graphite').text,
} as const;

export const outlinedText = (width: number): CSSProperties => ({
  color: lettering.fill,
  WebkitTextStroke: `${width}px ${lettering.outline}`,
  paintOrder: 'stroke fill',
});
