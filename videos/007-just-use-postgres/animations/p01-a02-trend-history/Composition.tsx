import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {PreviewBackground, type IntroBackground} from '../../shared/intro/PreviewBackground';
import {History} from './History';
import {scene} from './scene';

type Props = {
  readonly previewBackground?: IntroBackground;
  readonly withAudio?: boolean;
};

const Composition: React.FC<Props> = ({previewBackground = 'transparent', withAudio = false}) => {
  const {fps} = useVideoConfig();
  const timeMs = scene.sourceStartMs + useCurrentFrame() * 1000 / fps;
  return <AbsoluteFill>
    <PreviewBackground mode={previewBackground} />
    {withAudio ? <Audio src={staticFile('generated/007-just-use-postgres/p01-a02-history.wav')} /> : null}
    <History timeMs={timeMs} />
  </AbsoluteFill>;
};
export default Composition;
