import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {Hosts, Ring} from '../../shared/theory/Ring';
import {baseTokens, owners, virtualTokens} from '../../shared/theory/model';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const split = progress(timeMs, 4300, 500);
  const selected =
    timeMs < 4300
      ? undefined
      : timeMs < 7300
        ? 'A'
        : timeMs < 10300
          ? 'B'
          : timeMs < 13300
            ? 'C'
            : timeMs < 16300
              ? 'D'
              : undefined;
  return (
    <>
      <Heading lines={['Один сервер.', 'Много точек на кольце.']} />
      <g transform={'translate(140 70)'}>
        <g opacity={1 - progress(timeMs, 4000, 200)}>
          <Ring tokens={baseTokens} />
        </g>
        <g opacity={split}>
          <Ring
            tokens={virtualTokens}
            virtual
            highlight={(token) => token.owner === selected}
            highlightColor={theme.primary}
            tokenOpacity={(token) =>
              progress(timeMs, 4300 + owners.findIndex((owner) => owner === token.owner) * 3000, 700)
            }
          />
        </g>
        <Mono x={704} y={718} size={56} color={theme.primary}>
          {split === 0 ? '4 сервера' : selected ? `сервер ${selected}` : '4 сервера'}
        </Mono>
        <Mono x={704} y={785} size={35}>
          {split === 0 ? '4 точки' : selected ? '5 виртуальных точек' : '20 виртуальных точек'}
        </Mono>
        <Mono x={704} y={845} size={26} color={theme.muted}>
          {split > 0 ? 'буква — сервер · число — позиция' : 'исходная учебная схема'}
        </Mono>
      </g>
      <Hosts active={owners} selected={selected} selectedColor={theme.primary} />
      <Annotation
        x={104}
        y={560}
        width={280}
        text={
          timeMs < 4200
            ? 'Начинаем новый пример с четырьмя серверами'
            : 'Виртуальная точка назначает диапазон физическому серверу'
        }
        detail={
          timeMs < 14500
            ? 'Несколько точек одной ноды отвечают за разные участки данных.'
            : 'Для читаемости используем учебную сетку с шагом 5.'
        }
      />
    </>
  );
};
