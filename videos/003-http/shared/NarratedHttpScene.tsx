import React from 'react';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {staticFile, useVideoConfig} from 'remotion';
import {HttpStage, type PreviewBackground} from './HttpStage';
import {useTimeMs, visibility} from './timing';
import {httpTheme as theme} from './theme';

export type HttpSceneProps = {readonly withAudio?: boolean; readonly previewBackground?: PreviewBackground};

export const NarratedHttpScene: React.FC<HttpSceneProps & {
  readonly startMs: number;
  readonly durationMs: number;
  readonly children: React.ReactNode;
  readonly sceneLayer?: React.ReactNode;
}> = ({startMs, durationMs, children, sceneLayer, withAudio = false, previewBackground}) => {
  const {fps} = useVideoConfig();
  const timeMs = useTimeMs();
  return <>
    {withAudio ? <Audio src={staticFile('generated/003-http/audio.wav')} trimBefore={msToFrames(startMs, fps)} /> : null}
    <HttpStage surface="presenter-side" opacity={visibility(timeMs, durationMs)} previewBackground={previewBackground} sceneLayer={sceneLayer}>
      {children}
    </HttpStage>
  </>;
};

export const HttpSceneHeading: React.FC<{title: string; eyebrow: string; fontSize?: number}> = ({title, eyebrow, fontSize = 72}) => <>
  <text x={136} y={194} fontFamily={theme.fontMono} fontSize={26} letterSpacing={3} fill={theme.primary}>{eyebrow}</text>
  <text x={136} y={294} fontSize={fontSize} fontWeight={700} letterSpacing={-1.6} fill={theme.text}>{title}</text>
</>;
