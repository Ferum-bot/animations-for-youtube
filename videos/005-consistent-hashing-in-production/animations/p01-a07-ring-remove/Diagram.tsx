import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {RangeArc, Ring, RingCursor} from '../../shared/theory/Ring';
import {baseTokens, shares, withoutD} from '../../shared/theory/model';
import {mix, progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

const after = shares(withoutD(baseTokens));
export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const remove = progress(timeMs, 3200);
  const route = progress(timeMs, 8200, 2400);
  const balance = progress(timeMs, 15600, 800);
  return (
    <>
      <Heading lines={['Один сосед', 'получает весь участок.']} />
      <g transform={'translate(140 70)'}>
        <Ring tokens={baseTokens} tokenOpacity={(token) => (token.owner === 'D' ? 1 - remove : 1)}>
          <RangeArc from={75} to={100} amount={route} />
          <RangeArc from={50} to={75} amount={route} color={theme.signal} />
          {route > 0 && route < 1 ? <RingCursor position={75 + 25 * route} /> : null}
        </Ring>
        <g opacity={1 - progress(timeMs, 15280, 250)}>
          <Mono x={704} y={733} size={52}>
            {timeMs < 3200 ? '4 ноды' : 'D · 75 → A · 0'}
          </Mono>
          <Mono x={704} y={794} size={29} color={theme.muted}>
            {timeMs < 3200 ? 'исходная схема без E' : 'меняется владелец диапазона'}
          </Mono>
        </g>
        <g opacity={balance}>
          {(['A', 'B', 'C'] as const).map((owner, i) => {
            const y = 652 + i * 100;
            const value = mix(25, after[owner], balance);
            return (
              <g key={owner}>
                <Mono x={502} y={y} size={30} anchor="start">
                  {owner}
                </Mono>
                <Mono x={902} y={y} size={30} anchor="end" color={owner === 'A' ? theme.signal : theme.text}>
                  {Math.round(value)}%
                </Mono>
                <path
                  d={`M502 ${y + 25} h${value * 8}`}
                  stroke={owner === 'A' ? theme.signal : theme.line}
                  strokeWidth={14}
                />
              </g>
            );
          })}
        </g>
      </g>
      <Annotation
        x={104}
        y={560}
        width={280}
        text={
          timeMs < 3200
            ? 'Возвращаемся к исходным четырём нодам'
            : timeMs < 18320
              ? 'Владелец A получает диапазон (50, 0]'
              : 'На A приходится половина данных'
        }
        detail={
          timeMs < 18320
            ? 'Показываем смену владельца, а не восстановление потерянных данных.'
            : 'При равномерных обращениях: вдвое больше трафика, чем у B или C.'
        }
        accent={timeMs >= 18320}
      />
    </>
  );
};
