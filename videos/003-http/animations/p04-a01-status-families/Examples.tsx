import React from 'react';
import {Label, Message, Route} from '../../shared/HttpDiagram';
import {StatusMark} from '../../shared/status/StatusMark';
import {cue, flightOpacity, shotOpacity} from '../../shared/status/timing';
import {statusTheme as theme} from '../../shared/status/theme';
import {reveal} from '../../shared/timing';

const information = cue('families', 'p04-informational');
const success = cue('families', 'p04-success');
const redirect = cue('families', 'p04-redirect');
const cache = cue('families', 'p04-cache');
const clientError = cue('families', 'p04-client-error');

export const BasicResponses: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  <g opacity={shotOpacity(timeMs, information, success)}>
    <Label x={570} y={535}>ПРОМЕЖУТОЧНЫЙ ОТВЕТ</Label>
    <StatusMark code="100" label="Continue" />
    <Route from={1110} to={635} y={985} />
    <Message
      from={1110}
      to={635}
      y={985}
      label="100"
      progress={reveal(timeMs, information + 500, 900)}
      opacity={flightOpacity(timeMs, information + 500, 1700)} />
    <text x={570} y={1100} fontSize={32} fill={theme.text}>Обмен продолжается</text>
  </g>
  <g opacity={shotOpacity(timeMs, success, redirect)}>
    <Label x={570} y={535}>УСПЕШНЫЙ ОТВЕТ</Label>
    <StatusMark code="200" label="OK" />
    <Route from={635} to={1110} y={945} />
    <Route from={1110} to={635} y={1045} />
    <Message from={635} to={1110} y={945} label="GET" progress={reveal(timeMs, success + 350, 700)} opacity={flightOpacity(timeMs, success + 350, 900)} />
    <Message
      from={1110}
      to={635}
      y={1045}
      label="200 OK"
      progress={reveal(timeMs, success + 1300, 800)}
      opacity={flightOpacity(timeMs, success + 1300, 1250)} />
    <text x={570} y={1150} fontSize={32} fill={theme.text}>Запрос выполнен</text>
  </g>
</>;

export const RedirectAndCache: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  <g opacity={shotOpacity(timeMs, redirect, cache)}>
    <Label x={570} y={535}>НОВЫЙ АДРЕС</Label>
    <StatusMark code="301" label="Moved Permanently" y={735} />
    <text x={570} y={920} fontFamily={theme.fontMono} fontSize={31} fill={theme.primary}>Location: /new</text>
    <text x={570} y={1030} fontFamily={theme.fontMono} fontSize={34} fill={theme.muted}>/old</text>
    <path
      d="M 690 1018 C 825 1018 785 1118 955 1118 H 980"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - reveal(timeMs, redirect + 1100, 900)}
      stroke={theme.primary}
      strokeWidth={3}
      fill="none" />
    <g opacity={reveal(timeMs, redirect + 1900, 300)}>
      <path d="M 966 1108 L 980 1118 L 966 1128" stroke={theme.primary} strokeWidth={3} fill="none" />
      <text x={1000} y={1130} fontFamily={theme.fontMono} fontSize={34} fill={theme.text}>/new</text>
      <text x={770} y={1060} fontFamily={theme.fontMono} fontSize={25} fill={theme.text}>GET</text>
    </g>
  </g>
  <g opacity={shotOpacity(timeMs, cache, clientError)}>
    <Label x={570} y={535}>ПРОВЕРКА СОХРАНЁННОЙ КОПИИ</Label>
    <StatusMark code="304" label="Not Modified" y={735} />
    <text x={570} y={880} fontFamily={theme.fontMono} fontSize={24} fill={theme.muted}>GET · If-None-Match: "v7"</text>
    <g transform={`translate(0 ${20 * (1 - reveal(timeMs, cache + 2700, 500))})`}>
      <path d="M 570 1000 H 1155 V 1140 H 570 Z" fill={theme.surface} stroke={theme.line} strokeWidth={2} />
      <text x={600} y={1052} fontFamily={theme.fontMono} fontSize={30} fill={theme.text}>document / v7</text>
      <text x={600} y={1110} fontSize={30} fill={theme.primary} opacity={reveal(timeMs, cache + 2700, 400)}>Копия актуальна</text>
    </g>
    <Message from={660} to={1080} y={935} label="GET" progress={reveal(timeMs, cache + 450, 700)} opacity={flightOpacity(timeMs, cache + 450, 900)} />
    <Message from={1080} to={660} y={935} label="304" progress={reveal(timeMs, cache + 1600, 800)} opacity={flightOpacity(timeMs, cache + 1600, 1050)} />
    <text x={570} y={1220} fontSize={29} fill={theme.text}>Тело повторно не передаётся</text>
  </g>
</>;
