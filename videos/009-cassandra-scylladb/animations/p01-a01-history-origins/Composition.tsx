import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEpisodeFont} from '../../shared/font';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {AuthorsScene} from './AuthorsScene';
import {DocumentScene} from './DocumentScene';
import {InboxScene} from './InboxScene';
import {scene} from './scene';

const Composition: React.FC<PreviewProps> = (props) => {
  useEpisodeFont();
  const {fps} = useVideoConfig();
  const timeMs = scene.sourceStartMs + useCurrentFrame() * 1000 / fps;
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history" />
    <DocumentScene id="apache" timeMs={timeMs} />
    <AuthorsScene timeMs={timeMs} />
    <DocumentScene id="facebook" timeMs={timeMs} />
    <DocumentScene id="dynamo" timeMs={timeMs} />
    <InboxScene timeMs={timeMs} />
  </AbsoluteFill>;
};

export default Composition;
