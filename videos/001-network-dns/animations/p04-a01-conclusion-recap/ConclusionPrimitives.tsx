import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';

export type ConclusionTone = 'primary' | 'signal' | 'success' | 'muted';

const getToneColor = (
  theme: ReturnType<typeof useChannelTheme>,
  tone: ConclusionTone,
): string => {
  if (tone === 'signal') return theme.signal;
  if (tone === 'success') return theme.success;
  if (tone === 'muted') return theme.line;
  return theme.primary;
};

export const ConclusionBlock: React.FC<{
  readonly detail: string;
  readonly height?: number;
  readonly reveal?: number;
  readonly title: string;
  readonly tone?: ConclusionTone;
  readonly width: number;
}> = ({detail, height = 82, reveal = 1, title, tone = 'primary', width}) => {
  const theme = useChannelTheme();
  const accent = getToneColor(theme, tone);

  return (
    <div style={{width, height, boxSizing: 'border-box', padding: '14px 16px', background: theme.surface, borderTop: `6px solid ${accent}`, opacity: reveal, transform: `translateY(${(1 - reveal) * 12}px)`}}>
      <div style={{color: theme.text, font: `800 14px ${theme.fontSans}`}}>{title}</div>
      <div style={{marginTop: 13, color: accent, font: `800 8px ${theme.fontMono}`, letterSpacing: 0.7}}>{detail}</div>
    </div>
  );
};

export const ConclusionPath: React.FC<{
  readonly d: string;
  readonly progress: number;
  readonly tone?: ConclusionTone;
  readonly width?: number;
}> = ({d, progress, tone = 'primary', width = 5}) => {
  const theme = useChannelTheme();

  return (
    <path
      d={d}
      fill="none"
      pathLength={1}
      stroke={getToneColor(theme, tone)}
      strokeDasharray="1"
      strokeDashoffset={1 - clamp01(progress)}
      strokeWidth={width}
    />
  );
};

export const ConclusionTag: React.FC<{
  readonly label: string;
  readonly reveal?: number;
  readonly tone?: ConclusionTone;
}> = ({label, reveal = 1, tone = 'primary'}) => {
  const theme = useChannelTheme();
  const accent = getToneColor(theme, tone);

  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 9, color: accent, font: `800 9px ${theme.fontMono}`, letterSpacing: 0.8, opacity: reveal}}>
      <span style={{width: 10, height: 10, background: accent, transform: 'rotate(45deg)'}} />
      {label}
    </div>
  );
};
