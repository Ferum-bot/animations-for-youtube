import {arrive, presence, MessageIcon, Pocket, Slip} from '@channel/motion-v2';
import React from 'react';
import {timing as t, type SceneProps} from './scene';

export const StorageScene: React.FC<SceneProps> = ({timeMs}) => <g opacity={presence(timeMs, t.storage, t.decision)}>
  {[0, 1, 2].map((i) => <Pocket key={i} x={220 + i * 520} y={710} scale={0.9} label="MySQL">
    <MessageIcon x={70} y={58} scale={0.9} />
  </Pocket>)}
  <g opacity={arrive(timeMs, t.index)}>
    <text x={1770} y={405} fontSize={54} fontWeight={600}>Поисковый индекс</text>
    {['завтра', 'офиса', 'встретимся', 'возле'].map((word, i) =>
      <g key={word} opacity={arrive(timeMs, (i < 2 ? t.index : t.growth) + i % 2 * 500)}>
        <Slip x={1730} y={500 + i * 145} width={650} word={word} />
      </g>)}
  </g>
</g>;
