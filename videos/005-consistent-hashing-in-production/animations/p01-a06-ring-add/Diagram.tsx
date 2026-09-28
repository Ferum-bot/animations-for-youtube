import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {RangeArc, Ring} from '../../shared/theory/Ring';
import {addedToken, baseTokens} from '../../shared/theory/model';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const add = progress(timeMs, 4600, 750);
  const range = progress(timeMs, 6940, 1400);
  const resolved = timeMs >= 13220;
  return (
    <>
      <Heading lines={['Новый владелец', 'только у части ключей.']} />
      <g transform={'translate(140 70)'}>
        <Ring
          tokens={[...baseTokens, addedToken]}
          highlight={(token) => token.owner === 'E'}
          tokenOpacity={(token) => (token.owner === 'E' ? add : 1)}
        >
          <RangeArc from={50} to={60} amount={range} color={theme.signal} />
        </Ring>
        <g opacity={range}>
          <Mono x={704} y={707} size={resolved ? 80 : 48} color={theme.signal}>
            {resolved ? '10%' : '(50, 60]'}
          </Mono>
          <Mono x={704} y={779} size={32}>
            {resolved ? 'хеш-пространства' : 'D → E'}
          </Mono>
          <Mono x={704} y={840} size={29} color={theme.muted}>
            {resolved ? '90% не меняет владельца' : 'ключи 51…60'}
          </Mono>
        </g>
      </g>
      <Annotation
        x={104}
        y={560}
        width={280}
        text={range > 0 ? 'Только диапазон (50, 60] назначается новой ноде' : 'Добавляем E в позицию 60'}
        detail="Карта определяет новый адрес. Физический перенос — отдельная работа."
        accent
      />
    </>
  );
};
