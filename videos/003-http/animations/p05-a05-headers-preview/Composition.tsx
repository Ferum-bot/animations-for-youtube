import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {HttpPreviewBackground} from '../../shared/HttpStage';
import {headerScenes} from '../../shared/headers/timing';
import Groups from '../p05-a01-header-groups/Composition';
import Host from '../p05-a02-host-routing/Composition';
import Trust from '../p05-a03-header-trust/Composition';
import Upgrade from '../p05-a04-protocol-upgrade/Composition';

const scenes = [
  {...headerScenes.groups, component: Groups},
  {...headerScenes.host, component: Host},
  {...headerScenes.trust, component: Trust},
  {...headerScenes.upgrade, component: Upgrade},
] as const;

const Composition: React.FC = () => {
  const {fps} = useVideoConfig();
  const startMs = headerScenes.groups.startMs;
  return <AbsoluteFill>
    <HttpPreviewBackground background="presenter" />
    <Audio src={staticFile('generated/003-http/audio.wav')} trimBefore={msToFrames(startMs, fps)} />
    {scenes.map(({component: Scene, startMs: sceneStart, durationMs}) => <Sequence
      key={sceneStart} from={msToFrames(sceneStart - startMs, fps)}
      durationInFrames={msToFrames(sceneStart + durationMs - startMs, fps) - msToFrames(sceneStart - startMs, fps)}>
      <Scene withAudio={false} />
    </Sequence>)}
  </AbsoluteFill>;
};
export default Composition;
