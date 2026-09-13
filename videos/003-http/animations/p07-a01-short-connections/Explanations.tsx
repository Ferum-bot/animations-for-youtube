import React from 'react';
import {Label, TimedCopy} from '../../shared/HttpDiagram';
import {Caption, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {Channel, DataBlock, EndpointLabels, Flight} from '../../shared/evolution/Elements';
import {ResourcePage} from '../../shared/evolution/ResourcePage';
import {cue, evolutionScenes} from '../../shared/evolution/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const open = cue('short', 'p07-evolution-open');
const request = cue('short', 'p07-evolution-request');
const response = cue('short', 'p07-evolution-response');
const close = cue('short', 'p07-evolution-close');
const page = cue('short', 'p07-evolution-page');
const resources = cue('short', 'p07-evolution-resources');
const cost = cue('short', 'p07-evolution-cost');

export const SingleExchange: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, 0, page)}>
  <Label x={212} y={490}>БАЗОВАЯ МОДЕЛЬ HTTP/1.0</Label>
  <g opacity={reveal(timeMs, cue('short', 'p07-evolution-version'))}>
    <EndpointLabels y={616} />
    <Channel y={785} open={reveal(timeMs, open, 650) * (1 - reveal(timeMs, close, 700))} label="TCP" />
    {['SYN', 'SYN/ACK', 'ACK'].map((label, i) => <Flight key={label} timeMs={timeMs} startMs={open + i * 580}
      durationMs={510} y={785} from={i === 1 ? 922 : 302} to={i === 1 ? 302 : 922} label={label} />)}
    <Flight timeMs={timeMs} startMs={request} durationMs={920} y={785} label="GET /" />
    <Flight timeMs={timeMs} startMs={response} durationMs={950} y={785} from={922} to={302} label="HTML" />
    <DataBlock x={260} y={937} label="HTML" opacity={reveal(timeMs, response + 950)} active />
    <g opacity={reveal(timeMs, close + 500)}><text x={820} y={974} fontFamily={theme.fontMono} fontSize={28} fill={theme.muted}>TCP закрыто</text></g>
  </g>
  <TimedCopy timeMs={timeMs} x={212} y={1200} fontSize={37} states={[
    {startMs: open, text: 'Установить соединение'}, {startMs: request, text: 'Отправить запрос'},
    {startMs: response, text: 'Получить ответ'}, {startMs: close, text: 'Закрыть соединение'},
  ]} />
</g>;

export const ResourceExpansion: React.FC<TimeProps> = ({timeMs}) => {
  const expanded = reveal(timeMs, resources, 1400) * (1 - reveal(timeMs, cost - 1400, 1000));
  const items = [
    {name: 'style.css', start: resources}, {name: 'hero.jpg', start: cue('short', 'p07-evolution-image')},
    {name: 'icon.svg', start: cue('short', 'p07-evolution-icon')},
  ] as const;
  return <g opacity={shotOpacity(timeMs, page, evolutionScenes.short.durationMs + 330)}>
    <Label x={212} y={490}>ОДНА СТРАНИЦА — НЕСКОЛЬКО РЕСУРСОВ</Label>
    <ResourcePage x={250} y={696} spread={expanded} />
    {items.map(({name, start}, i) => <g key={name} opacity={reveal(timeMs, start)}>
      <path d={`M 702 ${686 + i * 100} H 764`} stroke={theme.line} strokeWidth={2} />
      <DataBlock x={790} y={650 + i * 100} label={name} width={290} active={timeMs > cost + i * 750} />
    </g>)}
    <g opacity={reveal(timeMs, cost)}>
      <text x={250} y={1050} fontFamily={theme.fontMono} fontSize={23} fill={theme.muted}>НОВОЕ TCP</text>
      {[0, 1, 2].map(i => <g key={i} opacity={reveal(timeMs, cost + i * 750)}>
        <path d={`M ${460 + i * 215} 1028 v 36 h 150 v -36`} stroke={theme.line} strokeWidth={2} fill="none" />
        <path d={`M ${472 + i * 215} 1046 h 45`} stroke={theme.primary} strokeWidth={6} />
        <text x={532 + i * 215} y={1054} fontFamily={theme.fontMono} fontSize={22} fill={theme.muted}>↔</text>
      </g>)}
    </g>
    <Caption opacity={reveal(timeMs, resources)} detail={timeMs < cost ? 'HTML · стили · изображения · значки' : 'Перед каждым ресурсом — новое установление TCP'}>
      {timeMs < cost ? 'Каждому ресурсу нужен свой запрос' : 'Подготовка повторяется снова и снова'}
    </Caption>
  </g>;
};
