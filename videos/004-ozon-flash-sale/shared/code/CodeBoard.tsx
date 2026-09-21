import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {clamp01, msToFrames, smoothProgress} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import video from '../../video.json';
import {getOzonTheme} from '../theme';

export type CodeBoardProps = {
  readonly themeId?: ThemeId;
  readonly backgroundOpacity?: number;
  readonly withAudio?: boolean;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
};

const transition = {enterMs: 900, exitMs: 1100} as const;

export const CodeBoard: React.FC<CodeBoardProps & {
  readonly startMs: number;
  readonly title: string;
  readonly language: string;
  readonly children: React.ReactNode;
}> = ({themeId = 'paper', backgroundOpacity = 1,
  withAudio = false, previewBackground = 'transparent', startMs, title, language, children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const theme = getOzonTheme(themeId);
  const lastFrame = durationInFrames - 1;
  const opacity = smoothProgress(frame, 0, msToFrames(transition.enterMs, fps)) *
    (1 - smoothProgress(frame, lastFrame - msToFrames(transition.exitMs, fps), lastFrame));
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{background:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio && video.audio ? <Audio src={staticFile(video.audio)} trimBefore={msToFrames(startMs, fps)} /> : null}
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{background: theme.background, opacity: clamp01(backgroundOpacity)}} />
      <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0, fontFamily: theme.fontSans}}>
        <defs>
          <pattern id="reservation-board-dots" width={32} height={32} patternUnits="userSpaceOnUse">
            <circle cx={16} cy={16} r={1.15} fill={theme.grid} opacity={0.45} />
          </pattern>
        </defs>
        <rect width={2560} height={1440} fill="url(#reservation-board-dots)" />
        <text x={208} y={163} fontSize={49} fontWeight={600} fill={theme.text}>{title}</text>
        <path d="M 207 183 Q 475 188 758 182" stroke={theme.secondary} strokeWidth={2.3} fill="none" strokeLinecap="round" />
        <text x={2440} y={161} fontSize={25} textAnchor="end" fontFamily={theme.fontMono} fill={theme.comment}>{language}</text>
        {children}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export const useCodeTimeMs = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame * 1000 / fps;
};
