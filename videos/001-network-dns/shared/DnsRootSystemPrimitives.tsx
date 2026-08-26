import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import type {rootServerLetters} from './rootServerData';

export type RootServerLetter = (typeof rootServerLetters)[number];
export type RootSystemTone = 'primary' | 'signal' | 'success';
export type RootInstanceState = 'neutral' | 'healthy' | 'saturated';

const getToneColor = (
  theme: ReturnType<typeof useChannelTheme>,
  tone: RootSystemTone,
): string => {
  if (tone === 'signal') return theme.signal;
  if (tone === 'success') return theme.success;
  return theme.primary;
};

export const RootIdentityBadge: React.FC<{
  readonly active?: boolean;
  readonly letter: RootServerLetter;
  readonly reveal?: number;
  readonly tone?: RootSystemTone;
}> = ({active = false, letter, reveal = 1, tone = 'primary'}) => {
  const theme = useChannelTheme();
  const accent = getToneColor(theme, tone);

  return (
    <div
      style={{
        width: 48,
        height: 48,
        boxSizing: 'border-box',
        display: 'grid',
        placeItems: 'center',
        color: active ? theme.background : accent,
        background: active ? accent : theme.surface,
        borderTop: `5px solid ${accent}`,
        font: `800 15px ${theme.fontMono}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 9}px)`,
      }}
    >
      {letter}
    </div>
  );
};

export const RootServerGlyph: React.FC<{
  readonly label?: string;
  readonly reveal?: number;
  readonly state?: RootInstanceState;
  readonly width?: number;
}> = ({label, reveal = 1, state = 'neutral', width = 96}) => {
  const theme = useChannelTheme();
  const accent = state === 'healthy' ? theme.success : state === 'saturated' ? theme.signal : theme.primary;

  return (
    <div
      style={{
        width,
        height: 58,
        boxSizing: 'border-box',
        padding: '10px 11px',
        background: theme.surface,
        borderLeft: `5px solid ${accent}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      <div style={{display: 'flex', gap: 5}}>
        {[0, 1, 2].map((bar) => (
          <div key={bar} style={{height: 5, flex: 1, background: bar === 0 ? accent : theme.line}} />
        ))}
      </div>
      <div style={{marginTop: 10, color: state === 'neutral' ? theme.muted : accent, font: `800 7px ${theme.fontMono}`}}>
        {label ?? (state === 'saturated' ? 'SATURATED' : state === 'healthy' ? 'SERVING' : 'INSTANCE')}
      </div>
    </div>
  );
};
