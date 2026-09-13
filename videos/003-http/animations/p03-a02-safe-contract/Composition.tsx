import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {DiagramFrame, Label, Route, Message, TimedCopy} from '../../shared/HttpDiagram';
import {cue, methodScenes} from '../../shared/methods/timing';
import {httpTheme as theme} from '../../shared/theme';
import {reveal, useTimeMs} from '../../shared/timing';
const read = cue('safe', 'p03-read'), retry = cue('safe', 'p03-retry'), crawler = cue('safe', 'p03-crawler');
const contract = cue('safe', 'p03-contract'), bad = cue('safe', 'p03-bad-get');
const balance = cue('safe', 'p03-balance'), second = cue('safe', 'p03-second-bad-get');
const exchanges = [read, retry, crawler + 1000, crawler + 2400, crawler + 3800, balance - 900, second - 900] as const;
const flash = (timeMs: number, start: number, duration: number): number => reveal(timeMs, start, 180) * (1 - reveal(timeMs, start + duration, 180));
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const misuse = reveal(timeMs, bad, 400);
  const balanceValue = timeMs >= second ? 800 : timeMs >= balance ? 900 : 1000;
  return <NarratedHttpScene {...props} {...methodScenes.safe}>
    <g opacity={1 - reveal(timeMs, contract, 240)}>
      <HttpSceneHeading title="БЕЗОПАСНЫЕ МЕТОДЫ" eyebrow="HTTP / ОЖИДАЕМОЕ ПОВЕДЕНИЕ" fontSize={64} />
    </g>
    <g opacity={reveal(timeMs, contract + 280, 300)}>
      <HttpSceneHeading title="GET МОЖНО СЛОМАТЬ" eyebrow="HTTP / НАРУШЕНИЕ СЕМАНТИКИ" fontSize={64} />
    </g>
    <DiagramFrame timeMs={timeMs} />
    {['GET', 'HEAD', 'OPTIONS', 'TRACE'].map((name, i) => <text
      key={name}
      x={212 + i * 260}
      y={510}
      fontFamily={theme.fontMono}
      fontSize={43}
      fill={name === 'GET' ? theme.primary : theme.text}
      opacity={reveal(timeMs, 500 + i * 150, 300) * (name === 'GET' ? 1 : 1 - misuse * 0.85)}>{name}</text>)}
    <g opacity={reveal(timeMs, read - 650, 500)}>
      <TimedCopy
        timeMs={timeMs}
        states={[{startMs: 0, text: 'Клиент'}, {startMs: crawler, text: 'Поисковый робот'}, {startMs: contract, text: 'Клиент'}]}
        x={212}
        y={659}
        fontSize={33} />
      <text x={966} y={659} fontSize={33} fill={theme.text}>Сервер</text>
      <Route y={739} />
      <Route y={829} from={1020} to={350} />
      {exchanges.map((at, i) => <g key={at}>
        <Message y={739} progress={reveal(timeMs, at, 700)} label="GET" opacity={flash(timeMs, at, 850)} />
        {i < 5 ? <Message y={829} from={1020} to={350} progress={reveal(timeMs, at + 850, 650)} label="Данные" opacity={flash(timeMs, at + 850, 750)} /> : null}
      </g>)}
      <Label x={805} y={942}>РЕСУРС</Label>
      <text x={805} y={1000} fontFamily={theme.fontMono} fontSize={29} fill={theme.muted}>balance</text>
      <text x={805} y={1090} fontFamily={theme.fontMono} fontSize={78} fill={theme.primary}>{balanceValue}</text>
      <path d="M 785 964 V 1120 H 1180" stroke={theme.line} strokeWidth={2} fill="none" />
      <g opacity={reveal(timeMs, crawler, 400) * (1 - reveal(timeMs, contract - 350, 300))}>
        <Label x={212} y={943}>ИНДЕКС</Label>
        {['/', '/articles', '/about'].map((page, i) => <g key={page} opacity={reveal(timeMs, crawler + 2400 + i * 1400, 250)}>
          <path d={`M 212 ${990 + i * 56} h 18`} stroke={theme.primary} strokeWidth={3} />
          <text x={250} y={1000 + i * 56} fontFamily={theme.fontMono} fontSize={28} fill={theme.text}>{page}</text>
        </g>)}
      </g>
      <g opacity={reveal(timeMs, contract, 350)}>
        <TimedCopy
          timeMs={timeMs}
          states={[{startMs: contract, text: 'Метод задаёт ожидания'}, {startMs: bad, text: 'Обработчик меняет данные'}]}
          x={212}
          y={1000}
          fontSize={30} />
        <TimedCopy
          timeMs={timeMs}
          states={[{startMs: balance, text: 'Первый GET: −100'}, {startMs: second, text: 'Повторный GET: ещё −100'}]}
          x={212}
          y={1070}
          fontSize={28} />
      </g>
    </g>
    <TimedCopy
      timeMs={timeMs}
      states={[
        {startMs: read, text: 'Не запрашивают изменение ресурса'},
        {startMs: cue('safe', 'p03-independent'), text: 'Клиент и сервер следуют общим правилам'},
        {startMs: retry - 350, text: 'Повтор не меняет ожидаемый результат'},
        {startMs: contract, text: 'Имя метода не контролирует обработчик'},
        {startMs: bad, text: 'Изменение баланса нарушает семантику GET'}
      ]}
      x={212}
      y={1220}
      fontSize={30} />
  </NarratedHttpScene>;
};
export default Composition;
