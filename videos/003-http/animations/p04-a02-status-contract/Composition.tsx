import React from 'react';
import {DiagramFrame, Message, Route, TimedCopy} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {cue, flightOpacity, statusScenes} from '../../shared/status/timing';
import {statusTheme as theme} from '../../shared/status/theme';
import {reveal, useTimeMs} from '../../shared/timing';
import {ClientServer} from './ClientServer';

const understand = cue('contract', 'p04-understand');
const failure = cue('contract', 'p04-retry-example');
const notify = cue('contract', 'p04-notify');
const pause = cue('contract', 'p04-pause');
const retry = cue('contract', 'p04-retry');

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const exampleMode = reveal(timeMs, failure, 350);
  const waited = reveal(timeMs, pause, retry - pause);
  return <NarratedHttpScene {...props} {...statusScenes.contract}>
    <HttpSceneHeading title="КОД → ДЕЙСТВИЕ" eyebrow="HTTP / ОБЩИЙ ЯЗЫК" />
    <DiagramFrame timeMs={timeMs} />
    <g opacity={reveal(timeMs, 350, 450)}>
      <ClientServer />
      <Route from={435} to={925} y={675} />
      <Route from={925} to={435} y={835} />
      <Message from={435} to={925} y={675} label="GET" progress={reveal(timeMs, 1400, 850)} opacity={flightOpacity(timeMs, 1400, 1100)} />
      <Message
        from={925}
        to={435}
        y={835}
        label="200"
        progress={reveal(timeMs, understand - 1300, 1000)}
        opacity={flightOpacity(timeMs, understand - 1300, 1350)} />
      <g opacity={reveal(timeMs, understand, 350) * (1 - exampleMode)}>
        <path d="M 435 900 V 982 H 545" stroke={theme.primary} strokeWidth={3} fill="none" />
        <text x={580} y={994} fontFamily={theme.fontMono} fontSize={35} fill={theme.primary}>2xx</text>
        <text x={700} y={994} fontSize={35} fill={theme.text}>Показать результат</text>
      </g>
      <Message from={435} to={925} y={675} label="GET" progress={reveal(timeMs, failure - 650, 650)} opacity={flightOpacity(timeMs, failure - 650, 750)} />
      <Message
        from={925}
        to={435}
        y={835}
        label="500"
        progress={reveal(timeMs, failure + 400, 1000)}
        opacity={flightOpacity(timeMs, failure + 400, 1600)} />
      <g opacity={reveal(timeMs, notify, 300)}>
        <path d="M 212 958 H 1180 V 1055 H 212 Z" fill={theme.surface} stroke={theme.line} strokeWidth={2} />
        <path d="M 212 958 V 1055" stroke={theme.danger} strokeWidth={5} />
        <text x={246} y={1018} fontSize={35} fill={theme.text}>Не удалось выполнить запрос</text>
      </g>
      <g opacity={reveal(timeMs, pause, 300)}>
        <path d="M 435 675 H 925" stroke={theme.background} strokeWidth={8} />
        <path d="M 435 675 H 925" stroke={theme.line} strokeWidth={2} />
        <path d={`M 435 675 H ${435 + waited * 490}`} stroke={theme.primary} strokeWidth={3} />
        <TimedCopy
          timeMs={timeMs}
          states={[
            {startMs: pause, text: 'Пауза перед повтором'},
            {startMs: retry, text: 'Повторный GET'},
          ]}
          x={470}
          y={760}
          fontSize={30} />
        <Message from={435} to={925} y={675} label="GET" progress={reveal(timeMs, retry, 750)} opacity={flightOpacity(timeMs, retry, 1100)} />
      </g>
      <TimedCopy
        timeMs={timeMs}
        states={[
          {startMs: 500, text: 'Разные реализации'},
          {startMs: understand, text: 'Общая семантика → понятное действие'},
          {startMs: failure, text: '500: ошибка выполнения запроса'},
          {startMs: pause, text: 'Повтор — по политике клиента'},
        ]}
        x={212}
        y={1200}
        fontSize={37} />
    </g>
  </NarratedHttpScene>;
};
export default Composition;
