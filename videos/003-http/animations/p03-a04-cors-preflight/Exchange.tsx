import React from 'react';
import {Label, Route, Message, TimedCopy} from '../../shared/HttpDiagram';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';
import {corsCues as cues, flightVisibility} from './model';
/** One non-credentialed cross-origin JSON PATCH, with an explicitly required preflight. */
export const Exchange: React.FC<{
  timeMs: number;
}> = ({timeMs}) => {
  const returned = cues.methods;
  const sent = cues.allowedOrigin + 800;
  const answered = sent + 1000;
  const cacheMode = reveal(timeMs, cues.cache - 400, 350);
  const requestDetails = 1 - reveal(timeMs, cues.methods - 500, 350);
  const responseDetails = reveal(timeMs, cues.methods - 100, 350) * (1 - reveal(timeMs, cues.middleware - 600, 350));
  const handlerMode = reveal(timeMs, cues.middleware - 250, 350) * (1 - reveal(timeMs, cues.cache - 650, 350));
  return <g opacity={reveal(timeMs, cues.policy, 450)}>
    <Label x={212} y={474}>БРАУЗЕР</Label>
    <Label x={1020} y={474}>API</Label>
    <path d="M 190 497 V 879 H 605 V 497" fill={theme.surface} fillOpacity={0.35} stroke={theme.line} strokeWidth={2} />
    <g opacity={reveal(timeMs, cues.origins, 400)}>
      <text x={212} y={535} fontFamily={theme.fontMono} fontSize={25} fill={theme.primary}>https://site.example</text>
      <text x={800} y={535} fontFamily={theme.fontMono} fontSize={25} fill={theme.text}>https://api.example</text>
    </g>
    <Route from={350} to={1060} y={645} />
    <Route from={1060} to={350} y={750} />
    <g opacity={1 - cacheMode}>
      <Message
        from={350}
        to={1060}
        y={645}
        progress={reveal(timeMs, cues.explain, 1000)}
        label="OPTIONS"
        width={200}
        opacity={flightVisibility(timeMs, cues.explain, 1500) ? 1 : 0} />
      <Message
        from={1060}
        to={350}
        y={750}
        progress={reveal(timeMs, returned, 850)}
        label="204"
        opacity={flightVisibility(timeMs, returned, 1250) ? 1 : 0} />
      <Message
        from={350}
        to={1060}
        y={645}
        progress={reveal(timeMs, sent, 800)}
        label="PATCH"
        opacity={flightVisibility(timeMs, sent, 1000) ? 1 : 0} />
      <Message
        from={1060}
        to={350}
        y={750}
        progress={reveal(timeMs, answered, 800)}
        label="200 OK"
        opacity={flightVisibility(timeMs, answered, 1050) ? 1 : 0} />
    </g>
    <TimedCopy
      timeMs={timeMs}
      states={[

        {startMs: cues.policy, text: 'Проверку выполняет браузер'},

        {startMs: cues.origin, text: 'CORS: доступ страницы к ответу API'},

        {startMs: cues.origins, text: 'Сайт и API имеют разные origin'},

        {startMs: cues.explain, text: '1. Проверка разрешения'},

        {startMs: sent, text: '2. Основной PATCH → ответ с Allow-Origin'},

        {startMs: cues.middleware, text: 'Где формируется ответ на OPTIONS'},

        {startMs: cues.cache, text: 'Разрешение сохранено в браузере'},

        {startMs: cues.repeat, text: 'Подходящий PATCH идёт без нового OPTIONS'},

        {startMs: cues.expire, text: 'Срок истёк → новый preflight'},

      ]}
      x={212}
      y={846}
      fontSize={28} />
    <g opacity={reveal(timeMs, cues.origin, 350) * requestDetails}>
      <TimedCopy
        timeMs={timeMs}
        states={[

          {startMs: cues.origin, text: 'Не каждый cross-origin запрос требует preflight'},

          {startMs: cues.csrf, text: 'CORS не заменяет защиту от CSRF'},

          {startMs: cues.explain - 350, text: 'Пример: cross-origin PATCH с JSON'},

        ]}
        x={212}
        y={965}
        fontSize={29} />
      <g opacity={reveal(timeMs, cues.explain, 350)} fontFamily={theme.fontMono} fontSize={26} fill={theme.text}>
        <text x={212} y={1040}>Origin: https://site.example</text>
        <text x={212} y={1100}>Access-Control-Request-Method: PATCH</text>
        <text x={212} y={1160}>Access-Control-Request-Headers: content-type</text>
      </g>
    </g>
    <g opacity={responseDetails}>
      <Label x={212} y={961}>ОТВЕТ НА PREFLIGHT</Label>
      <g fontFamily={theme.fontMono} fontSize={27} fill={theme.text}>
        <text x={212} y={1040} opacity={reveal(timeMs, cues.methods, 250)}>Access-Control-Allow-Methods: PATCH</text>
        <text x={212} y={1100} opacity={reveal(timeMs, cues.allowedOrigin, 250)}>Access-Control-Allow-Origin: https://site.example</text>
        <text x={212} y={1160} opacity={reveal(timeMs, cues.allowedOrigin + 250, 250)}>Access-Control-Allow-Headers: content-type</text>
      </g>
    </g>
    <g opacity={handlerMode}>
      <TimedCopy
        timeMs={timeMs}
        states={[{startMs: cues.middleware, text: 'CORS middleware'}, {startMs: cues.handler, text: 'Свой OPTIONS-обработчик'}]}
        x={212}
        y={1000}
        fontSize={47} />
      <path d="M 212 1040 V 1080 H 285" stroke={theme.primary} strokeWidth={3} fill="none" />
      <text x={310} y={1091} fontSize={34} fill={theme.text}>Ответ с CORS-заголовками</text>
    </g>
    <g opacity={cacheMode}>
      <Label x={212} y={960}>КЭШ РЕЗУЛЬТАТОВ PREFLIGHT</Label>
      <text x={212} y={1038} fontFamily={theme.fontMono} fontSize={34} fill={theme.primary}>Access-Control-Max-Age</text>
      <text x={212} y={1103} fontSize={30} fill={theme.text}>Origin + метод + заголовки</text>
      <text x={212} y={1163} fontSize={27} fill={theme.muted}>Срок ограничивается браузером</text>
      <Message
        from={350}
        to={1060}
        y={645}
        progress={reveal(timeMs, cues.repeat, 800)}
        label="PATCH"
        opacity={flightVisibility(timeMs, cues.repeat, 1050) ? 1 : 0} />
      <Message
        from={1060}
        to={350}
        y={750}
        progress={reveal(timeMs, cues.repeat + 850, 700)}
        label="200 OK"
        opacity={flightVisibility(timeMs, cues.repeat + 850, 850) ? 1 : 0} />
      <Message
        from={350}
        to={1060}
        y={645}
        progress={reveal(timeMs, cues.expire, 900)}
        label="OPTIONS"
        width={200}
        opacity={reveal(timeMs, cues.expire, 200)} />
      <path d="M 212 1196 H 1140" stroke={theme.line} strokeWidth={3} />
      <path
        d={`M 212 1196 H ${212 + 928 * (1 - reveal(timeMs, cues.repeat - 200, cues.expire - cues.repeat + 200))}`}
        stroke={theme.primary}
        strokeWidth={4} />
    </g>
  </g>;
};
