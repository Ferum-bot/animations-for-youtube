import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import type {ThemeId} from '@channel/theme';
import {PreviewBackground, type IntroBackground} from '../../shared/intro/PreviewBackground';
import {getPostgresTheme} from '../../shared/theme';
import {Claim} from './Claim';
import {ArticleReferences, VideoReference} from './References';

export type IntroProps = {
  readonly themeId?: ThemeId;
  readonly previewBackground?: IntroBackground;
  readonly withAudio?: boolean;
};

const Composition: React.FC<IntroProps> = ({themeId = 'graphite',
  previewBackground = 'transparent', withAudio = false}) => {
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const theme = getPostgresTheme(themeId);
  return <AbsoluteFill>
    <PreviewBackground mode={previewBackground} />
    {withAudio ? <Audio src={staticFile('generated/007-just-use-postgres/p01-a01-intro.wav')} /> : null}
    <Claim timeMs={timeMs} theme={theme} />
    <ArticleReferences timeMs={timeMs} theme={theme} />
    <VideoReference timeMs={timeMs} theme={theme} />
  </AbsoluteFill>;
};
export default Composition;
