import React from 'react';
import {Label, TimedCopy} from '../../shared/HttpDiagram';
import {Caption, DepthPlate, HeaderField, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {chunkedWire, displayWire} from '../../shared/framing/content';
import {cue} from '../../shared/framing/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const priority = cue('choice', 'p06-priority');
const choice = cue('choice', 'p06-choice');
const known = cue('choice', 'p06-known');
const parts = cue('choice', 'p06-parts');
const cell = 34;
const wireX = 212;
const lengthEnd = wireX + 11 * cell;
const chunkedEnd = wireX + chunkedWire.length * cell;

export const ConflictingLengths: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, 0, choice)}>
  <Label x={212} y={495}>ПРИМЕР КОНФЛИКТНОГО СООБЩЕНИЯ</Label>
  <HeaderField name="Content-Length" value="11" y={593} fontSize={39} />
  <HeaderField name="Transfer-Encoding" value="chunked" y={667} fontSize={39} accent />
  <g opacity={reveal(timeMs, 1000)}>
    <text x={212} y={756} fontSize={26} fill={theme.muted}>Байты после заголовков · ␍␊ = CRLF</text>
    {Array.from(displayWire(chunkedWire)).map((char, index) => <g key={index} transform={`translate(${wireX + index * cell} 807)`}>
      <path d={`M 0 0 H ${cell - 2} V 56 H 0 Z`} fill={theme.surface} stroke={theme.line} />
      <text x={(cell - 2) / 2} y={37} textAnchor="middle" fontFamily={theme.fontMono} fontSize={24} fill={theme.text}>{char}</text>
    </g>)}
    <g opacity={reveal(timeMs, 1600)}>
      <path d={`M ${wireX} 892 H ${lengthEnd} V 786 M ${lengthEnd - 9} 795 L ${lengthEnd} 786 L ${lengthEnd + 9} 795`} stroke={theme.caution} strokeWidth={2} fill="none" />
      <text x={212} y={946} fontFamily={theme.fontMono} fontSize={28} fill={theme.caution}>По Content-Length: 11 байт</text>
    </g>
    <g opacity={reveal(timeMs, 2650)}>
      <path d={`M ${wireX} 992 H ${chunkedEnd} V 786 M ${chunkedEnd - 9} 795 L ${chunkedEnd} 786 L ${chunkedEnd + 9} 795`} stroke={theme.primary} strokeWidth={2} fill="none" />
      <text x={212} y={1046} fontFamily={theme.fontMono} fontSize={28} fill={theme.primary}>По chunked: до 0␍␊␍␊</text>
    </g>
  </g>
  <TimedCopy timeMs={timeMs} states={[
    {startMs: 450, text: 'Разные правила дают разные границы'},
    {startMs: priority, text: 'Приоритет ≠ разрешение сочетать'},
    {startMs: priority + 2700, text: 'Такое сообщение следует отклонить'},
  ]} x={212} y={1200} fontSize={38} />
  <text x={212} y={1252} fontSize={26} fill={theme.muted} opacity={reveal(timeMs, priority)}>Отправлять Transfer-Encoding вместе с Content-Length нельзя</text>
</g>;

export const ChooseFraming: React.FC<TimeProps> = ({timeMs}) => {
  const counted = Math.min(11, Math.floor(reveal(timeMs, known + 450, 2300) * 11));
  const streamed = reveal(timeMs, parts + 450, 1700);
  return <g opacity={reveal(timeMs, choice)}>
    <Label x={212} y={495}>ДВА РАЗОБРАННЫХ СПОСОБА</Label>
    <DepthPlate x={212} y={582} width={935} height={215} depth={0.4} selected={timeMs >= known && timeMs < parts}>
      <text x={30} y={50} fontSize={32} fill={theme.text}>Размер известен</text>
      <HeaderField name="Content-Length" value="11" x={30} y={115} fontSize={34} accent />
      <text x={719} y={116} fontFamily={theme.fontMono} fontSize={48} fill={theme.primary}>{String(counted).padStart(2, '0')}/11</text>
      <path d="M 30 164 H 905" stroke={theme.line} strokeWidth={5} />
      <path d={`M 30 164 H ${30 + 875 * counted / 11}`} stroke={theme.primary} strokeWidth={5} />
      <text x={30} y={201} fontSize={24} fill={theme.muted}>Точное число байтов тела</text>
    </DepthPlate>
    <DepthPlate x={212} y={869} width={935} height={215} depth={0.4} selected={timeMs >= parts}>
      <text x={30} y={50} fontSize={32} fill={theme.text}>Размер пока неизвестен</text>
      <HeaderField name="Transfer-Encoding" value="chunked" x={30} y={112} fontSize={34} accent />
      <path d="M 30 165 H 905" stroke={theme.line} strokeWidth={2} />
      {[{label: '5 · Hello', x: 30}, {label: '6 ·world', x: 352}, {label: '0', x: 834}].map(({label, x}, index) => <g key={label} opacity={reveal(timeMs, parts + index * 720)}>
        <path d={`M ${x} 138 H ${x + (index === 2 ? 70 : 200)} V 189 H ${x} Z`} stroke={theme.primary} fill={theme.surface} strokeWidth={2} />
        <text x={x + 18} y={174} fontFamily={theme.fontMono} fontSize={27} fill={theme.text}>{label}</text>
      </g>)}
    </DepthPlate>
    <Caption detail={streamed > 0.99 ? 'Оба способа определяют границу тела' : 'Выбор зависит от того, известна ли длина'} opacity={reveal(timeMs, choice + 600)}>Отмерить длину / прочитать чанки</Caption>
  </g>;
};
