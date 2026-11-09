import React from 'react';
import {Sheet, v2Theme as ink} from '@channel/motion-v2';
import {NotebookCover} from '../../shared/architecture/NotebookCover';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {replicas, type Host} from '../../shared/architecture/chat107';
import {cue} from './score';

const columnCenter = (index: number) => 209 + index * 295;
const peers = ['E', 'D', 'F'] as const;
const entryD: Route = {from: {x: 504, y: 607}, via: {x: 504, y: 700}, to: {x: 504, y: 790}};
const entryB: Route = {from: {x: 365, y: 607}, via: {x: 322, y: 875}, to: {x: 465, y: 1120}};

function nodeCopy(time: number) {
  if (time >= cue.arrives) return '№ 107';
  return 'чат 42';
}

function Server({x, y, host, marked, detail}: {
  readonly x: number; readonly y: number; readonly host: Host;
  readonly marked: boolean; readonly detail?: string;
}) {
  return <g transform={`translate(${x - 114} ${y})`}>
    <g transform="scale(0.43)"><NotebookCover/></g>
    {marked && <path d="M174 2 H205 V48 L189 38 L174 48 Z" fill={ink.primary}/>}
    <text x={39} y={detail ? 51 : 77} fontSize={56} fontWeight={700}>{host}</text>
    {detail && <text x={39} y={95} fontSize={32}>{detail}</text>}
  </g>;
}

export function Cluster({time}: {readonly time: number}) {
  const next = time >= cue.next;
  const request = time >= cue.request;
  const inFlight = next ? entryB : entryD;
  const start = next ? cue.next : cue.request;
  const status = (() => {
    if (time >= cue.local) return 'У B есть своя копия чата 42';
    if (next) return 'Следующий запрос идёт на B';
    if (time >= cue.done) return 'D собрал подтверждения';
    if (time >= cue.receives) return 'D координирует запись';
    if (time >= cue.rf) return 'RF = 3';
    if (time >= cue.cluster) return 'Шесть узлов в одном дата-центре';
    return 'Три копии одного чата';
  })();
  return <g>
    <text x={92} y={436} fontSize={52} fontWeight={650}>Приложение</text>
    <Sheet x={91} y={478} width={802} height={129}>
      <text x={35} y={83} fontSize={52} fontWeight={650}>
        {time >= cue.driver && !next ? 'Драйвер Cassandra' : next ? '№ 108  ·  «Ты где?»' : '№ 107  ·  «На платформе»'}
      </text>
    </Sheet>
    {request && <g>
      <RouteLine route={inFlight}/>
      <Delivery route={inFlight} timeMs={time} start={start} duration={next ? 1900 : cue.receives - start}/>
    </g>}
    {!next && time >= cue.fan && replicas.map((replica, index) => {
      const route: Route = {from: {x: 504, y: 905}, via: {x: columnCenter(index), y: 1018}, to: {x: columnCenter(index), y: 1120}};
      return <g key={replica}>
        <RouteLine route={route}/>
        <Delivery route={route} timeMs={time} start={cue.fan} duration={cue.arrives - cue.fan}/>
        <Delivery route={{from: route.to, via: route.via, to: route.from}} timeMs={time}
          start={cue.ack + 140 * index} duration={1020} kind="ack"/>
      </g>;
    })}
    {peers.map((host, index) => <g key={host} opacity={time < cue.cluster || (request && host !== 'D') ? 0.5 : 1}>
      <Server host={host} x={columnCenter(index)} y={790} marked={!next && host === 'D' && time >= cue.receives}/>
    </g>)}
    {replicas.map((host, index) => <Server key={host} host={host} x={columnCenter(index)} y={1120}
      marked={host === 'B' && time >= cue.next + 1900}
      detail={time < cue.cluster || time >= cue.copies ? nodeCopy(time) : undefined}/>)}
    <text x={90} y={1435} fontSize={48} fontWeight={630}>{status}</text>
  </g>;
}
