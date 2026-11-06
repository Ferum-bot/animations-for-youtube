import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {IntroPreview, type IntroProps} from './Preview';
import {documents, scene} from './scene';
import {useEpisodeFont} from '../../shared/font';
import {SourceDocument} from './SourceDocument';

const Composition: React.FC<IntroProps> = (props) => {
  useEpisodeFont();
  const {fps} = useVideoConfig();
  const timeMs = scene.sourceStartMs + useCurrentFrame() * 1000 / fps;
  return <AbsoluteFill>
    <IntroPreview {...props} />
    {documents.map((document) => <SourceDocument
      key={document.source} document={document} timeMs={timeMs} />)}
  </AbsoluteFill>;
};

export default Composition;
