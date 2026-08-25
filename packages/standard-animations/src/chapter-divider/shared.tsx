import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, smoothProgress} from '@channel/motion-core';
import {useChannelTheme} from '@channel/design-system';

const maxLineLength = (lines: readonly string[]): number =>
  Math.max(...lines.map((line) => Array.from(line).length));

const headlineSize = (lines: readonly string[]): number => {
  const length = maxLineLength(lines);
  if (length <= 13) return 126;
  if (length <= 18) return 112;
  if (length <= 24) return 96;
  return 82;
};

export const formatChapterNumber = (chapterNumber: number): string =>
  String(Math.max(0, Math.trunc(chapterNumber))).padStart(2, '0');

export const useDividerProgress = () => {
  const frame = useCurrentFrame();

  return {
    frame,
    structure: smoothProgress(frame, 4, 28),
    title: smoothProgress(frame, 18, 42),
    detail: smoothProgress(frame, 34, 52),
    settle: smoothProgress(frame, 42, 72),
    depart: smoothProgress(frame, 94, 116),
  };
};

export const ChapterLabel: React.FC<{
  chapterNumber: number;
  light?: boolean;
}> = ({chapterNumber, light = false}) => {
  const theme = useChannelTheme();
  const number = formatChapterNumber(chapterNumber);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        color: light ? theme.text : theme.muted,
        fontFamily: theme.fontMono,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 2.8,
      }}
    >
      <span style={{color: theme.signal}}>ЧАСТЬ</span>
      <span>{number}</span>
    </div>
  );
};

export const KineticTitle: React.FC<{
  lines: readonly string[];
  progress: number;
  align?: 'left' | 'right';
  accentLine?: number;
}> = ({lines, progress, align = 'left', accentLine}) => {
  const theme = useChannelTheme();
  const fontSize = headlineSize(lines);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        fontFamily: theme.fontSans,
        fontSize,
        fontWeight: 800,
        letterSpacing: -0.052 * fontSize,
        lineHeight: 0.92,
        textAlign: align,
      }}
    >
      {lines.map((line, index) => {
        const lineProgress = interpolate(progress, [index * 0.12, 0.68 + index * 0.12], [0, 1], clamp);
        return (
          <div key={`${index}-${line}`} style={{overflow: 'hidden', padding: '0 0 0.09em'}}>
            <div
              style={{
                color: index === accentLine ? theme.primary : theme.text,
                opacity: lineProgress,
                transform: `translateY(${(1 - lineProgress) * 1.05}em)`,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TechnicalDetail: React.FC<{
  eyebrow: string;
  detail: string;
  progress: number;
  align?: 'left' | 'right';
}> = ({eyebrow, detail, progress, align = 'left'}) => {
  const theme = useChannelTheme();
  const offset = (1 - progress) * (align === 'right' ? -24 : 24);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 11,
        opacity: progress,
        transform: `translateX(${offset}px)`,
        textAlign: align,
      }}
    >
      <div
        style={{
          color: theme.signal,
          fontFamily: theme.fontMono,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 2.5,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          color: theme.muted,
          fontFamily: theme.fontMono,
          fontSize: 16,
          letterSpacing: 0.9,
        }}
      >
        {detail}
      </div>
    </div>
  );
};
