import React from 'react';
import {arrive, presence} from '../../shared/editorial-v2/motion';
import {MessageIcon, Pocket, Slip} from './Illustration';
import {PodcastPage} from './PodcastPage';
import {timing as t, type SceneProps} from './scene';

export const DecisionScene: React.FC<SceneProps> = ({timeMs}) => {
  if (timeMs >= t.sourcePage) return <PodcastPage timeMs={timeMs} startMs={t.sourcePage} endMs={t.example} quote="cost" entry="cover" />;
  return <g opacity={presence(timeMs, t.decision, t.sourcePage)}>
    <Pocket x={410} y={530} scale={1.4} label="MySQL">
      <MessageIcon x={60} y={25} scale={0.9} />
    </Pocket>
    <g opacity={arrive(timeMs, t.question)}>
      <text x={1260} y={670} fontSize={110}>+</text>
      <Slip x={1510} y={550} width={670} word="завтра" />
      <text x={1835} y={830} textAnchor="middle" fontSize={74}>
        {timeMs < t.possible ? '?' : 'Можно'}
      </text>
    </g>
  </g>;
};
