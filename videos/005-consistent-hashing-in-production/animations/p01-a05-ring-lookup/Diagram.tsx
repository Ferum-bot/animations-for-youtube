import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {RangeArc, Ring, RingCursor} from '../../shared/theory/Ring';
import {baseTokens, ringPoint} from '../../shared/theory/model';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const hashed = timeMs >= 12140;
  const travel = progress(timeMs, 15280, 3200);
  const p = ringPoint(60);
  return (
    <>
      <Heading lines={['Первая нода', 'по часовой стрелке.']} />
      <g transform={'translate(140 70)'}>
        <Ring tokens={baseTokens} highlight={(token) => token.owner === 'D' && travel === 1}>
          {hashed ? (
            <>
              <RangeArc from={60} to={75} amount={travel} />
              <RingCursor position={60 + 15 * travel} />
              <path d={`M${p.x} ${p.y - 10} l10 10 l-10 10 l-10 -10 Z`} fill={theme.primary} />
            </>
          ) : null}
        </Ring>
        <Mono x={704} y={700} size={hashed ? 74 : 38} color={theme.primary}>
          {hashed ? '60' : 'hash(user:105)'}
        </Mono>
        <Mono x={704} y={773} size={hashed ? 35 : 46}>
          {hashed ? (travel === 1 ? 'владелец: D · 75' : 'позиция ключа') : '% 100'}
        </Mono>
        <Mono x={704} y={837} size={27} color={theme.muted}>
          {travel === 1 ? 'запрос отправляется в D' : 'пространство 0…99'}
        </Mono>
      </g>
      <Annotation
        x={104}
        y={560}
        width={280}
        text={
          travel === 1
            ? 'Ключ 60 обслуживает нода в позиции 75'
            : hashed
              ? 'Начинаем с позиции ключа и идём по кольцу'
              : 'Сначала получаем позицию ключа'
        }
        detail="Число 100 задаёт размер кольца, а не количество нод."
      />
    </>
  );
};
