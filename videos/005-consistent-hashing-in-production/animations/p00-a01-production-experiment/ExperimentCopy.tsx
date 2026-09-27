import React from 'react';
import {hashingTheme as theme} from '../../shared/theme';
import {diagramPoint, geometry, progress, timing, type ExperimentState} from './state';

const headingStates = [
  {start: 0, end: timing.cluster, lines: ['Проверим', 'на практике.']},
  {start: timing.cluster, end: timing.question, lines: ['Один сервис.', 'Теперь — кластер.']},
  {start: timing.question, end: Infinity, lines: ['Что будет', 'с данными?']},
] as const;

const copyOpacity = (time: number, start: number, end: number): number =>
  progress(time, start, 360) * (Number.isFinite(end) ? 1 - progress(time, end - 260, 220) : 1);

export const ExperimentCopy: React.FC<{readonly state: ExperimentState}> = ({state}) => {
  const {timeMs, partition, live, question} = state;
  const inlet = diagramPoint(geometry.inletX, geometry.inletTop);
  const caption = timeMs < timing.cluster ? 'Один экземпляр сервиса'
    : timeMs < timing.load ? 'Разные пользователи — разные ноды'
      : timeMs < timing.question ? 'Меняем состав под нагрузкой'
        : 'Запросы продолжают приходить';
  const captionStart = timeMs < timing.cluster ? 900
    : timeMs < timing.load ? timing.cluster + 1750
      : timeMs < timing.question ? timing.load : timing.question + 700;
  return <>
    <text x={104} y={151} fontFamily={theme.fontMono} fontSize={26} letterSpacing={1.4} fill={theme.muted}>
      CONSISTENT HASHING
    </text>
    {headingStates.map(({start, end, lines}) => (
      <g key={start} opacity={copyOpacity(timeMs, start, end)}
        transform={`translate(0 ${12 * (1 - progress(timeMs, start, 500))})`}>
        {lines.map((line, index) => <text key={line} x={104} y={223 + index * 88}
          fontSize={78} fontWeight={650} letterSpacing={-1.6}
          fill={index === 1 ? theme.primary : theme.text}>{line}</text>)}
      </g>
    ))}
    <text x={inlet.x} y={inlet.y - 32} textAnchor="middle" fontFamily={theme.fontMono} fontSize={36}
      fill={theme.muted} opacity={live}>
      {timeMs < timing.load ? 'запрос' : 'запросы'}
    </text>
    <g opacity={progress(timeMs, captionStart, 420)}>
      <path d="M104 1218 H172" stroke={question > 0 ? theme.signal : theme.primary} strokeWidth={3} />
      <text x={104} y={1276} fill={theme.text} fontSize={36}>{caption}</text>
    </g>
    <text x={104} y={1336} fill={theme.muted} fontSize={30}
      opacity={progress(timeMs, timing.service + 600, 450) * (1 - partition)}>
      Пользователь и его кошельки — вместе
    </text>
  </>;
};
