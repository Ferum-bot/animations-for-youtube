import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {HttpPreviewBackground} from './HttpStage';
import type {HttpSceneProps} from './NarratedHttpScene';

type PreviewScene = {
  readonly component: React.ComponentType<HttpSceneProps>;
  readonly startMs: number;
  readonly durationMs: number;
};

/** One narration track; round shared boundaries, not individual durations. */
export const HttpPartPreview: React.FC<{
  readonly scenes: readonly [PreviewScene, ...PreviewScene[]];
}> = ({scenes}) => {
  const {fps} = useVideoConfig();
  const startMs = scenes[0].startMs;
  return <AbsoluteFill>
    <HttpPreviewBackground background="presenter" />
    <Audio src={staticFile('generated/003-http/audio.wav')} trimBefore={msToFrames(startMs, fps)} />
    {scenes.map(({component: Scene, startMs: sceneStart, durationMs}) => <Sequence key={sceneStart}
      from={msToFrames(sceneStart - startMs, fps)}
      durationInFrames={msToFrames(sceneStart + durationMs - startMs, fps) - msToFrames(sceneStart - startMs, fps)}>
      <Scene withAudio={false} />
    </Sequence>)}
  </AbsoluteFill>;
};
