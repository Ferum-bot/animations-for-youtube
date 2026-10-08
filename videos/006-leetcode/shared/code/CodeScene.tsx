import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import type {MotionProfile} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import {CodePanel, type CodeSpacing, type CodePanelVariant} from './CodePanel';
import type {CodeCue, CodeToken} from './types';
import {getLeetcodeTheme} from '../theme';
import {useOverlayTiming} from '../useOverlayTiming';

export type CodeSceneProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

export const CodeScene: React.FC<CodeSceneProps & {
  readonly lines: readonly (readonly CodeToken[])[];
  readonly cues: readonly CodeCue[];
  readonly durationMs: number;
  readonly audioFile: string;
  readonly fileName: string;
  readonly title: string;
  readonly spacing?: CodeSpacing;
  readonly variant?: CodePanelVariant;
}> = ({themeId = 'paper', motionProfile = 'calm', previewBackground = 'transparent',
  withAudio = false, lines, cues, durationMs, audioFile, fileName, title, spacing, variant}) => {
  const {timeMs, opacity, offsetY} = useOverlayTiming(durationMs, motionProfile);
  const theme = getLeetcodeTheme(themeId);
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile(audioFile)} /> : null}
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
      <g opacity={opacity} transform={`translate(0 ${offsetY})`}>
        <CodePanel theme={theme} lines={lines} cues={cues} timeMs={timeMs}
          fileName={fileName} title={title} spacing={spacing} variant={variant} />
      </g>
    </svg>
  </AbsoluteFill>;
};
