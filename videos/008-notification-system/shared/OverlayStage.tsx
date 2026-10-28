import React from 'react';
import {AbsoluteFill, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {fadeEnvelope, smoothProgress, type MotionProfile} from '@channel/motion-core';
import {getTheme, type ChannelTheme, type ThemeId} from '@channel/theme';

export type OverlayProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

const transitions = {
  calm: {enterMs: 400, exitMs: 500},
  technical: {enterMs: 300, exitMs: 400},
  energetic: {enterMs: 200, exitMs: 300},
} as const satisfies Record<MotionProfile, {readonly enterMs: number; readonly exitMs: number}>;

/** QHD overlay lifecycle; appearance and motion speed are independent. */
export const OverlayStage: React.FC<OverlayProps & {
  readonly audioFile: string;
  readonly children: (state: {readonly timeMs: number; readonly theme: ChannelTheme}) => React.ReactNode;
}> = ({themeId = 'paper', motionProfile = 'calm', previewBackground = 'transparent',
  withAudio = false, audioFile, children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timeMs = frame * 1000 / fps;
  const timing = transitions[motionProfile];
  const opacity = fadeEnvelope({frame, durationInFrames,
    enterFrames: Math.round(timing.enterMs * fps / 1000),
    exitFrames: Math.round(timing.exitMs * fps / 1000)});
  const enter = smoothProgress(timeMs, 0, timing.enterMs);
  const baseTheme = getTheme(themeId);
  // The brand cobalt needs a lighter text tint on the graphite surface.
  const theme = themeId === 'graphite'
    ? {...baseTheme, primary: interpolateColors(0.4, [0, 1], [baseTheme.primary, baseTheme.text])}
    : baseTheme;
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile(audioFile)} /> : null}
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
      <g opacity={opacity} transform={`translate(0 ${(1 - enter) * 12})`}>
        {children({timeMs, theme})}
      </g>
    </svg>
  </AbsoluteFill>;
};
