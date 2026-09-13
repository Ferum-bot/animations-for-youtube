import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {HttpPreviewBackground} from '../../shared/HttpStage';
import {methodScenes} from '../../shared/methods/timing';
import Catalog from '../p03-a01-method-catalog/Composition';
import Safe from '../p03-a02-safe-contract/Composition';
import PutPatch from '../p03-a03-put-patch/Composition';
import Cors from '../p03-a04-cors-preflight/Composition';
const scenes = [
  {...methodScenes.catalog, component: Catalog},
  {...methodScenes.safe, component: Safe},
  {...methodScenes.putPatch, component: PutPatch},
  {...methodScenes.cors, component: Cors}
] as const;
const Composition: React.FC = () => {
  const {fps} = useVideoConfig();
  const start = methodScenes.catalog.startMs;
  return <AbsoluteFill>
    <HttpPreviewBackground background="presenter" />
    <Audio src={staticFile('generated/003-http/audio.wav')} trimBefore={msToFrames(start, fps)} />
    {scenes.map(({component: Scene, startMs, durationMs}) => <Sequence key={startMs} from={msToFrames(startMs - start, fps)} durationInFrames={msToFrames(durationMs, fps)}>
      <Scene withAudio={false} />
    </Sequence>)}
  </AbsoluteFill>;
};
export default Composition;
