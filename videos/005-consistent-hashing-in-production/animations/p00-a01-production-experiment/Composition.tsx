import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fadeEnvelope, msToFrames} from '@channel/motion-core';
import {HashingStage, type PreviewBackground} from '../../shared/HashingStage';
import video from '../../video.json';
import {ExperimentDiagram} from './ExperimentDiagram';
import {ExperimentCopy} from './ExperimentCopy';
import {sampleExperiment, scene} from './state';

type Props = {
  readonly withAudio?: boolean;
  readonly previewBackground?: PreviewBackground;
};

const Composition: React.FC<Props> = ({withAudio = false, previewBackground = 'transparent'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const state = sampleExperiment(frame * 1000 / fps);
  const durationInFrames = msToFrames(scene.durationMs, fps);
  const opacity = fadeEnvelope({frame, durationInFrames, enterFrames: 10, exitFrames: 15});
  return <>
    {withAudio && video.audio ? <Audio src={staticFile(video.audio)}
      trimBefore={msToFrames(scene.startMs, fps)} trimAfter={msToFrames(scene.startMs, fps) + durationInFrames} /> : null}
    <HashingStage opacity={opacity} previewBackground={previewBackground}>
      <ExperimentCopy state={state} />
      <ExperimentDiagram state={state} />
    </HashingStage>
  </>;
};

export default Composition;
