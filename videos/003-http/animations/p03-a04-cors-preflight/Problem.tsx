import React from 'react';
import {Label, Route, Message, TimedCopy} from '../../shared/HttpDiagram';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';
import {corsCues as cues, flightVisibility} from './model';
export const Problem: React.FC<{
  timeMs: number;
}> = ({timeMs}) => {
  const setup = reveal(timeMs, cues.browser - 1200, 500);
  return <g opacity={1 - reveal(timeMs, cues.policy - 500, 350)}>
    <g opacity={1 - reveal(timeMs, cues.browser - 1800, 400)}>
      <Label x={212} y={520}>БРАУЗЕР / API</Label>
      <text x={212} y={780} fontFamily={theme.fontMono} fontSize={142} fill={theme.primary} opacity={reveal(timeMs, cues.options - 150, 300)}>OPTIONS</text>
      <text x={212} y={948} fontSize={35} fill={theme.text}>Откуда появился этот запрос?</text>
    </g>
    <g opacity={setup}>
      <Label x={212} y={490}>БРАУЗЕР</Label>
      <Label x={1060} y={490}>API</Label>
      <Route y={600} />
      <Route y={681} from={1020} to={350} />
      <Message y={600} label="OPTIONS" width={200} progress={reveal(timeMs, cues.preflight, 850)} opacity={reveal(timeMs, cues.preflight, 200)} />
      <Message
        y={681}
        label="Ответ"
        progress={reveal(timeMs, cues.preflight + 950, 650)}
        opacity={flightVisibility(timeMs, cues.preflight + 950, 1000) ? 1 : 0} />
      <Message from={350} to={350} y={795} progress={0} width={240} label="PATCH /profile" />
      <TimedCopy
        timeMs={timeMs}
        states={[
          {startMs: cues.browser, text: 'Основной запрос ждёт'},
          {startMs: cues.preflight + 1750, text: 'Preflight не разрешил PATCH'},
          {startMs: cues.missing, text: 'Основной PATCH не отправлен'}
        ]}
        x={535}
        y={805}
        fontSize={29} />
      <path d="M 212 883 H 1180" stroke={theme.line} strokeWidth={2} />
      <g opacity={reveal(timeMs, cues.curl - 500, 350)}>
        <Label x={212} y={945}>CURL / POSTMAN</Label>
        <Label x={1060} y={945}>API</Label>
        <Route y={1025} />
        <Route y={1110} from={1020} to={350} />
        <Message y={1025} progress={reveal(timeMs, cues.curl, 700)} label="PATCH" opacity={reveal(timeMs, cues.curl, 200)} />
        <Message
          y={1110}
          from={1020}
          to={350}
          progress={reveal(timeMs, cues.curl + 800, 650)}
          label="200 OK"
          opacity={reveal(timeMs, cues.curl + 800, 200)} />
      </g>
      <TimedCopy
        timeMs={timeMs}
        states={[{startMs: cues.missing, text: 'В журнале сервера: OPTIONS есть, PATCH нет'}]}
        x={212}
        y={1230}
        fontSize={30} />
    </g>
  </g>;
};
