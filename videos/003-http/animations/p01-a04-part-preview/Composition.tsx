import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {HttpPreviewBackground} from '../../shared/HttpStage';
import {partOneScenes} from '../../shared/partOneTiming';
import RequestResponse from '../p01-a01-request-response/Composition';
import ReadableHttp from '../p01-a02-readable-http/Composition';
import ProtocolPassport from '../p01-a03-protocol-passport/Composition';

const previews = [
  {...partOneScenes.exchange, component: RequestResponse},
  {...partOneScenes.readable, component: ReadableHttp},
  {...partOneScenes.passport, component: ProtocolPassport},
] as const;

const Composition: React.FC = () => {
  const {fps} = useVideoConfig();
  const startMs = partOneScenes.exchange.startMs;
  return <AbsoluteFill>
    <HttpPreviewBackground background="presenter" />
    <Audio src={staticFile('generated/003-http/audio.wav')} trimBefore={msToFrames(startMs, fps)} />
    {previews.map(({component: Scene, startMs: sceneStart, durationMs}) =>
      <Sequence key={sceneStart} from={msToFrames(sceneStart - startMs, fps)} durationInFrames={msToFrames(durationMs, fps)}>
        <Scene withAudio={false} />
      </Sequence>)}
  </AbsoluteFill>;
};

export default Composition;
