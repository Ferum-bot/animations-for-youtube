import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {smoothProgress, type MotionProfile} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import {CodePanel} from '../code/CodePanel';
import type {CodeCue} from '../code/types';
import {getLeetcodeTheme} from '../theme';
import {commandLines} from './command';

export type DockerSceneProps = {
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

export const DockerScene: React.FC<DockerSceneProps & {
  readonly cues: readonly CodeCue[];
  readonly durationMs: number;
  readonly audioFile: string;
}> = ({themeId = 'paper', motionProfile = 'calm', previewBackground = 'transparent',
  withAudio = false, cues, durationMs, audioFile}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeMs = frame * 1000 / fps;
  const theme = getLeetcodeTheme(themeId);
  const timing = transitions[motionProfile];
  const enter = smoothProgress(timeMs, 0, timing.enterMs);
  const exitEndMs = (Math.round(durationMs * fps / 1000) - 1) * 1000 / fps;
  const exit = smoothProgress(timeMs, exitEndMs - timing.exitMs, exitEndMs);
  const opacity = enter * (1 - exit);
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile(audioFile)} /> : null}
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
      <g opacity={opacity} transform={`translate(0 ${(1 - enter) * 12 - exit * 6})`}>
        <CodePanel theme={theme} lines={commandLines} cues={cues} timeMs={timeMs}
          fileName="docker-run.sh" title="Запуск пользовательского кода" />
      </g>
    </svg>
  </AbsoluteFill>;
};
