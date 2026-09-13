import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {DiagramFrame, Label, TimedCopy} from '../../shared/HttpDiagram';
import {cue, methodScenes} from '../../shared/methods/timing';
import {httpTheme as theme} from '../../shared/theme';
import {reveal, useTimeMs} from '../../shared/timing';
const methods = [
  ['GET', 'Получить'],
  ['HEAD', 'Только заголовки'],
  ['POST', 'Обработать'],
  ['PUT', 'Заменить'],
  ['DELETE', 'Удалить'],
  ['CONNECT', 'Туннель'],
  ['OPTIONS', 'Возможности'],
  ['TRACE', 'Диагностика']
] as const;
const patchAt = cue('catalog', 'p03-patch');
const documentAt = cue('catalog', 'p03-document');
const partialAt = cue('catalog', 'p03-partial');
const standardAt = cue('catalog', 'p03-standard');
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const focus = reveal(timeMs, patchAt - 400, 650);
  const example = reveal(timeMs, partialAt - 600, 500);
  const catalogOpacity = 1 - reveal(timeMs, partialAt - 1000, 300);
  const changed = reveal(timeMs, partialAt + 500, 500);
  return <NarratedHttpScene {...props} {...methodScenes.catalog}>
    <HttpSceneHeading title="МЕТОДЫ HTTP" eyebrow="СЕМАНТИКА / ОСНОВНОЙ НАБОР" />
    <DiagramFrame timeMs={timeMs} />
    <g opacity={catalogOpacity}>
      <Label x={212} y={474}>RFC 9110</Label>
      {methods.map(([name, description], i) => {
        const x = 212 + (i % 2) * 530;
        const y = 580 + Math.floor(i / 2) * 150;
        return <g
          key={name}
          opacity={reveal(timeMs, 600 + Math.floor(i / 2) * 400, 350)}
          transform={`translate(${x} ${y - focus * Math.floor(i / 2) * 36})`}>
          <text fontFamily={theme.fontMono} fontWeight={600} fontSize={48 - focus * 10} fill={theme.text}>{name}</text>
          <text y={49} fontSize={29} fill={theme.muted} opacity={1 - focus}>{description}</text>
          <path d="M 0 70 H 440" stroke={theme.line} strokeWidth={1.5} />
        </g>;
      })}
    </g>
    <g opacity={focus * catalogOpacity}>
      <text x={212} y={1110} fontFamily={theme.fontMono} fontSize={68} fill={theme.primary}>PATCH</text>
      <path
        d="M 470 1085 H 625 M 613 1076 L 625 1085 L 613 1094"
        stroke={theme.line}
        strokeWidth={2}
        fill="none"
        opacity={reveal(timeMs, documentAt, 350)} />
      <text x={665} y={1096} fontSize={34} fontFamily={theme.fontMono} fill={theme.text} opacity={reveal(timeMs, documentAt, 350)}>RFC 5789</text>
      <text x={665} y={1150} fontSize={29} fill={theme.muted} opacity={reveal(timeMs, cue('catalog', 'p03-year'), 300)}>2010</text>
    </g>
    <g opacity={example}>
      <text x={212} y={516} fontFamily={theme.fontMono} fontSize={68} fill={theme.primary}>PATCH</text>
      <Label x={212} y={580}>RFC 5789 · 2010</Label>
      <Label x={212} y={716}>РЕСУРС / PROFILE</Label>
      <text x={212} y={792} fontFamily={theme.fontMono} fontSize={41} fill={theme.muted}>id: 42</text>
      <text x={212} y={872} fontFamily={theme.fontMono} fontSize={41} fill={theme.muted}>name: Anna</text>
      <path d="M 195 902 H 1175 V 980 H 195 Z" fill={theme.surface} />
      <text x={212} y={952} fontFamily={theme.fontMono} fontSize={41} fill={theme.text}>city:</text>
      <TimedCopy
        timeMs={timeMs}
        states={[{startMs: 0, text: 'Moscow'}, {startMs: partialAt + 500, text: 'Kazan'}]}
        x={390}
        y={952}
        fontSize={43} />
      <path d="M 1175 903 V 980" stroke={theme.primary} strokeWidth={5} opacity={changed} />
      <text x={212} y={1080} fontSize={32} fill={theme.muted}>Меняется выбранное поле</text>
    </g>
    <TimedCopy
      timeMs={timeMs}
      states={[{startMs: patchAt, text: 'Описан отдельным документом'}, {startMs: standardAt - 300, text: 'Стандартное расширение HTTP'}]}
      x={212}
      y={1220}
      fontSize={33} />
  </NarratedHttpScene>;
};
export default Composition;
