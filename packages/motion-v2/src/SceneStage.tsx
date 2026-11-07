import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ThemeId} from '@channel/theme';
import {useV2Font} from './font';
import {getV2Theme} from './theme';

/** Frame conversion happens once at the composition boundary. No rounded milliseconds. */
export const useSceneTime = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return {timeMs: frame * 1000 / fps, endMs: (durationInFrames - 1) * 1000 / fps};
};

/** Native QHD SVG. Transitions are explicit; the stage adds no automatic fade. */
export const SceneStage: React.FC<{
  readonly label: string;
  readonly children: React.ReactNode;
  readonly transparent?: boolean;
  readonly opacity?: number;
  readonly themeId?: ThemeId;
}> = ({label, children, transparent = true, opacity = 1, themeId = 'graphite'}) => {
  useV2Font();
  const theme = getV2Theme(themeId);
  return <AbsoluteFill style={{background: transparent ? undefined : theme.background, opacity}}>
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" role="img" aria-label={label}
      style={{fontFamily: theme.fontSans, color: theme.text, fill: theme.text, overflow: 'hidden'}}>
      {children}
    </svg>
  </AbsoluteFill>;
};
