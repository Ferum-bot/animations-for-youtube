import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

const timing = {add: 2060, remove: 13140, goal: 24220} as const;
export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const adding = timeMs >= timing.add;
  const removing = timeMs >= timing.remove;
  const goal = timeMs >= timing.goal;
  const before = removing ? 4 : 3;
  const after = removing ? 3 : 4;
  const reveal = adding ? progress(timeMs, removing ? timing.remove : timing.add, 700) : 0;
  return (
    <>
      <Heading
        lines={goal ? ['Задача: менять', 'меньше владельцев.'] : ['Изменили N.', 'Изменились адреса.']}
      />
      <Mono x={104} y={387} size={30} anchor="start" color={theme.muted}>
        {removing ? 'Убрали ноду: 4 → 3' : 'Добавили ноду: 3 → 4'}
      </Mono>
      <Mono x={104} y={486} size={68} anchor="start">
        7 % {before} = {7 % before}
      </Mono>
      <g opacity={reveal}>
        <Mono x={104} y={577} size={68} anchor="start" color={theme.signal}>
          7 % {after} = {7 % after}
        </Mono>
      </g>
      <Annotation
        x={730}
        y={366}
        width={560}
        text={
          goal
            ? 'Хотим сохранить владельцев остальных ключей'
            : adding
              ? '9 из 12 хешей получили другой адрес'
              : 'Пока N неизменно, правило работает'
        }
        detail={
          goal
            ? 'Consistent hashing уменьшает число изменений при смене состава.'
            : 'Здесь меняется назначение ключей. Сами данные ещё не перенесены.'
        }
        accent={!goal}
      />
      {[104, 744].map((x, group) => (
        <g key={x}>
          <Mono x={x} y={698} size={26} anchor="start" color={theme.muted}>
            hash
          </Mono>
          <Mono x={x + 276} y={698} size={26} color={theme.muted}>
            было
          </Mono>
          <Mono x={x + 476} y={698} size={26} color={theme.muted}>
            стало
          </Mono>
          {Array.from({length: 6}, (_, i) => {
            const h = group * 6 + i;
            const y = 767 + i * 83;
            const changed = h % before !== h % after;
            const color = changed && reveal > 0.5 ? theme.signal : theme.text;
            return (
              <g key={h}>
                <path d={`M${x} ${y - 42} h548`} stroke={theme.line} strokeWidth={1} />
                <Mono x={x} y={y} size={32} anchor="start" color={theme.muted}>
                  {h}
                </Mono>
                <Mono x={x + 276} y={y} size={38}>
                  {h % before}
                </Mono>
                <g opacity={reveal}>
                  <path
                    d={`M${x + 344} ${y - 12} h48 m-9 -6 l9 6 l-9 6`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                  />
                  <Mono x={x + 476} y={y} size={38} color={color}>
                    {h % after}
                  </Mono>
                </g>
              </g>
            );
          })}
        </g>
      ))}
    </>
  );
};
