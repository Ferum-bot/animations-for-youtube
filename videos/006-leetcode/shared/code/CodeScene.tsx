import React from 'react';
import {OverlayStage, type OverlayProps} from '../OverlayStage';
import {CodePanel, type CodeSpacing, type CodePanelVariant} from './CodePanel';
import type {CodeCue, CodeToken} from './types';
export type CodeSceneProps = OverlayProps;

export const CodeScene: React.FC<CodeSceneProps & {
  readonly lines: readonly (readonly CodeToken[])[];
  readonly cues: readonly CodeCue[];
  readonly durationMs: number;
  readonly audioFile: string;
  readonly fileName: string;
  readonly title: string;
  readonly spacing?: CodeSpacing;
  readonly variant?: CodePanelVariant;
}> = ({lines, cues, durationMs, audioFile, fileName, title, spacing, variant, ...props}) =>
  <OverlayStage {...props} durationMs={durationMs} audioFile={audioFile}>
    {({timeMs, theme}) => <CodePanel theme={theme} lines={lines} cues={cues} timeMs={timeMs}
      fileName={fileName} title={title} spacing={spacing} variant={variant} />}
  </OverlayStage>;
