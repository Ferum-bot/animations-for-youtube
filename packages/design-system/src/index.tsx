import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {fadeEnvelope} from '@channel/motion-core';
import {ChannelThemeProvider, useChannelTheme} from '@channel/theme';
import type {ThemeId} from '@channel/theme';

export {ChannelThemeProvider, getTheme, themes, useChannelTheme} from '@channel/theme';
export type {ChannelTheme, ThemeId} from '@channel/theme';

export const MotionStage: React.FC<{
  children: React.ReactNode;
  themeId?: ThemeId;
  transparent?: boolean;
}> = ({children, themeId = 'graphite', transparent = true}) => (
  <ChannelThemeProvider themeId={themeId}>
    <StageSurface transparent={transparent}>{children}</StageSurface>
  </ChannelThemeProvider>
);

const StageSurface: React.FC<{children: React.ReactNode; transparent: boolean}> = ({
  children,
  transparent,
}) => {
  const theme = useChannelTheme();
  const frame = useCurrentFrame();
  const {durationInFrames, height, width} = useVideoConfig();
  const opacity = fadeEnvelope({frame, durationInFrames});
  const designWidth = 1920;
  const designHeight = 1080;
  const scale = Math.min(width / designWidth, height / designHeight);
  const left = (width - designWidth * scale) / 2;
  const top = (height - designHeight * scale) / 2;

  return (
    <AbsoluteFill
      style={{
        background: transparent ? 'transparent' : theme.background,
        color: theme.text,
        fontFamily: theme.fontSans,
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const ServiceCard: React.FC<{
  label: string;
  detail?: string;
  x: number;
  y: number;
  active?: boolean;
}> = ({label, detail, x, y, active = false}) => {
  const theme = useChannelTheme();
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 270,
        minHeight: 118,
        boxSizing: 'border-box',
        padding: '22px 24px',
        background: theme.surface,
        borderTop: `6px solid ${active ? theme.signal : theme.primary}`,
      }}
    >
      <div style={{fontSize: 25, fontWeight: 700}}>{label}</div>
      {detail ? (
        <div style={{marginTop: 12, color: theme.muted, font: `16px ${theme.fontMono}`}}>
          {detail}
        </div>
      ) : null}
    </div>
  );
};

export const DataPacket: React.FC<{
  x: number;
  y: number;
  label?: string;
}> = ({x, y, label}) => {
  const theme = useChannelTheme();
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)'}}>
      <div style={{width: 28, height: 28, background: theme.signal, transform: 'rotate(45deg)'}} />
      {label ? (
        <div style={{marginTop: 18, color: theme.signal, font: `15px ${theme.fontMono}`}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

export const TechnicalLabel: React.FC<{children: React.ReactNode}> = ({children}) => {
  const theme = useChannelTheme();
  return <div style={{color: theme.muted, font: `16px ${theme.fontMono}`}}>{children}</div>;
};
