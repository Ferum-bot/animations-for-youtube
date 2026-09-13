import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {HttpPreviewBackground} from '../../shared/HttpStage';
import {statusScenes} from '../../shared/status/timing';
import Families from '../p04-a01-status-families/Composition';
import Contract from '../p04-a02-status-contract/Composition';
import Infrastructure from '../p04-a03-status-infrastructure/Composition';

const scenes = [
  {...statusScenes.families, component: Families},
  {...statusScenes.contract, component: Contract},
  {...statusScenes.infrastructure, component: Infrastructure},
] as const;

const Composition: React.FC = () => {
  const {fps} = useVideoConfig();
  const startMs = statusScenes.families.startMs;
  return <AbsoluteFill>
    <HttpPreviewBackground background="presenter" />
    <Audio src={staticFile('generated/003-http/audio.wav')} trimBefore={msToFrames(startMs, fps)} />
    {scenes.map(({component: Scene, startMs: sceneStart, durationMs}) => <Sequence key={sceneStart} from={msToFrames(sceneStart - startMs, fps)} durationInFrames={msToFrames(durationMs, fps)}>
      <Scene withAudio={false} />
    </Sequence>)}
  </AbsoluteFill>;
};
export default Composition;
