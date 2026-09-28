import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {Shard} from '../../shared/theory/Shard';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const hash = progress(timeMs, 1400);
  const modulo = progress(timeMs, 4200);
  const route = progress(timeMs, 7200, 900);
  return (
    <>
      <Heading lines={['Один ключ.', 'Один и тот же шард.']} />
      <Mono x={104} y={488} size={40} anchor="start">
        user:042
      </Mono>
      <g opacity={hash}>
        <path d="M345 474 H550" stroke={theme.line} strokeWidth={3} />
        <Mono x={446} y={442} size={26} color={theme.muted}>
          hash(key)
        </Mono>
        <Mono x={620} y={488} size={56} color={theme.primary}>
          7
        </Mono>
      </g>
      <g opacity={modulo}>
        <Mono x={104} y={744} size={94} anchor="start">
          7 % 3 = <tspan fill={theme.primary}>1</tspan>
        </Mono>
        <Annotation
          x={104}
          y={815}
          width={525}
          text={
            timeMs < 11000
              ? 'Остаток от деления выбирает номер шарда'
              : 'Повторный запрос идёт по тому же маршруту'
          }
          detail="7 — пример хеша; N = 3 — число шардов."
        />
      </g>
      {[0, 1, 2].map((i) => (
        <Shard
          key={i}
          x={920}
          y={390 + i * 300}
          width={376}
          height={210}
          label={`шард ${i}`}
          selected={i === 1 && route > 0.5}
        >
          <Mono x={1108} y={528 + i * 300} size={35} color={i === 1 ? theme.primary : theme.muted}>
            {i === 1 && route > 0.5 ? 'user:042' : '—'}
          </Mono>
        </Shard>
      ))}
      <path
        d="M692 716 H806 V795 H920"
        fill="none"
        stroke={theme.primary}
        strokeWidth={4}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - route}
        opacity={modulo}
      />
    </>
  );
};
