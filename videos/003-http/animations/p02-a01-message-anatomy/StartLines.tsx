import React from 'react';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';
import {cues} from './timing';

type LinePart = {readonly value: string; readonly label: string; readonly x: number; readonly width: number; readonly cueMs: number; readonly note?: string};
const request: readonly LinePart[] = [
  {value: 'POST', label: 'Метод', x: 0, width: 210, cueMs: cues.method},
  {value: '/items', label: 'Цель запроса', x: 270, width: 315, cueMs: cues.target},
  {value: 'HTTP/1.1', label: 'Версия', x: 640, width: 400, cueMs: cues.requestVersion},
];
const response: readonly LinePart[] = [
  {value: 'HTTP/1.1', label: 'Версия', x: 0, width: 420, cueMs: cues.responseVersion},
  {value: '200', label: 'Код состояния', x: 490, width: 225, cueMs: cues.status},
  {value: 'OK', label: 'Пояснение', x: 815, width: 195, cueMs: cues.reason, note: 'необязательно'},
];

const Parts: React.FC<{parts: readonly LinePart[]; timeMs: number; labelsOpacity?: number}> = ({parts, timeMs, labelsOpacity = 1}) => <>
  {parts.map((part) => {
    const emphasis = reveal(timeMs, part.cueMs, 260);
    return <g key={part.value} transform={`translate(${part.x} 0)`}>
      <text y={0} fontFamily={theme.fontMono} fontSize={68} fill={emphasis > 0.5 ? theme.primary : theme.text}>{part.value}</text>
      <g opacity={emphasis * labelsOpacity}>
        <path d={`M 0 35 H ${part.width} M 0 35 V 49`} stroke={theme.primary} strokeWidth={2} fill="none" />
        <text y={95} fontSize={29} fill={theme.text}>{part.label}</text>
        {part.note ? <text y={141} fontSize={24} fill={theme.muted}>{part.note}</text> : null}
      </g>
    </g>;
  })}
</>;

/** The request row persists while the camera isolates it, then makes room for the response. */
export const StartLines: React.FC<{timeMs: number}> = ({timeMs}) => {
  const isolate = reveal(timeMs, cues.isolate, 750);
  const compare = reveal(timeMs, cues.response - 250, 550);
  const initial = 1 - reveal(timeMs, cues.isolate - 280, 280);
  const scale = 0.68 + isolate * 0.32 - compare * 0.12;
  const y = 528 + isolate * 165 - compare * 170;
  return <>
    <g transform={`translate(212 ${y}) scale(${scale})`}>
      <Parts parts={request} timeMs={timeMs} labelsOpacity={1 - compare * 0.35} />
    </g>
    <g opacity={reveal(timeMs, cues.isolate + 450, 300)}>
      <text x={212} y={448} fontFamily={theme.fontMono} fontSize={28} letterSpacing={2} fill={theme.muted}>ЗАПРОС</text>
    </g>
    <g opacity={reveal(timeMs, cues.response, 400)}>
      <path d="M 212 775 H 1230" stroke={theme.line} strokeWidth={2} />
      <text x={212} y={853} fontFamily={theme.fontMono} fontSize={28} letterSpacing={2} fill={theme.muted}>ОТВЕТ</text>
      <g transform={`translate(212 ${960 + (1 - compare) * 22})`}><Parts parts={response} timeMs={timeMs} /></g>
    </g>
    <g opacity={reveal(timeMs, cues.isolate + 600, 300) * (1 - compare)} transform="translate(212 1010)">
      {[0, 24, 48].map((dy) => <path key={dy} d={`M 0 ${dy} H 135`} stroke={theme.line} strokeWidth={3} />)}
      <path d="M 0 88 H 88" stroke={theme.line} strokeWidth={3} />
      <text x={190} y={36} fontSize={29} fill={theme.muted}>Остальная структура сообщения</text>
    </g>
    <text x={212} y={467} fontSize={25} letterSpacing={1.5} fill={theme.primary} opacity={initial * reveal(timeMs, cues.startLine, 280)}>СТАРТОВАЯ СТРОКА</text>
  </>;
};
