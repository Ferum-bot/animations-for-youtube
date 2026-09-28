import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

const tasks = [
  {at: 8540, label: 'Состояние кластера', detail: 'кто доступен и какая топология актуальна'},
  {at: 11900, label: 'Физический перенос', detail: 'как скопировать данные под нагрузкой'},
  {at: 14080, label: 'Согласованность', detail: 'как не потерять и не раздвоить изменения'},
] as const;
export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => (
  <>
    <Heading lines={['Кольцо выбирает', 'владельца ключа.']} />
    <g opacity={progress(timeMs, 500)}>
      <Mono x={270} y={580} size={46}>
        ключ
      </Mono>
      <path d="M390 565 H595 M805 565 H920" fill="none" stroke={theme.primary} strokeWidth={3} />
      <circle cx={700} cy={565} r={65} fill="none" stroke={theme.primary} strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={700 + Math.sin((i * Math.PI) / 2) * 65}
          cy={565 - Math.cos((i * Math.PI) / 2) * 65}
          r={7}
          fill={theme.text}
        />
      ))}
      <Mono x={1090} y={580} size={43}>
        владелец
      </Mono>
      <Mono x={704} y={656} size={26} color={theme.muted}>
        результат алгоритма размещения
      </Mono>
    </g>
    <g opacity={progress(timeMs, 7900)}>
      <Mono x={104} y={774} size={26} anchor="start" color={theme.signal}>
        ВНЕ АЛГОРИТМА РАЗМЕЩЕНИЯ
      </Mono>
    </g>
    {tasks.map(({at, label, detail}, i) => (
      <g
        key={label}
        opacity={progress(timeMs, at, 400)}
        transform={`translate(0 ${10 * (1 - progress(timeMs, at, 400))})`}
      >
        <text x={104} y={846 + i * 116} fontSize={38} fill={theme.signal}>
          {label}
        </text>
        <text x={104} y={890 + i * 116} fontSize={28} fill={theme.muted}>
          {detail}
        </text>
      </g>
    ))}
    <Annotation
      x={104}
      y={320}
      width={1204}
      text="Алгоритм размещения — одна часть работающего кластера"
      detail="Дальше проверим всю систему на реальном сервисе."
    />
  </>
);
