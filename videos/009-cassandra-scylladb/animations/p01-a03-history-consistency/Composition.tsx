import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEpisodeFont} from '../../shared/font';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {arrive} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme} from '../../shared/editorial-v2/illustration';
import {IndexScene} from './IndexScene';
import {QuoteScene} from './QuoteScene';
import {ShardingScene} from './ShardingScene';
import {HBaseScene, PapersScene, SynthesisScene} from './PapersScene';
import {scene, timing as t} from './scene';

const Composition: React.FC<PreviewProps> = (props) => {
  useEpisodeFont();
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const opacity = arrive(timeMs, 0, scene.entranceMs) *
    (1 - arrive(timeMs, scene.exitStartMs, scene.durationMs - 1000 / fps - scene.exitStartMs));
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history-consistency" />
    <AbsoluteFill style={{background: theme.background, opacity}}>
      <svg width="100%" height="100%" viewBox="0 0 2560 1440" role="img"
        aria-label="История Cassandra: восстановимый индекс и выбор хранилища"
        style={{fontFamily: theme.fontSans, fill: theme.text, overflow: 'hidden'}}>
        {timeMs < t.podcast ? <IndexScene timeMs={timeMs} /> : null}
        {timeMs >= t.podcast && timeMs < t.alternatives ? <QuoteScene timeMs={timeMs} /> : null}
        {timeMs >= t.alternatives && timeMs < t.papers ? <ShardingScene timeMs={timeMs} /> : null}
        {timeMs >= t.papers && timeMs < t.hbase ? <PapersScene timeMs={timeMs} /> : null}
        {timeMs >= t.hbase && timeMs < t.synthesis ? <HBaseScene timeMs={timeMs} /> : null}
        {timeMs >= t.synthesis ? <SynthesisScene timeMs={timeMs} /> : null}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export default Composition;
