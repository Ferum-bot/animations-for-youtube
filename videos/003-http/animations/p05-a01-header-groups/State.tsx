import React from 'react';
import {Label, Message, Route, TimedCopy} from '../../shared/HttpDiagram';
import {Caption, HeaderField, headerTheme as theme, type TimeProps} from '../../shared/headers/Elements';
import {cue, headerScenes} from '../../shared/headers/timing';
import {flightOpacity, reveal, shotOpacity} from '../../shared/timing';

const cookies = cue('groups', 'p05-cookies');
const cache = cue('groups', 'p05-cache');

export const CookieExchange: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, cookies, cache)}>
  <Label x={212} y={495}>03 / СОСТОЯНИЕ</Label>
  <text x={212} y={615} fontSize={46} fill={theme.text}>Браузер</text>
  <text x={965} y={615} fontSize={46} fill={theme.text}>Сервер</text>
  <Route from={1050} to={330} y={765} />
  <HeaderField name="Set-Cookie" value="theme=dark" x={410} y={714} opacity={reveal(timeMs, cookies + 250)} />
  <Message from={1050} to={330} y={765} label="theme=dark" width={230} progress={reveal(timeMs, cookies + 450, 750)} opacity={flightOpacity(timeMs, cookies + 450, 950)} />
  <g opacity={reveal(timeMs, cookies + 1250)}>
    <path d="M 247 825 H 412 V 905 H 247 Z M 271 851 H 386 M 271 878 H 355" stroke={theme.primary} fill={theme.surface} strokeWidth={2} />
    <text x={456} y={875} fontSize={31} fill={theme.muted}>Сохранено в браузере</text>
  </g>
  <g opacity={reveal(timeMs, cookies + 2400)}>
    <Route from={330} to={1050} y={1025} />
    <HeaderField name="Cookie" value="theme=dark" x={450} y={988} />
  </g>
  <Message from={330} to={1050} y={1025} label="theme=dark" width={230} progress={reveal(timeMs, cookies + 2700, 850)} opacity={flightOpacity(timeMs, cookies + 2700, 1050)} />
  <Caption opacity={reveal(timeMs, cookies + 3450)}>Значение возвращается в новом запросе</Caption>
</g>;

export const CacheLifecycle: React.FC<TimeProps> = ({timeMs}) => {
  const age = reveal(timeMs, cache + 4100, 3200);
  const checking = reveal(timeMs, cache + 8250);
  const confirmed = reveal(timeMs, cache + 11000);
  return <g opacity={shotOpacity(timeMs, cache, headerScenes.groups.durationMs + 330)}>
    <Label x={212} y={495}>04 / КЭШИРОВАНИЕ</Label>
    <HeaderField name="Cache-Control" value="max-age=60" y={576} accent />
    <HeaderField name="ETag" value={'"v7"'} y={645} opacity={reveal(timeMs, cache + 1550)} accent />
    <HeaderField name="Last-Modified" value="Sun, 13 Sep 2026 09:00:00 GMT" y={709} fontSize={27} opacity={reveal(timeMs, cache + 3000)} />
    <g transform="translate(212 800)">
      <path d="M 0 0 H 323 L 356 33 V 256 H 0 Z M 323 0 V 33 H 356" fill={theme.surface} stroke={confirmed > 0 ? theme.primary : theme.line} strokeWidth={2} />
      <text x={32} y={72} fontFamily={theme.fontMono} fontSize={31} fill={theme.text}>article / v7</text>
      <text x={32} y={134} fontSize={28} fill={theme.muted}>Локальная копия</text>
      <path d="M 32 198 H 324" stroke={theme.line} strokeWidth={5} />
      <path d={`M 32 198 H ${32 + 292 * (1 - age)}`} stroke={theme.primary} strokeWidth={5} />
      <text x={32} y={235} fontFamily={theme.fontMono} fontSize={21} fill={theme.muted}>max-age · время условно</text>
    </g>
    <g opacity={checking}>
      <text x={665} y={810} fontFamily={theme.fontMono} fontSize={26} fill={theme.text}>If-None-Match: "v7"</text>
      <Route from={660} to={1110} y={870} />
      <Route from={1110} to={660} y={1000} />
      <Message from={660} to={1110} y={870} label="GET" progress={reveal(timeMs, cache + 8450, 900)} opacity={flightOpacity(timeMs, cache + 8450, 1050)} />
      <Message from={1110} to={660} y={1000} label="304" progress={reveal(timeMs, cache + 9900, 900)} opacity={flightOpacity(timeMs, cache + 9900, 1050)} />
    </g>
    <text x={680} y={947} fontFamily={theme.fontMono} fontSize={35} fill={theme.primary} opacity={confirmed}>304 Not Modified</text>
    <TimedCopy timeMs={timeMs} states={[
      {startMs: cache + 500, text: 'Срок свежести и версия ресурса'},
      {startMs: cache + 4100, text: 'Свежую копию можно использовать'},
      {startMs: cache + 7800, text: 'Срок истёк → проверяем версию'},
      {startMs: cache + 11200, text: 'Не изменилось → используем копию'},
    ]} x={212} y={1200} fontSize={39} />
    <text x={212} y={1252} fontSize={27} fill={theme.muted} opacity={reveal(timeMs, cache + 12800)}>Механизм встроен в HTTP</text>
  </g>;
};
