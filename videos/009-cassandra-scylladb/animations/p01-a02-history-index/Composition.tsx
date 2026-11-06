import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEpisodeFont} from '../../shared/font';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {arrive} from '../../shared/editorial-v2/motion';
import {chapterEasing, chapterProgress} from '../../shared/chapter-motion';
import {DecisionScene} from './DecisionScene';
import {illustrationTheme} from './Illustration';
import {LoadScene} from './LoadScene';
import {MessageScene} from './MessageScene';
import {QuoteScene} from './QuoteScene';
import {scene, timing as t} from './scene';
import {StorageScene} from './StorageScene';
import {WitnessScene} from './WitnessScene';

const Composition: React.FC<PreviewProps> = (props) => {
  useEpisodeFont();
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const opacity = arrive(timeMs, 0, scene.entranceMs) * (1 - chapterProgress(timeMs,
    scene.exitStartMs, scene.durationMs - 1000 / fps, chapterEasing.transform));
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history-index" />
    <AbsoluteFill style={{background: illustrationTheme.background, opacity}}>
      <svg width="100%" height="100%" viewBox="0 0 2560 1440" role="img"
        aria-label="История Cassandra: от сообщения к поисковому индексу"
        style={{fontFamily: illustrationTheme.fontSans, color: illustrationTheme.text, fill: illustrationTheme.text}}>
        {timeMs < t.storage ? <WitnessScene timeMs={timeMs} /> : null}
        {timeMs >= t.storage && timeMs < t.decision ? <StorageScene timeMs={timeMs} /> : null}
        {timeMs >= t.decision && timeMs < t.example ? <DecisionScene timeMs={timeMs} /> : null}
        {timeMs >= t.example && timeMs < t.load ? <MessageScene timeMs={timeMs} /> : null}
        {timeMs >= t.load && timeMs < t.quote ? <LoadScene timeMs={timeMs} /> : null}
        {timeMs >= t.quote ? <QuoteScene timeMs={timeMs} /> : null}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>;
};
export default Composition;
