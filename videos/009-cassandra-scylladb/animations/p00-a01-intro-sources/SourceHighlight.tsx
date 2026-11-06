import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import {getTheme} from '@channel/theme';
import {episodeFontFamily} from '../../shared/font';
import {scene, type Highlight} from './scene';
import {crops, type CropId} from './sources';

export const highlightProgress = (mark: Highlight, timeMs: number): number =>
  smoothProgress(timeMs, mark.startMs, mark.startMs + 240) *
  (1 - smoothProgress(timeMs, mark.endMs - 180, mark.endMs));

/** Typeset exact quotations at production size; never magnify screenshot pixels. */
export const SourceHighlight: React.FC<{
  readonly mark: Highlight;
  readonly cropId: CropId;
  readonly timeMs: number;
}> = ({mark, cropId, timeMs}) => {
  const progress = highlightProgress(mark, timeMs);
  if (progress === 0) return null;
  const crop = crops[cropId];
  const pageScale = scene.width / crop.width;
  const height = crop.height * pageScale;
  const fontSize = Math.min(mark.fontSize ?? 64, (height - 28) / (mark.lines.length * 1.4));
  const rowHeight = fontSize * 1.4;
  const targetTop = (height - rowHeight * mark.lines.length) / 2;
  const theme = getTheme(crop.background === '#ffffff' ? 'paper' : 'graphite');
  const accent = getTheme('signal').primary;
  return <>{mark.lines.map((rect, index) => {
    const sourceCenter = (rect.x + rect.width / 2) * pageScale;
    const left = sourceCenter + (scene.width / 2 - sourceCenter) * progress;
    const top = rect.y * pageScale + (targetTop + index * rowHeight - rect.y * pageScale) * progress;
    const sourceFontSize = rect.height * pageScale * 0.65;
    return <span key={index} data-source-quote={rect.text} style={{
      position: 'absolute', left, top, transform: 'translateX(-50%)',
      display: 'block', whiteSpace: 'nowrap', opacity: progress,
      fontFamily: episodeFontFamily, fontWeight: 600,
      fontSize: sourceFontSize + (fontSize - sourceFontSize) * progress,
      lineHeight: 1.25, padding: '2px 8px 5px',
      color: theme.text, backgroundColor: crop.background,
      boxShadow: `inset 0 -3px ${accent}, 0 4px 14px ${getTheme('signal').background}60`,
    }}>{rect.text}</span>;
  })}</>;
};
