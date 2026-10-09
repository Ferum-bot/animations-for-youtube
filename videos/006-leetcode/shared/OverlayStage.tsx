import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import type {MotionProfile} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import {getLeetcodeTheme, type LeetcodeTheme} from './theme';
import {useOverlayTiming} from './useOverlayTiming';

export type OverlayProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

/** Common SVG lifecycle for episode-local code panels and reference tables. */
export const OverlayStage: React.FC<OverlayProps & {
  readonly durationMs: number;
  readonly audioFile: string;
  readonly children: (state: {readonly timeMs: number; readonly theme: LeetcodeTheme}) => React.ReactNode;
}> = ({themeId = 'paper', motionProfile = 'calm', previewBackground = 'transparent',
  withAudio = false, durationMs, audioFile, children}) => {
  const {timeMs, opacity, offsetY} = useOverlayTiming(durationMs, motionProfile);
  const theme = getLeetcodeTheme(themeId);
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile(audioFile)} /> : null}
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
      <g opacity={opacity} transform={`translate(0 ${offsetY})`}>
        {children({timeMs, theme})}
      </g>
    </svg>
  </AbsoluteFill>;
};
