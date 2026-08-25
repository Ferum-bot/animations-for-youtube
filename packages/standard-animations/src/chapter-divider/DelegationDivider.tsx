import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp} from '@channel/motion-core';
import {
  ChapterLabel,
  formatChapterNumber,
  KineticTitle,
  TechnicalDetail,
  useDividerProgress,
} from './shared';
import type {ChapterDividerProps} from './types';

const labels = [
  {name: 'ROOT', width: 112},
  {name: 'EDU', width: 96},
  {name: 'CHICAGO', width: 148},
  {name: 'SECURITY', width: 164},
] as const;

export const DelegationDividerCanvas: React.FC<ChapterDividerProps> = ({
  chapterNumber,
  titleLines,
  eyebrow,
  detail,
}) => {
  const theme = useChannelTheme();
  const {structure, title, detail: detailProgress, settle, depart} = useDividerProgress();
  const titleShift = interpolate(depart, [0, 1], [0, -32], clamp);
  const branchEnd = 118 + structure * 1638;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundImage: `linear-gradient(${theme.line}32 1px, transparent 1px), linear-gradient(90deg, ${theme.line}32 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 72,
          right: 112,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ChapterLabel chapterNumber={chapterNumber} />
        <div style={{color: theme.muted, font: `15px ${theme.fontMono}`, letterSpacing: 2}}>
          CHAPTER TRANSITION / DELEGATION
        </div>
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0}}
      >
        <path
          d={`M 118 184 H ${branchEnd}`}
          fill="none"
          stroke={theme.text}
          strokeWidth={3}
        />
        <path
          d={`M 118 184 V ${184 + structure * 748}`}
          fill="none"
          stroke={theme.text}
          strokeWidth={3}
        />
        <path
          d="M 118 932 H 1802"
          fill="none"
          stroke={theme.line}
          strokeWidth={2}
          strokeDasharray="8 16"
          opacity={structure}
        />
      </svg>

      <div style={{position: 'absolute', left: 146, top: 128, display: 'flex', gap: 12}}>
        {labels.map((label, index) => {
          const labelProgress = interpolate(
            structure,
            [index * 0.12, 0.56 + index * 0.1],
            [0, 1],
            clamp,
          );
          return (
            <div
              key={label.name}
              style={{
                width: label.width,
                height: 56,
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                background: index === labels.length - 1 ? theme.primary : theme.surface,
                border: `2px solid ${index === labels.length - 1 ? theme.primary : theme.text}`,
                color: index === labels.length - 1 ? theme.background : theme.text,
                font: `700 15px ${theme.fontMono}`,
                letterSpacing: 1.6,
                opacity: labelProgress,
                transform: `translateX(${(1 - labelProgress) * 90}px)`,
              }}
            >
              {label.name}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 154,
          top: 336,
          width: 1210,
          transform: `translateX(${titleShift}px)`,
        }}
      >
        <KineticTitle lines={titleLines} progress={title} accentLine={titleLines.length - 1} />
      </div>

      <div style={{position: 'absolute', left: 158, bottom: 96}}>
        <TechnicalDetail eyebrow={eyebrow} detail={detail} progress={detailProgress} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 98,
          top: 278,
          width: 420,
          color: 'transparent',
          WebkitTextStroke: `3px ${theme.line}`,
          fontFamily: theme.fontSans,
          fontSize: 330,
          fontWeight: 800,
          letterSpacing: -24,
          lineHeight: 1,
          opacity: settle,
          transform: `translateY(${(1 - settle) * 42}px)`,
        }}
      >
        {formatChapterNumber(chapterNumber)}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 112,
          bottom: 96,
          width: 18 + settle * 300,
          height: 14,
          background: theme.signal,
        }}
      />
    </div>
  );
};
