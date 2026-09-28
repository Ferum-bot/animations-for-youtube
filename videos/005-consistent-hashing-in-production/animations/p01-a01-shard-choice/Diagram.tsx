import React from 'react';
import {Heading, Annotation, Mono} from '../../shared/theory/Typography';
import {Shard} from '../../shared/theory/Shard';
import {mix, progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

const timing = {load: 6560, split: 12180, question: 18900} as const;
const users = [
  {key: '081', shard: 0},
  {key: '042', shard: 1},
  {key: '105', shard: 2},
] as const;
const source = {x: 872, y: 600, width: 424, height: 334};
const destinations = [390, 690, 990] as const;

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const split = progress(timeMs, timing.split, 1700);
  const shell = progress(timeMs, timing.split + 1750, 300);
  const load = timeMs >= timing.load;
  const question = timeMs >= timing.question;
  return (
    <>
      <Heading
        lines={
          question ? ['Данные разделили.', 'Куда отправить запрос?'] : ['Один сервис.', 'Несколько хранилищ.']
        }
      />
      <g opacity={progress(timeMs, 400)}>
        <Mono x={269} y={460} size={34} color={theme.muted}>
          клиенты
        </Mono>
        <path d="M269 494 V640" stroke={theme.line} strokeWidth={3} />
        {load ? (
          <Mono x={320} y={560} size={26} anchor="start" color={theme.primary}>
            больше запросов
          </Mono>
        ) : null}
        <rect
          x={104}
          y={640}
          width={330}
          height={132}
          fill={theme.surface}
          stroke={theme.line}
          strokeWidth={2}
        />
        <Mono x={269} y={720} size={40}>
          сервис
        </Mono>
        <path d="M434 706 H730" fill="none" stroke={theme.line} strokeWidth={3} />
        {destinations.map((y) => {
          const port = mix(706, y + 105, split);
          return (
            <path key={y} d={`M730 706 V${port} H872`} fill="none" stroke={theme.line} strokeWidth={3} />
          );
        })}
        <Shard {...source} label="база данных" opacity={1 - progress(timeMs, timing.split, 250)} />
        {destinations.map((y, i) => (
          <Shard
            key={y}
            x={source.x}
            y={y}
            width={source.width}
            height={210}
            label={`шард ${i}`}
            opacity={shell}
          />
        ))}
        {users.map(({key, shard}, i) => {
          const targetY = destinations[shard] + 133;
          const y = mix(source.y + 130 + i * 70, targetY, progress(timeMs, timing.split + 300, 1400));
          return (
            <g key={key} opacity={progress(timeMs, 1200 + i * 140)}>
              <Mono
                x={source.x + 32}
                y={y}
                anchor="start"
                size={35}
                color={key === '042' ? theme.primary : theme.text}
              >
                user:{key}
              </Mono>
            </g>
          );
        })}
        {[900, 3200, 5500, 7100, 7900, 8700, 9500, 10300].map((start) => (
          <path
            key={start}
            d={`M269 ${494 + 130 * progress(timeMs, start, 650)} v14`}
            stroke={theme.primary}
            strokeWidth={6}
            opacity={progress(timeMs, start, 80) * (1 - progress(timeMs, start + 570, 80))}
          />
        ))}
        {question ? (
          <g opacity={progress(timeMs, timing.question)}>
            <circle cx={730} cy={706} r={27} fill={theme.background} stroke={theme.signal} strokeWidth={2} />
            <Mono x={730} y={718} size={35} color={theme.signal}>
              ?
            </Mono>
          </g>
        ) : null}
      </g>
      <Annotation
        x={104}
        y={920}
        width={490}
        text={
          question
            ? 'Нужно одно правило для чтения и записи'
            : split > 0
              ? 'Каждый шард хранит свою часть данных'
              : 'Клиенты создают нагрузку на один сервис'
        }
        detail={
          question
            ? 'Один и тот же ключ должен приводить к одному владельцу.'
            : 'Шардирование — разделение данных между хранилищами.'
        }
      />
    </>
  );
};
