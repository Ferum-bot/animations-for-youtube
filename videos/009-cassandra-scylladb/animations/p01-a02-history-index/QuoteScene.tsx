import React from 'react';
import {PodcastPage} from './PodcastPage';
import {timing as t, type SceneProps} from './scene';

export const QuoteScene: React.FC<SceneProps> = ({timeMs}) =>
  <PodcastPage timeMs={timeMs} startMs={t.quote} quote="cost" translateAtMs={t.translation} />;
