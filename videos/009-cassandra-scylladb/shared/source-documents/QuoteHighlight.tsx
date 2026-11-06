import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import {getTheme} from '@channel/theme';
import {episodeFontFamily} from '../font';
export type QuoteLine = {
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type Highlight = {
  readonly startMs: number;
  readonly endMs: number;
  readonly fontSize?: number;
  readonly lines: readonly QuoteLine[];
};

export const highlightProgress = (mark: Highlight, timeMs: number): number =>
  smoothProgress(timeMs, mark.startMs, mark.startMs + 240) *
  (1 - smoothProgress(timeMs, mark.endMs - 180, mark.endMs));

/** Typeset exact quotations at production size; never magnify screenshot pixels. */
export const QuoteHighlight: React.FC<{
  readonly mark: Highlight;
  readonly width: number;
  readonly height: number;
  readonly sourceScale: number;
  readonly background: string;
  readonly timeMs: number;
  readonly motion?: 'from-source' | 'reveal';
}> = ({mark, width, height, sourceScale, background, timeMs, motion = 'from-source'}) => {
  const progress = highlightProgress(mark, timeMs);
  if (progress === 0) return null;
  const pageScale = sourceScale;
  const fontSize = Math.min(mark.fontSize ?? 64, (height - 28) / (mark.lines.length * 1.4));
  const rowHeight = fontSize * 1.4;
  const targetTop = (height - rowHeight * mark.lines.length) / 2;
  const theme = getTheme(background === '#ffffff' ? 'paper' : 'graphite');
  const accent = getTheme('signal').primary;
  // A multi-line reflow of one source line must not cross its own glyphs.
  // Preserve the approved intro's source-to-centre motion by default.
  const layoutProgress = motion === 'reveal' ? 1 : progress;
  return <>{mark.lines.map((rect, index) => {
    const sourceCenter = (rect.x + rect.width / 2) * pageScale;
    const left = sourceCenter + (width / 2 - sourceCenter) * layoutProgress;
    const top = rect.y * pageScale + (targetTop + index * rowHeight - rect.y * pageScale) * layoutProgress
      + (motion === 'reveal' ? 12 * (1 - progress) : 0);
    const sourceFontSize = rect.height * pageScale * 0.65;
    return <span key={index} data-source-quote={rect.text} style={{
      position: 'absolute', left, top, transform: 'translateX(-50%)',
      display: 'block', whiteSpace: 'nowrap', opacity: progress,
      fontFamily: episodeFontFamily, fontWeight: 600,
      fontSize: sourceFontSize + (fontSize - sourceFontSize) * layoutProgress,
      lineHeight: 1.25, padding: '2px 8px 5px',
      color: theme.text, backgroundColor: background,
      boxShadow: `inset 0 -3px ${accent}, 0 4px 14px ${getTheme('signal').background}60`,
    }}>{rect.text}</span>;
  })}</>;
};
