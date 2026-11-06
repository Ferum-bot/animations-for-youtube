import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {getTheme, type ThemeId} from '@channel/theme';
import type {MotionProfile} from '@channel/motion-core';
import {episodeFontFamily as family, useEpisodeFont} from './font';
import {entranceTime} from './chapter-motion';

export type ChapterDividerProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
};

export const useChapterScene = (
  themeId: ThemeId,
  motionProfile: MotionProfile,
) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timeMs = frame * 1000 / fps;
  return {
    timeMs,
    entranceMs: entranceTime(timeMs, motionProfile),
    endMs: (durationInFrames - 1) * 1000 / fps,
    theme: {...getTheme(themeId), fontSans: family},
  };
};

/** Opaque cutaway. Geometry lives in the production coordinate system. */
export const ChapterStage: React.FC<{
  readonly themeId: ThemeId;
  readonly children: React.ReactNode;
  readonly label: string;
}> = ({themeId, children, label}) => {
  useEpisodeFont();

  return (
    <AbsoluteFill style={{backgroundColor: getTheme(themeId).background}}>
      <svg width="100%" height="100%" viewBox="0 0 2560 1440"
        role="img" aria-label={label}
        style={{fontFamily: family, overflow: 'hidden'}}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

export const ChapterEyebrow: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly color: string;
  readonly opacity?: number;
  readonly label: string;
}> = ({x, y, color, opacity = 1, label}) => (
  <text x={x} y={y} fill={color} opacity={opacity}
    fontSize={38} fontWeight={700} letterSpacing={5}>{label}</text>
);
