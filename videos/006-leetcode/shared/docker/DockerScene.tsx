import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import type {MotionProfile} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import {CodePanel} from '../code/CodePanel';
import type {CodeCue} from '../code/types';
import {getLeetcodeTheme} from '../theme';
import {commandLines} from './command';
import {useOverlayTiming} from '../useOverlayTiming';

export type DockerSceneProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

export const DockerScene: React.FC<DockerSceneProps & {
  readonly cues: readonly CodeCue[];
  readonly durationMs: number;
  readonly audioFile: string;
}> = ({themeId = 'paper', motionProfile = 'calm', previewBackground = 'transparent',
  withAudio = false, cues, durationMs, audioFile}) => {
  const {timeMs, opacity, offsetY} = useOverlayTiming(durationMs, motionProfile);
  const theme = getLeetcodeTheme(themeId);
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile(audioFile)} /> : null}
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
      <g opacity={opacity} transform={`translate(0 ${offsetY})`}>
        <CodePanel theme={theme} lines={commandLines} cues={cues} timeMs={timeMs}
          fileName="docker-run.sh" title="Запуск пользовательского кода" />
      </g>
    </svg>
  </AbsoluteFill>;
};
