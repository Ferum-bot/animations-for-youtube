import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {OzonTheme} from '../../shared/theme';
import {DiagramArrow, DiagramNode} from '../../shared/expiry/Diagram';
import {relativeTime} from './cues';

const contenders = [
  {name: 'Expiry worker', y: 810, winner: true},
  {name: 'Sweeper', y: 955, winner: false},
  {name: 'Повтор сообщения', y: 1100, winner: false},
] as const;

const Race: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = ({timeMs, theme}) => {
  const won = timeMs >= relativeTime('cas-winner');
  const one = timeMs >= relativeTime('cas-one');
  const zero = timeMs >= relativeTime('cas-zero');
  const route = smoothProgress(timeMs, relativeTime('cas-condition'), relativeTime('cas-condition') + 650);
  return <>
    <text x={208} y={760} fontSize={29} fill={theme.comment}>Пример: три попытки истечения одной брони</text>
    {contenders.map((actor) => {
      const resolved = actor.winner ? one : zero;
      return <g key={actor.name}>
        <DiagramNode x={208} y={actor.y} width={430} title={actor.name}
          subtitle={resolved ? `rows affected = ${actor.winner ? 1 : 0}` : 'Пытается выполнить UPDATE'}
          theme={theme} accent={resolved && actor.winner ? theme.syntax.string : theme.line} />
        <path d={`M 654 ${actor.y + 56} C 740 ${actor.y + 56} 760 1011 854 1011`}
          stroke={resolved && actor.winner ? theme.syntax.string : theme.secondary} strokeWidth={2}
          fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - route} opacity={route} />
      </g>;
    })}
    <DiagramNode x={872} y={955} width={620} title="reservation_id = …"
      subtitle={won ? 'status = EXPIRED' : 'status = HELD'} theme={theme} accent={won ? theme.syntax.string : theme.secondary} />
    <text x={872} y={900} fontSize={29} fill={theme.text}>Одна строка PostgreSQL</text>
    {zero ? <text x={872} y={1150} fontSize={29} fill={theme.comment}>HELD больше не совпадает → 0 строк</text> : null}
    {one ? <text x={872} y={1210} fontSize={29} fill={theme.syntax.string}>Один победитель перехода</text> : null}
  </>;
};

const Delivery: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = ({timeMs, theme}) => {
  const event = smoothProgress(timeMs, relativeTime('cas-outbox') + 550, relativeTime('cas-outbox') + 1100);
  const worker = smoothProgress(timeMs, relativeTime('cas-worker'), relativeTime('cas-worker') + 550);
  const redis = smoothProgress(timeMs, relativeTime('cas-redis'), relativeTime('cas-redis') + 650);
  return <>
    <text x={208} y={770} fontSize={29} fill={theme.comment}>Победивший переход запускает возврат</text>
    <rect x={184} y={844} width={820} height={215} fill="none" stroke={theme.secondary} strokeWidth={2} strokeDasharray="6 7" />
    <text x={208} y={828} fontSize={25} fill={theme.secondary}>Одна транзакция PostgreSQL</text>
    <DiagramNode x={208} y={895} width={330} title="EXPIRED" subtitle="Новый статус" theme={theme} accent={theme.syntax.string} />
    <DiagramArrow x1={550} x2={636} y={951} progress={event} theme={theme} />
    <DiagramNode x={648} y={895} width={330} title="Outbox" subtitle="Событие возврата" theme={theme} opacity={event} accent={theme.secondary} />
    <DiagramArrow x1={1018} x2={1086} y={951} progress={worker} theme={theme} />
    <DiagramNode x={1100} y={895} width={250} title="Worker" subtitle="После COMMIT" theme={theme} opacity={worker} />
    <DiagramArrow x1={1364} x2={1436} y={951} progress={redis} theme={theme} />
    <DiagramNode x={1450} y={895} width={280} title="Redis" subtitle="Возврат единицы" theme={theme} opacity={redis} accent={theme.syntax.string} />
    <text x={208} y={1140} fontSize={29} fill={theme.text} opacity={worker}>Доставку можно повторить после сбоя.</text>
    <text x={208} y={1200} fontSize={29} fill={theme.syntax.string} opacity={redis}>Дедупликация по reservation_id → остаток увеличится один раз.</text>
  </>;
};

export const CasFlow: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = (props) => {
  const {timeMs} = props;
  const enter = smoothProgress(timeMs, relativeTime('cas-condition'), relativeTime('cas-condition') + 400);
  const switchAt = relativeTime('cas-outbox');
  const raceOpacity = enter * (1 - smoothProgress(timeMs, switchAt, switchAt + 250));
  const deliveryOpacity = smoothProgress(timeMs, switchAt + 300, switchAt + 600);
  return <>
    {raceOpacity > 0 ? <g opacity={raceOpacity}><Race {...props} /></g> : null}
    {deliveryOpacity > 0 ? <g opacity={deliveryOpacity}><Delivery {...props} /></g> : null}
  </>;
};
