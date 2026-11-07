import {SceneStage, useSceneTime, arrive} from '@channel/motion-v2';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {IndexScene} from './IndexScene';
import {QuoteScene} from './QuoteScene';
import {ShardingScene} from './ShardingScene';
import {HBaseScene, PapersScene, SynthesisScene} from './PapersScene';
import {scene, timing as t} from './scene';

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const opacity = arrive(timeMs, 0, scene.entranceMs) *
    (1 - arrive(timeMs, scene.exitStartMs, endMs - scene.exitStartMs));
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history-consistency" />
    <SceneStage transparent={false} opacity={opacity} label="История Cassandra: восстановимый индекс и выбор хранилища">
      {timeMs < t.podcast ? <IndexScene timeMs={timeMs} /> : null}
      {timeMs >= t.podcast && timeMs < t.alternatives ? <QuoteScene timeMs={timeMs} /> : null}
      {timeMs >= t.alternatives && timeMs < t.papers ? <ShardingScene timeMs={timeMs} /> : null}
      {timeMs >= t.papers && timeMs < t.hbase ? <PapersScene timeMs={timeMs} /> : null}
      {timeMs >= t.hbase && timeMs < t.synthesis ? <HBaseScene timeMs={timeMs} /> : null}
      {timeMs >= t.synthesis ? <SynthesisScene timeMs={timeMs} /> : null}
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
