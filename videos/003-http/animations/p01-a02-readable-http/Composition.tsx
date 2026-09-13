import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {HttpCode, requestLines, responseLines} from '../../shared/HttpCode';
import {MessageBrackets} from '../../shared/MessageBrackets';
import {partOneScenes, readableCues as cues} from '../../shared/partOneTiming';
import {httpTheme as theme} from '../../shared/theme';
import {reveal, useTimeMs} from '../../shared/timing';

const requestLength = requestLines.reduce((length, line) => length + line.length + 1, 0);
const benefits = ['Легко внедрить', 'Легко прочитать', 'Легко разрабатывать'] as const;

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const terminal = reveal(timeMs, cues.manual, 650);
  const readingTitle = 1 - reveal(timeMs, cues.manual, 260);
  const writingTitle = reveal(timeMs, cues.manual + 300, 350);
  const mail = reveal(timeMs, cues.mail - 1_000, 450);
  const typed = Math.floor(requestLength * Math.min(1, Math.max(0, (timeMs - cues.type) / 1_100)));
  const response = reveal(timeMs, cues.response, 300);
  const markerY = (1 - terminal) * (180 + mail * 84) + terminal * (170 + response * 288);
  return <NarratedHttpScene {...props} {...partOneScenes.readable}>
    <g opacity={readingTitle}><HttpSceneHeading title="МОЖНО ПРОЧИТАТЬ" eyebrow="HTTP/1.1 / ТЕКСТОВЫЙ ФОРМАТ" /></g>
    <g opacity={writingTitle}><HttpSceneHeading title="МОЖНО НАПИСАТЬ" eyebrow="HTTP/1.1 / ЗАПРОС ВРУЧНУЮ" /></g>
    <MessageBrackets x={136} y={400} width={1120} height={800} markerY={markerY} arm={80} opacity={reveal(timeMs, 0, 350)} />
    <g opacity={(1 - terminal) * reveal(timeMs, 600, 500)}>
      <text x={215} y={488} fontSize={27} fontFamily={theme.fontMono} fill={theme.muted}>ЗАПРОС</text>
      <HttpCode lines={requestLines} x={215} y={592} fontSize={51} lineHeight={84} activeLine={mail > 0.5 ? 1 : 0} />
      <path d="M 215 885 H 1170" stroke={theme.line} strokeWidth={2} opacity={mail} />
      <g opacity={mail} transform={`translate(0 ${(1 - mail) * 14})`}>
        <text x={215} y={950} fontFamily={theme.fontMono} fontSize={26} fill={theme.muted}>ПОХОЖАЯ ЗАПИСЬ В ПОЧТЕ</text>
        <text x={215} y={1023} fontFamily={theme.fontMono} fontSize={43} fill={theme.text}>Subject<tspan fill={theme.primary}>:</tspan> Hello</text>
        <text x={215} y={1120} fontSize={32} fill={theme.muted}>Имя поля<tspan fill={theme.primary}> : </tspan>значение</text>
      </g>
    </g>
    <g opacity={terminal}>
      <text x={215} y={480} fontFamily={theme.fontMono} fontSize={31} fill={theme.primary} opacity={reveal(timeMs, cues.telnet - 500, 350)}>$ telnet localhost 8080</text>
      <HttpCode lines={requestLines} x={215} y={587} fontSize={44} lineHeight={66} visibleCharacters={typed} activeLine={0} />
      <g opacity={reveal(timeMs, cues.type + 1_100, 120) * (1 - response)}>
        <rect x={215} y={769} width={18} height={31} fill={theme.primary} />
        <text x={252} y={795} fontSize={26} fill={theme.muted}>Пустая строка — отправить запрос</text>
      </g>
      <g opacity={response} transform={`translate(0 ${(1 - response) * 12})`}>
        <path d="M 215 800 H 1170" stroke={theme.line} strokeWidth={2} />
        <HttpCode lines={responseLines} x={215} y={877} fontSize={42} lineHeight={68} activeLine={0} />
      </g>
    </g>
    {benefits.map((text, index) => <g key={text} opacity={reveal(timeMs, cues.benefits[index] ?? 0, 280)}>
      <path d={`M ${136 + index * 382} 1260 V 1290 H ${166 + index * 382}`} fill="none" stroke={theme.primary} strokeWidth={3} />
      <text x={181 + index * 382} y={1280} fontSize={26} fill={theme.text}>{text}</text>
    </g>)}
  </NarratedHttpScene>;
};

export default Composition;
