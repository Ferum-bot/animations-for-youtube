import {SceneStage, useSceneTime, arrive, easing, progress} from '@channel/motion-v2';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {DecisionScene} from './DecisionScene';
import {LoadScene} from './LoadScene';
import {MessageScene} from './MessageScene';
import {QuoteScene} from './QuoteScene';
import {scene, timing as t} from './scene';
import {StorageScene} from './StorageScene';
import {WitnessScene} from './WitnessScene';

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const opacity = arrive(timeMs, 0, scene.entranceMs) * (1 - progress(timeMs,
    scene.exitStartMs, endMs, easing.transform));
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history-index" />
    <SceneStage transparent={false} opacity={opacity} label="История Cassandra: от сообщения к поисковому индексу">
      {timeMs < t.storage ? <WitnessScene timeMs={timeMs} /> : null}
      {timeMs >= t.storage && timeMs < t.decision ? <StorageScene timeMs={timeMs} /> : null}
      {timeMs >= t.decision && timeMs < t.example ? <DecisionScene timeMs={timeMs} /> : null}
      {timeMs >= t.example && timeMs < t.load ? <MessageScene timeMs={timeMs} /> : null}
      {timeMs >= t.load && timeMs < t.quote ? <LoadScene timeMs={timeMs} /> : null}
      {timeMs >= t.quote ? <QuoteScene timeMs={timeMs} /> : null}
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
