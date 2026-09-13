import React from 'react';
import {Label, TimedCopy} from '../../shared/HttpDiagram';
import {Caption, DrawPath, HeaderField, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {BoundaryBracket, ByteRibbon, sampleBodyBytes} from '../../shared/framing/ByteRibbon';
import {cue, framingScenes} from '../../shared/framing/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const body = cue('boundary', 'p06-body');
const stream = cue('boundary', 'p06-stream');
const parser = cue('boundary', 'p06-parser');
const length = cue('boundary', 'p06-length');
const measure = cue('boundary', 'p06-measure');

export const OpenMessage: React.FC<TimeProps> = ({timeMs}) => {
  const growth = reveal(timeMs, body, 4200);
  return <g opacity={shotOpacity(timeMs, 0, stream)}>
    <Label x={212} y={495}>НАЧАЛО УЖЕ ПРОЧИТАНО</Label>
    <text x={212} y={613} fontFamily={theme.fontMono} fontSize={40} fill={theme.text}>POST /upload HTTP/1.1</text>
    <g opacity={reveal(timeMs, 2900)}>
      <HeaderField name="Host" value="api.example" y={686} fontSize={32} />
      <text x={212} y={744} fontFamily={theme.fontMono} fontSize={28} fill={theme.muted}>… остальные заголовки</text>
    </g>
    <g opacity={reveal(timeMs, body)}>
      <path d="M 212 799 H 1150" stroke={theme.line} strokeWidth={2} />
      <text x={212} y={840} fontSize={26} fill={theme.muted}>Пустая строка → начало тела</text>
      <ByteRibbon y={904} visibleCount={Math.min(11, 3 + Math.floor(growth * 9))} cellWidth={76} />
      <BoundaryBracket x={197} y={890} side="left" />
      <BoundaryBracket x={464 + growth * 630} y={890} uncertain />
      <text x={1130} y={973} fontSize={55} fill={theme.primary}>?</text>
    </g>
    <Caption opacity={reveal(timeMs, cue('boundary', 'p06-question'))}>Начало видно. А где конец?</Caption>
  </g>;
};

export const ByteStream: React.FC<TimeProps> = ({timeMs}) => {
  const depth = reveal(timeMs, stream + 450, 1000) * (1 - reveal(timeMs, parser + 2300, 950));
  const position = reveal(timeMs, parser, 2000);
  return <g opacity={shotOpacity(timeMs, stream, length)}>
    <Label x={212} y={495}>В ОСНОВЕ — ПОТОК БАЙТОВ</Label>
    <text x={212} y={618} fontSize={47} fill={theme.text}>TCP передаёт непрерывный поток</text>
    <g opacity={reveal(timeMs, stream + 600)}>
      <path d="M 212 803 H 1152 M 212 1000 H 1152" stroke={theme.line} strokeWidth={2} />
      <ByteRibbon y={877} depth={depth} />
      <text x={1130} y={935} fontFamily={theme.fontMono} fontSize={34} fill={theme.muted}>…</text>
    </g>
    <g opacity={reveal(timeMs, parser)}>
      <text x={212} y={729} fontFamily={theme.fontMono} fontSize={31} fill={theme.primary}>HTTP / разбор сообщения</text>
      <g transform={`translate(${234 + position * 833} 0)`}>
        <path d="M -30 820 V 1015 M 30 820 V 1015 M -30 820 H 30 M -30 1015 H 30" stroke={theme.primary} strokeWidth={2} fill="none" />
      </g>
    </g>
    <Caption detail="Границы HTTP-сообщений задаёт сам HTTP" opacity={reveal(timeMs, parser + 2600)}>Поток байтов → разбор по правилам</Caption>
  </g>;
};

export const ExactLength: React.FC<TimeProps> = ({timeMs}) => {
  const progress = reveal(timeMs, measure, 3900);
  const received = Math.min(sampleBodyBytes, Math.floor(progress * sampleBodyBytes));
  const complete = received === sampleBodyBytes;
  return <g opacity={shotOpacity(timeMs, length, framingScenes.boundary.durationMs + 330)}>
    <Label x={212} y={495}>01 / РАЗМЕР ИЗВЕСТЕН ЗАРАНЕЕ</Label>
    <HeaderField name="Content-Length" value="11" y={627} fontSize={52} accent />
    <DrawPath d="M 743 657 V 715 H 1108 V 774" timeMs={timeMs} startMs={length + 1600} />
    <text x={212} y={737} fontSize={30} fill={theme.muted}>Тело: Hello world · ASCII</text>
    <ByteRibbon y={817} received={received} />
    <BoundaryBracket x={197} y={802} height={120} side="left" />
    <BoundaryBracket x={1108} y={802} height={120} opacity={reveal(timeMs, length + 2000)} />
    <g opacity={reveal(timeMs, measure)}>
      <text x={212} y={1070} fontFamily={theme.fontMono} fontSize={92} fill={theme.primary}>{String(received).padStart(2, '0')}</text>
      <text x={352} y={1070} fontFamily={theme.fontMono} fontSize={42} fill={theme.muted}>/ 11 байт</text>
      <text x={740} y={1063} fontSize={37} fill={theme.text}>{complete ? 'Тело прочитано' : 'Читаем тело'}</text>
    </g>
    <TimedCopy timeMs={timeMs} states={[
      {startMs: length + 500, text: 'Точная длина тела в байтах'},
      {startMs: measure + 4150, text: '11 байт → граница определена'},
    ]} x={212} y={1200} fontSize={39} />
    <text x={212} y={1252} fontSize={27} fill={theme.muted}>Заголовки в это число не входят</text>
  </g>;
};
