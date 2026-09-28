import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {Ring} from '../../shared/theory/Ring';
import {baseTokens} from '../../shared/theory/model';
import {mix, progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';
import {scalePoints} from './geometry';

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const close = progress(timeMs, 8520, 2100);
  const nodes = progress(timeMs, 13940, 500);
  const points = scalePoints(close);
  const start = points[0];
  const end = points[100];
  const copy = 1 - progress(timeMs, 8250, 200) + progress(timeMs, 10700, 400);
  return (
    <>
      <Heading lines={['Числовая шкала', 'замыкается в кольцо.']} />
      <g transform={`translate(${140 * close} 70)`}>
        <g opacity={1 - nodes}>
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={theme.line}
            strokeWidth={4}
          />
          {start ? (
            <Mono x={start.x - 28 * (1 - close)} y={start.y + mix(12, -43, close)} size={36}>
              0
            </Mono>
          ) : null}
          {end ? (
            <g opacity={1 - progress(timeMs, 8800, 700)}>
              <Mono x={end.x} y={end.y + 68} size={32} anchor="end">
                {timeMs < 4080 ? 'max' : timeMs < 8520 ? '2³² − 1' : '99'}
              </Mono>
            </g>
          ) : null}
        </g>
        <g opacity={nodes}>
          <Ring tokens={baseTokens} tokenOpacity={(_, i) => progress(timeMs, 13940 + i * 620, 500)} />
        </g>
        <g opacity={copy}>
          <Mono x={704} y={timeMs < 10700 ? 610 : 730} size={timeMs < 8520 ? 52 : 72} color={theme.primary}>
            {timeMs < 4080 ? 'hash(key)' : timeMs < 8520 ? '0 … 2³² − 1' : '0 … 99'}
          </Mono>
          <Mono x={704} y={timeMs < 10700 ? 675 : 798} size={30} color={theme.muted}>
            {timeMs < 4080
              ? 'значение из конечного диапазона'
              : timeMs < 8520
                ? 'пример 32-битного пространства'
                : '100 позиций в учебном примере'}
          </Mono>
        </g>
      </g>
      <g opacity={1 - progress(timeMs, 8000, 300)}>
        <Annotation
          x={104}
          y={350}
          width={1100}
          text="После последней позиции снова идёт нулевая"
          detail="Размер хеш-пространства не зависит от числа серверов."
        />
      </g>
      <g opacity={progress(timeMs, 11000, 400)}>
        <Annotation
          x={104}
          y={560}
          width={280}
          text={
            timeMs < 13940
              ? 'После последней позиции снова идёт нулевая'
              : 'Каждая нода получает позицию на кольце'
          }
          detail={
            timeMs < 13940
              ? 'Размер хеш-пространства не зависит от числа серверов.'
              : 'Для наглядности: A · 0, B · 25, C · 50, D · 75.'
          }
        />
      </g>
    </>
  );
};
